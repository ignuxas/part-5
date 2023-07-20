import axios from 'axios'

export const api = {}

const headers = { // CHANGE THIS
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE2NzgzNjY5ODgsImlkIjoidWx6YWlxa2U4eDB4ZGkxIiwidHlwZSI6ImF1dGhSZWNvcmQifQ.MKBVAmqknF24vtzgNihpC57Ny1qWEFoCqeSEM4GWUtI',
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
        expand: 'office_id',
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



api.getCompanies = async function (min=false) {
    const setCompanies = (companies) => api.store.commit('items/setCompanies', companies)
    const setCompaniesMin = (companies) => api.store.commit('items/setCompaniesMin', companies)

    try {
        const response = await api.http.get('/collections/companies/records', 
        { headers,
            params: { 
                fields: min ? 'id,name' : '*',
        }})
        min ? setCompaniesMin(response.data) : setCompanies(response.data)
    } catch (error) {console.log(error)}
}

api.getDepartments = async function (min=false) {
    const setDepartments = (departments) => api.store.commit('items/setDepartments', departments)
    const setDepartmentsMin = (departments) => api.store.commit('items/setDepartmentsMin', departments)

    try {
        const response = await api.http.get('/collections/departments/records',
        { headers,
            params: {
                fields: min ? 'id,name' : '*',
        }})
        min ? setDepartmentsMin(response.data) : setDepartments(response.data)
    } catch (error) {console.log(error)}
}

api.getDivisions = async function (min=false) {
    const setDivisions = (divisions) => api.store.commit('items/setDivisions', divisions)
    const setDivisionsMin = (divisions) => api.store.commit('items/setDivisionsMin', divisions)

    try {
        const response = await api.http.get('/collections/divisions/records',
        { headers,
            params: {
                fields: min ? 'id,name' : '*',
        }})
        min ? setDivisionsMin(response.data) : setDivisions(response.data)
    } catch (error) {console.log(error)}
}

api.getGroups = async function (min=false) {
    const setGroups = (groups) => api.store.commit('items/setGroups', groups)
    const setGroupsMin = (groups) => api.store.commit('items/setGroupsMin', groups)
    
    try {
        const response = await api.http.get('/collections/groups/records',
        { headers,
            params: {
                fields: min ? 'id,name' : '*',
        }})
        min ? setGroupsMin(response.data) : setGroups(response.data)
    } catch (error) {console.log(error)}
}

api.getOffices = async function (min=false) {
    const setOffices = (offices) => api.store.commit('items/setOffices', offices)
    const setOfficesMin = (offices) => api.store.commit('items/setOfficesMin', offices)

    try {
        const response = await api.http.get('/collections/offices/records',
        { headers,
            params: {
                fields: min ? 'id,name' : '*',
        }})
        min ? setOfficesMin(response.data) : setOffices(response.data)
    } catch (error) {console.log(error)}
}

export default {
    install(Vue, store) {
        api.store = store
        Vue.prototype.$api = api
    }
}

