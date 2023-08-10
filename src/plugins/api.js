import axios from 'axios'
import items from '../store/modules/items'

export const api = {}

const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE2OTE3NDIzNTgsImlkIjoiMmVsN3I1Y3U3MTJjZmJzIiwidHlwZSI6ImF1dGhSZWNvcmQifQ.NZrGjD8EbvFhR_-lLSwfVT0xDvQmRyRzyIx3uKfhE0c"

const headers = { // CHANGE THIS
    'Authorization': 'Bearer ' + defaultToken,
}

api.http = axios.create({
    baseURL: 'http://127.0.0.1:8090/api',
    timeout: 2000,
})

// SETTERS -------------------
const setEmployees = (employees) => api.store.commit('items/setEmployees', employees)
const setEmployee = (employee) => api.store.commit('items/setEmployee', employee)

const setTotalPages = (totalPages) => api.store.commit('page/setTotalPages', totalPages)
const setUsers = (users) => api.store.commit('items/setUsers', users)

const setCompanies = (companies) => api.store.commit('items/setCompanies', companies)
const setDepartments = (departments) => api.store.commit('items/setDepartments', departments)
const setDivisions = (divisions) => api.store.commit('items/setDivisions', divisions)
const setGroups = (groups) => api.store.commit('items/setGroups', groups)
const setOffices = (offices) => api.store.commit('items/setOffices', offices)

const setToken = (token) => api.store.commit('user/setToken', token)
const setUser = (user) => api.store.commit('user/setUser', user)
const toggleStatus = (status) => api.store.commit('page/toggleStatus', status)

// ------------------------
//  GENERAL USE FUNCTIONS
// ------------------------

function unPlurafy (string) {
    if(string.endsWith('ies')) return string.slice(0, -3) + 'y'
    else if(string.endsWith('s')) return string.slice(0, -1)
    else return string
}

api.reqDelete = async function (id, type) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.delete(`/collections/${type}/records/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })
        toggleStatus(response.status)

        //if response is ok
        if(response.status >= 200 && response.status < 300) {/*continue*/}
        else { throw new Error(response.status) }

        if(type === 'employees') api.getEmployees()
        else if(type === 'companies') api.getCompanies()
        else if(type === 'departments') api.getDepartments()
        else if(type === 'divisions') api.getDivisions()
        else if(type === 'groups') api.getGroups()
        else if(type === 'offices') api.getOffices()
        else if(type === 'users') api.getUsers()

        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        return { data: null, status: 400 }
    }
}

api.createRelation = async function (relation, id, relationName, type) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post(`/collections/${relationName}_${type}/records`, {
            [`${unPlurafy(relationName)}_id`]: relation,
            [`${unPlurafy(type)}_id`]: id,
        }, { headers: { Authorization: `Bearer ${token}` } })
        toggleStatus(response.status)

        //if response is ok
        if(response.status >= 200 && response.status < 300) { return { data: response.data, status: response.status }}
        else { throw new Error(response.status) }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.reqUpdateStructure = async function (data, relations, type) {
    const token = api.store.getters['user/getToken']
    const item = api.store.getters['items/getCurrentItem']

    const id = item.id

    try { 
        const response = await api.http.patch(`/collections/${type}/records/${id}`, data,
        { headers: { Authorization: `Bearer ${token}` } })
        
        let responses = [response.status]

        // if relations are different, delete all relations and add new ones
        let promise = new Promise( async (resolve, reject) =>
            Object.keys(item.relations).forEach(async relationName => {
            const currentRelationsList = item.relations[relationName].map(relation => relation[`${unPlurafy(relationName)}_id`])
            if(JSON.stringify(currentRelationsList) !== JSON.stringify(relations)) { // doesn't work because one of the arrays has an observer
                for (const relation of item.relations[relationName]){ // delete all relations
                    const delRes = await api.reqDelete(relation.id, `${relationName}_${type}`)
                    responses.push(delRes.status)
                }

                for (const relation of relations){ // add new relations
                    const addRes = await api.createRelation(relation, id, relationName, type)
                    responses.push(addRes.status)
                }
            }
            resolve(responses)
        }))

        responses = await promise
        if(responses.every((val) => val >= 200 && val < 300)) {
            console.log('all responses ok,', type)
            if(type === 'employees') await api.getEmployees()
            else if(type === 'companies') await api.getCompanies()
            else if(type === 'departments') await api.getDepartments()
            else if(type === 'divisions') await api.getDivisions()
            else if(type === 'groups') await api.getGroups()
            else if(type === 'offices') await api.getOffices()
            else if(type === 'users') await api.getUsers()
        } else { throw new Error(responses) }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.getRelationsFunction = async function (id, type, relationName, setFunc, reverse = false, getFunc) {
    const token = api.store.getters['user/getToken']
    const relationsList = { items: [] }

    if(!id) return getFunc()

    try {
        
        let realtionsRes = null
        if(!reverse) realtionsRes = await api.http.get(`/collections/${type}/records/${id}?expand=${relationName}_${type}(${unPlurafy(type)}_id).${unPlurafy(relationName)}_id`, { headers: { Authorization: `Bearer ${token}` } })
        else realtionsRes = await api.http.get(`/collections/${type}/records/${id}?expand=${type}_${relationName}(${unPlurafy(type)}_id).${unPlurafy(relationName)}_id`, { headers: { Authorization: `Bearer ${token}` } })
        
        let relations = null
        if(!reverse) relations = realtionsRes.data.expand[`${relationName}_${type}(${unPlurafy(type)}_id)`]
        else relations = realtionsRes.data.expand[`${type}_${relationName}(${unPlurafy(type)}_id)`]
        
        relations.forEach(relation => { relationsList.items.push(relation.expand[`${unPlurafy(relationName)}_id`]) })
        setFunc(relationsList)

    } catch (error) {console.log(error); setFunc({items: []})}
}
       

// ------------------------
//       GET CALLS 
// ------------------------
api.getEmployees = async function () {
    const page = api.store.getters['page/getCurrentPage']
    const perPage = api.store.getters['page/getPostsPerPage']
    const search = api.store.getters['page/getSearch']

    const filters = {
        company_id: api.store.getters['page/getSelectedCompany'].id,
        department_id: api.store.getters['page/getSelectedDepartment'].id,
        division_id: api.store.getters['page/getSelectedDivision'].id,
        group_id: api.store.getters['page/getSelectedGroup'].id,
        office_id: api.store.getters['page/getSelectedOffice'].id,
    }

    let filtersWithValues = {}
    Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) filtersWithValues[key] = filters[key]
    })
    let filterWithValuesLen = Object.keys(filtersWithValues).length

    const params = {
        expand: 'office_id,company_id,department_id,division_id,group_id',
        page, perPage,
        // pocketbase - trash filtering system: doesn't except empty values, can't use && with nothing after it and other dumb stuff
        filter: filterWithValuesLen || search ? '(' + Object.keys(filtersWithValues).map((key) => `${key}='${filtersWithValues[key]}'`).join('&&') + `${filterWithValuesLen?'&&':''}(email~'${search}'||name~'${search}'||surname~'${search}')` +')' : '',
    }

    try {
        const response = await api.http.get('/collections/employees/records', 
        { headers, params})
        setTotalPages(response.data.totalPages)
        setEmployees(response.data)
    }
    catch (error) {
        console.log(error)
        console.log("ERROR IN GET EMPLOYEES")
    }
}

api.getEmployee = async function (id) {
    const params = {
        expand: 'office_id,company_id,department_id,division_id',
    }
    try {
        const response = await api.http.get(`/collections/employees/records/${id}`, { headers
        , params })
        setEmployee(response.data)
    } catch (error) {console.log(error)}
}

api.getUsers = async function () {
    const token = api.store.getters['user/getToken']

    const params = {
        expand: 'permissions_id',
    }

    try {
        const response = await api.http.get('/collections/users/records',
        { headers: { Authorization: `Bearer ${token}` }, params })
        setUsers(response.data.items)
    } catch (error) {console.log(error)}
}

api.getCompanies = async function () {
    try {
        const response = await api.http.get('/collections/companies/records', 
        { headers })
        setCompanies(response.data)
    } catch (error) {console.log(error)}
}

api.getDepartments = async function () {
    try {
        const response = await api.http.get('/collections/departments/records', { headers })
        if(response.status >= 200 && response.status < 300) {
            let departments = response.data
            // get divisions & attach them to departments
            const params = { fields: 'department_id,division_id,id' }
            let divisions = await api.http.get('/collections/divisions_departments/records', { headers, params })
            divisions = divisions.data.items
            departments.items.forEach(department => {
                department.relations = {}
                department.relations.divisions = divisions.filter(division => division.department_id === department.id)
            })
            setDepartments(departments)
        }
    } catch (error) {console.log(error)}
}

api.getDivisions = async function () {
    try {
        const response = await api.http.get('/collections/divisions/records', { headers })
        if(response.status >= 200 && response.status < 300) {
            let divisions = response.data
            // get offices & attach them to divisions
            const params = { fields: 'division_id,office_id,id' }
            let offices = await api.http.get('/collections/offices_divisions/records', { headers, params })
            offices = offices.data.items
            divisions.items.forEach(division => {
                division.relations = {}
                division.relations.offices = offices.filter(office => office.division_id === division.id)
            })
            setDivisions(divisions)
        }
    } catch (error) {console.log(error)}
}

api.getGroups = async function () {
    try {
        const response = await api.http.get('/collections/groups/records', { headers })
        if(response.status >= 200 && response.status < 300) {
            let groups = response.data
            // get departments & attach them to groups
            const params = { fields: 'group_id,department_id,id' }
            let departments = await api.http.get('/collections/departments_groups/records', { headers, params })
            departments = departments.data.items
            groups.items.forEach(group => {
                group.relations = {}
                group.relations.departments = departments.filter(department => department.group_id === group.id)
            })
            setGroups(groups)
        }

    } catch (error) {console.log(error)}
}

api.getOffices = async function () {
    try {
        const response = await api.http.get('/collections/offices/records', { headers })
        if(response.status >= 200 && response.status < 300) {
            let offices = response.data
            // get companies & attach them to offices
            const params = { fields: 'office_id,company_id,id' }
            let companies = await api.http.get('/collections/companies_offices/records', { headers, params })
            companies = companies.data.items
            offices.items.forEach(office => {
                office.relations = {}
                office.relations.companies = companies.filter(company => company.office_id === office.id)
            })
            setOffices(offices)
        }
    } catch (error) {console.log(error)}
}

api.updateFilters = async function (id, type) {
    if(type === 'offices') {
        api.getRelationsFunction(id, type, 'companies', setCompanies, false, api.getCompanies)
        api.getRelationsFunction(id, type, 'divisions', setDivisions, true, api.getDivisions)
    } else if(type === 'divisions') {
        api.getRelationsFunction(id, type, 'offices', setOffices, false, api.getOffices)
        api.getRelationsFunction(id, type, 'departments', setDepartments, true, api.getDepartments)
    } else if(type === 'departments') {
        api.getRelationsFunction(id, type, 'divisions', setDivisions, false, api.getDivisions)
        api.getRelationsFunction(id, type, 'groups', setGroups, true, api.getGroups)
    } else if ( type === 'groups' ) {
        api.getRelationsFunction(id, type, 'departments', setDepartments, false, api.getDepartments)
    } else if ( type === 'companies' ) {
        api.getRelationsFunction(id, type, 'offices', setOffices, true, api.getOffices)
    } 
}

// ------------------------
//       LOGIN
// ------------------------

api.login = async function (identity=null, password=null, skipCheck=false) {
    if(!skipCheck) {
        if(api.store.getters['user/getToken'] && api.store.getters['user/getUser']) return { data: null, status: 200 }
    }
    //check if token and user are in local storage
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if(token && user) {
        setToken(token)
        setUser(JSON.parse(user))
        return { data: null, status: 200 }
    }

    const params = {
        expand: 'permissions_id',
    }

    if(identity && password){
        try {
            const response = await api.http.post('/collections/users/auth-with-password',
            { identity, password, }, { headers, params })
            if(response.status >= 200 && response.status < 300) {
                setToken(response.data.token)
                setUser(response.data.record)

                localStorage.setItem('token', response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.record))
            }
            toggleStatus(response.status)
            return { data: response.data, status: response.status, }
        } catch (error) {
            console.log(error)
            toggleStatus(400)
            return { data: null, status: 400 }
        }
    }
}

api.logout = async function () {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    api.store.commit('user/setToken', null)
    api.store.commit('user/setUser', {})
}


// ------------------------
//       EMPLOYEES
// ------------------------

api.createEmployee = async function (employee) {
    const token = api.store.getters['user/getToken']

    console.log(employee)

    try {
        const response = await api.http.post('/collections/employees/records',
        employee, { headers: { Authorization: `Bearer ${token}` } })
        
        toggleStatus(response.status)
        api.getEmployees()
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.updateEmployee = async function (employee) {
    const token = api.store.getters['user/getToken']

    console.log("data (API updateEmployee):", employee)
    try {
        const response = await api.http.patch(`/collections/employees/records/${employee.id}`,
        employee, { headers: { Authorization: `Bearer ${token}` } })

        toggleStatus(response.status)
        api.getEmployees()
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

// ------------------------
//       COMPANIES
// ------------------------

api.createCompany = async function (company) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post('/collections/companies/records',
        company, { headers: { Authorization: `Bearer ${token}` } })

        toggleStatus(response.status)
        api.getCompanies()
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.updateCompany = async function (company) {
    const token = api.store.getters['user/getToken']
    
    try {
        const response = await api.http.patch(`/collections/companies/records/${company.id}`,
        company, { headers: { Authorization: `Bearer ${token}` } })

        toggleStatus(response.status)
        api.getCompanies()
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

// ------------------------
//       USERS 
// ------------------------

// ---------- Permissions ----------
api.createPermission = async function (permission) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post('/collections/user_permissions/records',
        permission, { headers: { Authorization: `Bearer ${token}` } })
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}
api.editPermission = async function (permission) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.patch(`/collections/user_permissions/records/${permission.id}`,
        permission, { headers: { Authorization: `Bearer ${token}` } })
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

// ---------- Users ----------
api.createUser = async function (user, permissions) {
    const token = api.store.getters['user/getToken']
    const randomPassword = Math.random().toString(36).slice(-8)

    console.log(token)

    const permissionResponse = await api.createPermission(permissions)
    if(permissionResponse.status !== 200) return { data: null, status: 400 }

    user = {
        ...user,
        emailVisibility: true,
        password: randomPassword,
        passwordConfirm: randomPassword,
        permissions_id: permissionResponse.data.id,
    }

    try {
        const response = await api.http.post('/collections/users/records',
        user, { headers: { Authorization: `Bearer ${token}` } })

        toggleStatus(response.status)
        api.getUsers()
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        // delete permission if user creation fails
        await api.reqDelete(permissionResponse.data.id, 'user_permissions')
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.updateUser = async function (user, permissions) {
    const token = api.store.getters['user/getToken']
    
    const permissionResponse = await api.editPermission(permissions)
    if(permissionResponse.status !== 200) return { data: null, status: 400 }

    const params = {
        expand: 'permissions_id',
    }

    user = {
        ...user,
        permissions_id: permissionResponse.data.id,
    }

    try {
        const response = await api.http.patch(`/collections/users/records/${user.id}`,
        user, { headers: { Authorization: `Bearer ${token}` }, params })
        toggleStatus(response.status)
        api.getUsers()
        setUser(response.data)
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        // delete permission if user update fails
        await api.sendDelReq(permissionResponse.data.id, 'user_permissions')
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

// ------------------------
//       OFFICES
// ------------------------

api.createOffice = async function (office, companies) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post('/collections/offices/records',
        office, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }

        let responses = [response.status]
        for (const company of companies) {
            const addRelReq = await api.createRelation(company, response.data.id, 'companies', 'offices')
            responses.push(addRelReq.status)
        }
        
        // if all status codes are ok
        if (responses.every((val) => val >= 200 && val < 300)) {
            toggleStatus(200)
            api.getOffices()
            return { data: response.data, status: response.status }
        } else { throw new Error('Error creating office') }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

// ------------------------
//      DIVISIONS
// ------------------------

api.createDivision = async function (division, offices) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post('/collections/divisions/records',
        division, { headers: { Authorization: `Bearer ${token}` } })

        let responses = [response.status]

        for (const office of offices) {
            const addRelReq = await api.createRelation(office, response.data.id, 'offices', 'divisions')
            responses.push(addRelReq.status)
        }

        // if all status codes are ok
        if(responses.every((val) => val >= 200 && val < 300)) {
            toggleStatus(200)
            api.getDivisions()
            return { data: response.data, status: response.status }
        } else { throw new Error('Division creation failed') }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

// ------------------------
//      DEPARTMENTS
// ------------------------

api.createDepartment = async function (department, divisions) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post('/collections/departments/records',
        department, { headers: { Authorization: `Bearer ${token}` } })

        let responses = [response.status]
        for (const division of divisions) {
            const addRelReq = await api.createRelation(division, response.data.id, 'divisions', 'departments')
            responses.push(addRelReq.status)
        }

        // if all status codes are ok
        if(responses.every((val) => val >= 200 && val < 300)) {
            toggleStatus(200)
            api.getDepartments()
            return { data: response.data, status: response.status }
        } else { throw new Error('Department creation failed') } 
    } catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}
// ------------------------
//      GROUPS
// ------------------------

api.createGroup = async function (group, departments) {
    const token = api.store.getters['user/getToken']
    
    try {
        const response = await api.http.post('/collections/groups/records',
        group, { headers: { Authorization: `Bearer ${token}` } })

        let responses = [response.status]
        for (const department of departments) {
            const addRelReq = await api.createRelation(department, response.data.id, 'departments', 'groups')
            responses.push(addRelReq.status)
        }

        // if all status codes are ok
        if(responses.every((val) => val >= 200 && val < 300)) {
            toggleStatus(200)
            api.getGroups()
            return { data: response.data, status: response.status }
        } else { throw new Error('Group creation failed') }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

// ------------------------
// ------------------------
// ------------------------
export default {
    install(Vue, store) {
        api.store = store
        Vue.prototype.$api = api
    }
}

