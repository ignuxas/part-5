const state = {
    employees: [],
    currentEmployee: {},

    companies: [],
    departments: [],
    divisions: [],
    groups: [],
    offices: [],

    currentItem: {},
    currentCompany: {},

    users: [],
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
    getCurrentItem: state => state.currentItem,

    getUsers: state => state.users,
}

const actions = {
    // ------------------------
    //       COMPANIES
    // ------------------------

    async getCompaniesServ({ commit }) {
        this.reqGet(null, 'companies').then((response) => {
            commit('setCompanies', response.data)
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        })
    },

    async createCompany({ commit }, data) {
        this.createCompany(data).then((response) => {
            commit('page/toggleStatus', response.status, { root: true })
            this.dispatch('items/getCompaniesServ')
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        })
    },

    async updateCompany({ commit }, data) {
        this.updateCompany(data.id, data).then((response) => {
            commit('page/toggleStatus', response.status, { root: true })
            this.dispatch('items/getCompaniesServ')
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    )},

    // ------------------------
    //       OFFICES
    // ------------------------

    async getOffices({ commit }) {
        this.reqGet(null, 'offices').then((response) => {
            if(response.status >= 200 && response.status < 300) {
                let offices = response.data
                // get companies & attach them to offices
                this.reqGet(null, 'companies_offices').then((response) => {
                    let companies = response.data.items
                    offices.items.forEach(office => {
                        office.relations = {}
                        office.relations.companies = companies.filter(company => company.office_id === office.id)
                    })
                    commit('setOffices', offices)
                })
            }
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    )},

    async createOffice({ commit }, {office, companies}) {
        this.createOffice(office).then(async (response) => {
            let responses = [response.status]
            for (const company of companies) {
                const addRelReq = await this.reqCreateRelation(company, response.data.id, 'companies', 'offices')
                responses.push(addRelReq.status)
            }
            // if all status codes are ok
            if (responses.every((val) => val >= 200 && val < 300)) {
                commit('page/toggleStatus', 200, { root: true })
                this.dispatch('items/getOffices')
            }
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        })
    },

    // ------------------------
    //       DIVISIONS
    // ------------------------

    async getDivisions({ commit }) {
        this.reqGet(null, 'divisions').then((response) => {
            if(response.status >= 200 && response.status < 300) {
                let divisions = response.data
                // get offices & attach them to divisions
                this.reqGet(null, 'offices_divisions').then((response) => {
                    let offices = response.data.items
                    divisions.items.forEach(division => {
                        division.relations = {}
                        division.relations.offices = offices.filter(office => office.division_id === division.id)
                    })
                    commit('setDivisions', divisions)
                })
            }
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    )},

    async createDivision({ commit }, {division, offices}) {
        this.createDivision(division).then(async (response) => {
            let responses = [response.status]
            for (const office of offices) {
                const addRelReq = await this.reqCreateRelation(office, response.data.id, 'offices', 'divisions')
                responses.push(addRelReq.status)
            }
            // if all status codes are ok
            if (responses.every((val) => val >= 200 && val < 300)) {
                commit('page/toggleStatus', 200, { root: true })
                this.dispatch('items/getDivisions')
            }
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        })
    },

    // ------------------------
    //       GROUPS
    // ------------------------

    async getGroups({ commit }) {
        //group - departments
        this.reqGet(null, 'groups').then((response) => {
            if(response.status >= 200 && response.status < 300) {
                let groups = response.data
                // get departments & attach them to groups
                this.reqGet(null, 'departments_groups').then((response) => {
                    let departments = response.data.items
                    groups.items.forEach(group => {
                        group.relations = {}
                        group.relations.departments = departments.filter(department => department.group_id === group.id)
                    })
                    commit('setGroups', groups)
                })
            }
        }
    )},

    async createGroup({ commit }, {group, departments}) {
        this.createGroup(group).then(async (response) => {
            let responses = [response.status]
            for (const department of departments) {
                const addRelReq = await this.reqCreateRelation(department, response.data.id, 'departments', 'groups')
                responses.push(addRelReq.status)
            }
            // if all status codes are ok
            if (responses.every((val) => val >= 200 && val < 300)) {
                commit('page/toggleStatus', 200, { root: true })
                this.dispatch('items/getGroups')
            }
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        })
    },

    // ------------------------
    //       DEPARTMENTS
    // ------------------------

    async getDepartments({ commit }) {
        // department - division
        this.reqGet(null, 'departments').then((response) => {
            if(response.status >= 200 && response.status < 300) {
                let departments = response.data
                // get divisions & attach them to departments
                this.reqGet(null, 'divisions_departments').then((response) => {
                    let divisions = response.data.items
                    departments.items.forEach(department => {
                        department.relations = {}
                        department.relations.divisions = divisions.filter(division => division.department_id === department.id)
                    })
                    commit('setDepartments', departments)
                })
            }
        }
    )},

    async createDepartment({ commit }, {department, divisions}) {
        this.createDepartment(department).then(async (response) => {
            let responses = [response.status]
            for (const division of divisions) {
                const addRelReq = await this.reqCreateRelation(division, response.data.id, 'divisions', 'departments')
                responses.push(addRelReq.status)
            }
            // if all status codes are ok
            if (responses.every((val) => val >= 200 && val < 300)) {
                commit('page/toggleStatus', 200, { root: true })
                this.dispatch('items/getDepartments')
            }
        }
    )},

    // ------------------------
    //       EMPLOYEES
    // ------------------------

    async getEmployeeServ({ commit }, id) {
        const expand = 'office_id,company_id,department_id,division_id,group_id'

        this.reqGet(id, 'employees', { expand }).then((response) => {
            if(response.status >= 200 && response.status < 300) {
                commit('setEmployee', response.data)
            } else {
                throw new Error('Getting employee failed')
            }
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    )},

    async getEmployeesServ({ commit }) {
        const page = this.getters['page/getCurrentPage']
        const perPage = this.getters['page/getPostsPerPage']
        const search = this.getters['page/getSearch']

        const filters = {
            office_id: this.getters['page/getSelectedOffice'].id,
            company_id: this.getters['page/getSelectedCompany'].id,
            department_id: this.getters['page/getSelectedDepartment'].id,
            division_id: this.getters['page/getSelectedDivision'].id,
            group_id: this.getters['page/getSelectedGroup'].id,
        }

        let filtersWithValues = {}
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined) filtersWithValues[key] = filters[key]
        })
        let filterWithValuesLen = Object.keys(filtersWithValues).length

        const params = {
            expand: 'office_id,company_id,department_id,division_id,group_id',
            page, perPage,
            // hate the pocketbase filtering system
            filter: filterWithValuesLen || search ? '(' + Object.keys(filtersWithValues).map((key) => `${key}='${filtersWithValues[key]}'`).join('&&') + `${filterWithValuesLen?'&&':''}(email~'${search}'||name~'${search}'||surname~'${search}')` +')' : '',
        }

        this.reqGet(null, 'employees', params).then((response) => {
            commit('setEmployees', response.data)
            commit('page/setTotalPages', response.data.totalPages, { root: true })
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    )},

    async createEmployee({ commit }, data) {
        this.reqCreateEmployee(data).then((response) => {
            commit('page/toggleStatus', response.status, { root: true })
            this.dispatch('items/getEmployeesServ')
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    )},

    async updateEmployee({ commit }, data) {
        this.reqUpdateEmployee(data).then((response) => {
            commit('page/toggleStatus', response.status, { root: true })
            this.dispatch('items/getEmployeesServ')
        }).catch((err) => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    )}
}

const mutations = {
    setEmployees(state, employees) {state.employees = employees},
    setEmployee(state, employee) {state.currentEmployee = employee},
    setCompanies(state, companies) {state.companies = companies},
    setDepartments(state, departments) {state.departments = departments},
    setDivisions(state, divisions) {state.divisions = divisions},
    setGroups(state, groups) {state.groups = groups},
    setOffices(state, offices) {state.offices = offices},

    setCompany(state, company) {state.currentCompany = company},
    setItem(state, item) {state.currentItem = item},

    setUsers(state, users) {state.users = users},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}