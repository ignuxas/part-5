const state = {}
const getters = {}
const actions = {
    dispatcher({commit}, type) {
        switch(type) {
            case 'employees':
                this.dispatch('items/getEmployeesServ')
                break
            case 'companies':
                this.dispatch('items/getCompaniesServ')
                break
            case 'departments':
                this.dispatch('items/getDepartments')
                break
            case 'divisions':
                this.dispatch('items/getDivisions')
                break
            case 'groups':
                this.dispatch('items/getGroups')
                break
            case 'offices':
                this.dispatch('items/getOffices')
                break
            case 'users':
                this.dispatch('user/getUsersServ')
                break
            default:
                break
        }
    },

    async validateInput({commit}, idList) {
        let passed = true

        function addRedBorder(element) {
            element.classList.add('border-red')
            element.classList.add('border-2')
        }
        function removeRedBorder(element) {
            element.classList.remove('border-red')
            element.classList.remove('border-2')
        }

        idList.forEach(id => {
            const element = document.getElementById(id)
            console.log()
            if(element.value.length < 2 || (element.id == 'email' && !element.value.includes('@'))) {
                addRedBorder(element)
                passed = false
            } else {
                removeRedBorder(element)
            }
        })

        return passed
    },

    async doDelete({ commit }, {id, type}) {
            this.reqDelete(id, type)
                .then(res => {
                    if(res.status >= 200 && res.status < 300) {
                        commit('page/toggleStatus', res.status, { root: true })
                        this.dispatch('general/dispatcher', type)
                    } else {
                        throw new Error('Deletion failed')
                    }
                }).catch(err => {
                    console.log(err)
                    commit('page/toggleStatus', 400, { root: true })
                })
    },

    async updateStructure({commit}, {data, relations, type, item}) {
        try{
            const id = data.id
            const response = await this.updateStructure(id, type, data)
            let responses = [response.status]

            // if relations are different, delete all relations and add new ones
            let promise = new Promise( async (resolve, reject) =>
                Object.keys(item.relations).forEach(async relationName => { // for each relation
                const currentRelationsList = item.relations[relationName].map(relation => relation[`${this.unPlurafy(relationName)}_id`]) // get current relations
                if(JSON.stringify(currentRelationsList) !== JSON.stringify(relations)) { // if relations are different
                    for (const relation of item.relations[relationName]){ // delete all relations
                        const delRes = await this.reqDelete(relation.id, `${relationName}_${type}`)
                        responses.push(delRes.status)
                    }

                    for (const relation of relations){ // add new relations
                        const addRes = await this.reqCreateRelation(relation, id, relationName, type)
                        responses.push(addRes.status)
                    }
                }
                resolve(responses)
            }))
            
            await promise
            if(responses.every(status => status >= 200 && status < 300)) {
                this.dispatch('general/dispatcher', type)
                commit('page/toggleStatus', 200, { root: true })
            } else { throw new Error('Updating structure failed') }
        } catch(err) {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    },

    async getRelations({commit}, {id, type, relationName, reverse, setName, getFunc}) {
        const relationsList = { items: [] }

        if(!id) return await getFunc() // if id is null, get all items

        try {
            const relationsRes = await this.reqGetRelations(id, type, relationName, reverse)
            
            let relations = null
            if(!reverse) relations = relationsRes.data.expand[`${relationName}_${type}(${this.unPlurafy(type)}_id)`]
            else relations = relationsRes.data.expand[`${type}_${relationName}(${this.unPlurafy(type)}_id)`]

            relations.forEach(relation => { relationsList.items.push(relation.expand[`${this.unPlurafy(relationName)}_id`])})

            commit(setName, relationsList, { root: true })
        } catch(err) {
            console.log(err)
            commit(setName, {items: []}, { root: true })
        }
    },

    async updateFilters({commit}, {id, type}) {
        const defaultf = {id, type}
        if(type === 'offices'){ // ------ OFFICES ------
            this.dispatch('general/getRelations', {
                ...defaultf,
                relationName: 'companies',
                getFunc: () => this.dispatch('items/getCompaniesServ'),
                setName: 'items/setCompanies',
                reverse: false,
            });
            this.dispatch('general/getRelations', {
                ...defaultf,
                relationName: 'divisions',
                getFunc: () => this.dispatch('items/getDivisions'),
                setName: 'items/setDivisions',
                reverse: true,
            });
        } else if (type === 'divisions') { // ------ DIVISIONS ------
            this.dispatch('general/getRelations', {
                ...defaultf,
                relationName: 'offices',
                getFunc: () => this.dispatch('items/getOffices'),
                setName: 'items/setOffices',
                reverse: false,
            });
            this.dispatch('general/getRelations', {
                ...defaultf,
                relationName: 'departments',
                getFunc: () => this.dispatch('items/getDepartments'),
                setName: 'items/setDepartments',
                reverse: true,
            });
        } else if (type === 'departments') { // ------ DEPARTMENTS ------
            this.dispatch('general/getRelations', {
                ...defaultf,
                relationName: 'divisions',
                getFunc: () => this.dispatch('items/getDivisions'),
                setName: 'items/setDivisions',
                reverse: false,
            });
            this.dispatch('general/getRelations', {
                ...defaultf,
                relationName: 'groups',
                getFunc: () => this.dispatch('items/getGroups'),
                setName: 'items/setGroups',
                reverse: true,
            });
        } else if (type === 'groups') { // ------ GROUPS ------
            this.dispatch('general/getRelations', {
                ...defaultf,
                relationName: 'departments',
                getFunc: () => this.dispatch('items/getDepartments'),
                setName: 'items/setDepartments',
                reverse: false,
            });
        } else if (type === 'companies') { // ------ COMPANIES ------
            this.dispatch('general/getRelations', {
                ...defaultf,
                relationName: 'offices',
                getFunc: () => this.dispatch('items/getOffices'),
                setName: 'items/setOffices',
                reverse: true,
            });
        }
        commit('page/setCurrentPage', 1, { root: true })
    },
}

const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}