const state = {
    employees: [],
    currentEmployee: {},

    companiesMin: [],
    departmentsMin: [],
    divisionsMin: [],
    groupsMin: [],
    officesMin: [],

    companies: [],
    departments: [],
    divisions: [],
    groups: [],
    offices: [],
}

const getters = {
    getEmployees: state => state.employees,
    getEmployee: state => state.currentEmployee,

    getCompanies: state => state.companies,
    getDepartments: state => state.departments,
    getDivisions: state => state.divisions,
    getGroups: state => state.groups,
    getOffices: state => state.offices,

    getCompaniesMin: state => state.companiesMin,
    getDepartmentsMin: state => state.departmentsMin,
    getDivisionsMin: state => state.divisionsMin,
    getGroupsMin: state => state.groupsMin,
    getOfficesMin: state => state.officesMin,
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

    setCompaniesMin(state, companies) {state.companiesMin = companies},
    setDepartmentsMin(state, departments) {state.departmentsMin = departments},
    setDivisionsMin(state, divisions) {state.divisionsMin = divisions},
    setGroupsMin(state, groups) {state.groupsMin = groups},
    setOfficesMin(state, offices) {state.officesMin = offices},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}