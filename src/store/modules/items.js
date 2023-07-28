const state = {
    employees: [],
    currentEmployee: {},

    companies: [],
    departments: [],
    divisions: [],
    groups: [],
    offices: [],

    currentCompany: {},

    users: [],
    currentUser: {}
}

const getters = {
    getEmployees: state => state.employees,
    getEmployee: state => state.currentEmployee,

    getCompanies: state => state.companies,
    getDepartments: state => state.departments,
    getDivisions: state => state.divisions,
    getGroups: state => state.groups,
    getOffices: state => state.offices,
    
    getStructure: state => {
        // check if all items are loaded
        if (state.companies.length === 0 || state.departments.length === 0 || state.divisions.length === 0 || state.groups.length === 0 || state.offices.length === 0) return {}
        
        return {
            Skyrius: state.departments.items,
            Padalinys: state.divisions.items,
            Grupė: state.groups.items,
            Ofisas: state.offices.items,
        }
    },

    getCompany: state => state.currentCompany,

    getUsers: state => state.users,
    getUser: state => state.currentUser,
}

const actions = {}

const mutations = {
    setEmployees(state, employees) {state.employees = employees},
    setEmployee(state, employee) {state.currentEmployee = employee},
    setCompanies(state, companies) {state.companies = companies},
    setDepartments(state, departments) {state.departments = departments},
    setDivisions(state, divisions) {state.divisions = divisions},
    setGroups(state, groups) {state.groups = groups},
    setOffices(state, offices) {state.offices = offices},

    setCompany(state, company) {state.currentCompany = company},

    setUsers(state, users) {state.users = users},
    setUser(state, user) {state.currentUser = user},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}