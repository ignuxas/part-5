const state = {
    employees: [],
    currentEmployee: {},

    companies: [],
    departments: [],
    divisions: [],
    groups: [],
    offices: [],

    currentCompany: {},

}

const getters = {
    getEmployees: state => state.employees,
    getEmployee: state => state.currentEmployee,

    getCompanies: state => state.companies,
    getDepartments: state => state.departments,
    getDivisions: state => state.divisions,
    getGroups: state => state.groups,
    getOffices: state => state.offices,

    getCompany: state => state.currentCompany,
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
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}