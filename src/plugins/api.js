import axios from 'axios'

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

api.reqDelete = async function (id, type) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.delete(`/collections/${type}/records/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })
        toggleStatus(response.status)

        if(response.status !== 200) return { data: null, status: 400 }

        if(type === 'employees') api.getEmployees()
        else if(type === 'companies') api.getCompanies()
        else if(type === 'departments') api.getDepartments()
        else if(type === 'divisions') api.getDivisions()
        else if(type === 'groups') api.getGroups()
        else if(type === 'offices') api.getOffices()

        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        return { data: null, status: 400 }
    }
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
        // pocketbase - trash filtering system: doesn't except empty values, can't use && with no end and other dumb stuff
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
        console.log(response.data)
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
        const response = await api.http.get('/collections/departments/records',
        { headers })
        setDepartments(response.data)
    } catch (error) {console.log(error)}
}

api.getDivisions = async function () {
    try {
        const response = await api.http.get('/collections/divisions/records',
        { headers })
        setDivisions(response.data)
    } catch (error) {console.log(error)}
}

api.getGroups = async function () {
    try {
        const response = await api.http.get('/collections/groups/records',
        { headers })
        setGroups(response.data)
    } catch (error) {console.log(error)}
}

api.getOffices = async function () {
    try {
        const response = await api.http.get('/collections/offices/records',
        { headers })
        setOffices(response.data)
    } catch (error) {console.log(error)}
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
            if(response.status === 200) {
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
        await api.sendDelReq(permissionResponse.data.id, 'user_permissions')
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
api.createCompanyOfficeRelation = async function (company_id, office_id) {
    const token = api.store.getters['user/getToken']
    try {
        const response = await api.http.post('/collections/companies_offices/records',
        { company_id, office_id }, { headers: { Authorization: `Bearer ${token}` } })
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.createOffice = async function (office, companies) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post('/collections/offices/records',
        office, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }
        
        let responses = [response.status]
        for (const company of companies) {
            await api.createCompanyOfficeRelation(company, response.data.id)
            responses.push(response.status)
        }
        
        // if all status codes are 200
        if(responses.every((val, i, arr) => val === arr[0])) {
            toggleStatus(response.status)
            api.getOffices()
            return { data: response.data, status: response.status }
        } else {
            toggleStatus(400)
            return { data: null, status: 400 }
        }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.updateOffice = async function (office, companies) { // UPDATE THIS <<<<<<<<<<<<<<<<<<<
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.patch(`/collections/offices/records/${office.id}`,
        office, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }

        let responses = [response.status]
        for (const company of companies) {
            await api.createCompanyOfficeRelation(company, response.data.id)
            responses.push(response.status)
        }
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
api.createOfficeDivisionRelation = async function (office_id, division_id) {
    const token = api.store.getters['user/getToken']
    try {
        const response = await api.http.post('/collections/offices_divisions/records',
        { office_id, division_id }, { headers: { Authorization: `Bearer ${token}` } })
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        return { data: null, status: 400 }
    }
}

api.createDivision = async function (division, offices) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post('/collections/divisions/records',
        division, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }
        
        let responses = [response.status]
        for (const office of offices) {
            await api.createOfficeDivisionRelation(office, response.data.id)
            responses.push(response.status)
        }

        // if all status codes are 200
        if(responses.every((val, i, arr) => val === arr[0])) {
            toggleStatus(response.status)
            api.getDivisions()
            return { data: response.data, status: response.status }
        } else {
            toggleStatus(400)
            return { data: null, status: 400 }
        }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.updateDivision = async function (division, offices) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.patch(`/collections/divisions/records/${division.id}`,
        division, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }

        let responses = [response.status]
        for (const office of offices) {
            await api.createOfficeDivisionRelation(office, response.data.id)
            responses.push(response.status)
        }

        // if all status codes are 200
        if(responses.every((val, i, arr) => val === arr[0])) {
            toggleStatus(response.status)
            api.getDivisions()
            return { data: response.data, status: response.status }
        } else {
            toggleStatus(400)
            return { data: null, status: 400 }
        }
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

api.createDivisionDepartmentRelation = async function (division_id, department_id) {
    const token = api.store.getters['user/getToken']
    try {
        const response = await api.http.post('/collections/divisions_departments/records',
        { division_id, department_id }, { headers: { Authorization: `Bearer ${token}` } })
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        return { data: null, status: 400 }
    }
}

api.createDepartment = async function (department, divisions) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.post('/collections/departments/records',
        department, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }
        
        let responses = [response.status]
        for (const division of divisions) {
            await api.createDivisionDepartmentRelation(division, response.data.id)
            responses.push(response.status)
        }

        // if all status codes are 200
        if(responses.every((val, i, arr) => val === arr[0])) {
            toggleStatus(response.status)
            api.getDepartments()
            return { data: response.data, status: response.status }
        } else {
            toggleStatus(400)
            return { data: null, status: 400 }
        }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.updateDepartment = async function (department, divisions) {
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.patch(`/collections/departments/records/${department.id}`,
        department, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }

        let responses = [response.status]
        for (const division of divisions) {
            await api.createDivisionDepartmentRelation(division, response.data.id)
            responses.push(response.status)
        }

        // if all status codes are 200
        if(responses.every((val, i, arr) => val === arr[0])) {
            toggleStatus(response.status)
            api.getDepartments()
            return { data: response.data, status: response.status }
        } else {
            toggleStatus(400)
            return { data: null, status: 400 }
        }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

// ------------------------
//      GROUPS
// ------------------------
api.createDepartmentGroupRelation = async function (department_id, group_id) {
    const token = api.store.getters['user/getToken']
    try {
        const response = await api.http.post('/collections/departments_groups/records',
        { department_id, group_id }, { headers: { Authorization: `Bearer ${token}` } })
        return { data: response.data, status: response.status }
    }
    catch (error) {
        console.log(error)
        return { data: null, status: 400 }
    }
}

api.createGroup = async function (group, departments) {
    const token = api.store.getters['user/getToken']
    
    try {
        const response = await api.http.post('/collections/groups/records',
        group, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }

        let responses = [response.status]
        for (const department of departments) {
            await api.createDepartmentGroupRelation(department, response.data.id)
            responses.push(response.status)
        }

        // if all status codes are 200
        if(responses.every((val, i, arr) => val === arr[0])) {
            toggleStatus(response.status)
            api.getGroups()
            return { data: response.data, status: response.status }
        } else {
            toggleStatus(400)
            return { data: null, status: 400 }
        }
    }
    catch (error) {
        console.log(error)
        toggleStatus(400)
        return { data: null, status: 400 }
    }
}

api.updateGroup = async function (group, departments) {
    const token = api.store.getters['user/getToken']
    
    try {
        const response = await api.http.patch(`/collections/groups/records/${group.id}`,
        group, { headers: { Authorization: `Bearer ${token}` } })

        if(response.status !== 200) return { data: null, status: 400 }

        let responses = [response.status]
        for (const department of departments) {
            await api.createDepartmentGroupRelation(department, response.data.id)
            responses.push(response.status)
        }

        // if all status codes are 200
        if(responses.every((val, i, arr) => val === arr[0])) {
            toggleStatus(response.status)
            api.getGroups()
            return { data: response.data, status: response.status }
        } else {
            toggleStatus(400)
            return { data: null, status: 400 }
        }
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

