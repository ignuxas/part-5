import { data } from 'autoprefixer'
import axios from 'axios'

export const api = {}

const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE2NzgzNjY5ODgsImlkIjoidWx6YWlxa2U4eDB4ZGkxIiwidHlwZSI6ImF1dGhSZWNvcmQifQ.MKBVAmqknF24vtzgNihpC57Ny1qWEFoCqeSEM4GWUtI"

const headers = { // CHANGE THIS
    'Authorization': 'Bearer ' + defaultToken,
}

api.http = axios.create({
    baseURL: 'http://127.0.0.1:8090/api',
    timeout: 2000,
})

// ------------------------
//       GET CALLS 
// ------------------------

api.getEmployees = async function () {
    const setEmployees = (employees) => api.store.commit('items/setEmployees', employees)
    const setTotalPages = (totalPages) => api.store.commit('page/setTotalPages', totalPages)
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
        expand: 'office_id,company_id,department_id,division_id',
        page, perPage,
        // pocketbase - trash filtering system: doesn't except empty values, can't use && with no end and other dumb stuff
        filter: filterWithValuesLen || search ? '(' + Object.keys(filtersWithValues).map((key) => `${key}='${filtersWithValues[key]}'`).join('&&') + `${filterWithValuesLen?'&&':''}(email~'${search}'||name~'${search}'||surname~'${search}')` +')' : '',
        //        filter: Object.keys(filtersWithValues).length ? '(' + Object.keys(filtersWithValues).map((key, index) => `${key}='${filtersWithValues[key]}'${index !== Object.keys(filtersWithValues).length-1 ? '&&' : ''}`).join('') + ')' : '',
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
    const setEmployee = (employee) => api.store.commit('items/setEmployee', employee)
    
    const params = {
        expand: 'office_id,company_id,department_id,division_id',
    }
    try {
        const response = await api.http.get(`/collections/employees/records/${id}`, { headers
        , params })
        setEmployee(response.data)
    } catch (error) {console.log(error)}
}

api.getCompanies = async function () {
    const setCompanies = (companies) => api.store.commit('items/setCompanies', companies)
    try {
        const response = await api.http.get('/collections/companies/records', 
        { headers })
        setCompanies(response.data)
    } catch (error) {console.log(error)}
}

api.getDepartments = async function () {
    const setDepartments = (departments) => api.store.commit('items/setDepartments', departments)

    try {
        const response = await api.http.get('/collections/departments/records',
        { headers })
        setDepartments(response.data)
    } catch (error) {console.log(error)}
}

api.getDivisions = async function () {
    const setDivisions = (divisions) => api.store.commit('items/setDivisions', divisions)

    try {
        const response = await api.http.get('/collections/divisions/records',
        { headers })
        setDivisions(response.data)
    } catch (error) {console.log(error)}
}

api.getGroups = async function () {
    const setGroups = (groups) => api.store.commit('items/setGroups', groups)
    
    try {
        const response = await api.http.get('/collections/groups/records',
        { headers })
        setGroups(response.data)
    } catch (error) {console.log(error)}
}

api.getOffices = async function () {
    const setOffices = (offices) => api.store.commit('items/setOffices', offices)

    try {
        const response = await api.http.get('/collections/offices/records',
        { headers })
        setOffices(response.data)
    } catch (error) {console.log(error)}
}

// ------------------------
//       LOGIN
// ------------------------

api.login = async function (identity=null, password=null) {
    if(api.store.getters['user/getToken'] && api.store.getters['user/getUser']) return { data: null, status: 200 }

    const setToken = (token) => api.store.commit('user/setToken', token)
    const setUser = (user) => api.store.commit('user/setUser', user)
    const toggleStatus = (status) => api.store.commit('page/toggleStatus', status)

    //check if token and user are in local storage
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    console.log(token)
    console.log(user)
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
    const toggleStatus = (status) => api.store.commit('page/toggleStatus', status)
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
    const toggleStatus = (status) => api.store.commit('page/toggleStatus', status)
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.put(`/collections/employees/records/${employee.id}`,
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

api.deleteEmployee = async function (id) {
    const toggleStatus = (status) => api.store.commit('page/toggleStatus', status)
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.delete(`/collections/employees/records/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })
        
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
    const toggleStatus = (status) => api.store.commit('page/toggleStatus', status)
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
    const toggleStatus = (status) => api.store.commit('page/toggleStatus', status)
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

api.deleteCompany = async function (id) {
    const toggleStatus = (status) => api.store.commit('page/toggleStatus', status)
    const token = api.store.getters['user/getToken']

    try {
        const response = await api.http.delete(`/collections/companies/records/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })

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

export default {
    install(Vue, store) {
        api.store = store
        Vue.prototype.$api = api
    }
}

