const state = {
    token: null,
    user: {},
}

const getters = {
    permissions: state => {
        if (state.user.expand) return state.user.expand.permissions_id
        else return {}
    },
    getFullNavigation: state => {
        if(Object.keys(state.user).length) return true
        return false
    },
    getToken: state => state.token,
    getUser: state => state.user,
}

const actions = {
    // ------------------------
    //       USERS
    // ------------------------


    // ---------- LOGIN ----------

    async login({ commit }, { identity=null, password=null, skipcheck=false }) {
        const token = this.getters['user/getToken']
        const user = this.getters['user/getUser']

        const tokenCookie = localStorage.getItem('token')
        const userCookie = localStorage.getItem('user')

        const params = { expand: 'permissions_id' }

        if(!skipcheck){ // if skipcheck is true, then we don't need to check if the user is already logged in
            if(token && user) return {status: 200, data: user}
        }

        if(tokenCookie && userCookie){ // if the user is not logged in, but the token and user are in the cookies, then we can log them in
            commit('setToken', tokenCookie)
            commit('setUser', JSON.parse(userCookie))
            return {status: 200, data: JSON.parse(userCookie)}
        }

        if(identity && password){
            console.log('login')
            this.reqLogin(identity, password, params).then(res => {
                if(res.status >= 200 && res.status < 300) {
                    commit('setToken', res.data.token)
                    commit('setUser', res.data.record)
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('user', JSON.stringify(res.data.record))
                    console.log(res.data.record)
                    return {status: res.status, data: res.data}
                }}
            ).catch(err => {
                console.log(err)
                commit('page/toggleStatus', 400, { root: true })
                return {status: 400, data: {}}
            }
        )} else {
            return {status: 400, data: {}}
        }
    },

    async logout({ commit }) {
        commit('setToken', null)
        commit('setUser', {})

        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    // ---------- USERS ----------

    async getUsersServ({ commit }) {
        const params = { expand: 'permissions_id' }
        this.reqGet(null, 'users', params).then(res => {
            if(res.status >= 200 && res.status < 300) {
                commit('items/setUsers', res.data.items, {root: true})
            } else {
                throw new Error('Getting user failed')
            }
        }).catch(err => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        }
    )},

    async createUser({ commit }, { user, permissions, password }) {

        user = {
            ...user,
            password: password,
            passwordConfirm: password,
            emailVisibility: true,
            permissions_id: null,
        }

        this.reqCreatePermission(permissions).then(res => {
            if(res.status >= 200 && res.status < 300) {
                user.permissions_id = res.data.id
                this.reqCreateUser(user, password).then(res => {
                    if(res.status >= 200 && res.status < 300) {
                        this.dispatch('user/getUsersServ')
                        commit('page/toggleStatus', 200, { root: true })
                    } else {
                        throw new Error('Creating user failed')
                    }
                }).catch(err => {
                    console.log(err)
                    //commit('page/toggleStatus', 400, { root: true })
                    // delete the permission if the user creation fails
                    this.reqDelete(user.permissions_id, 'user_permissions')
                })
            } else {
                throw new Error('Creating permission failed')
            }
        }).catch(err => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        })
    },

    async updateUser({ commit }, { user, permissions }) {
        const params = { expand: 'permissions_id' }

        this.reqUpdatePermission(permissions).then(res => {
            if(res.status >= 200 && res.status < 300) {
                user.permissions_id = res.data.id
                this.reqUpdateUser(user, params).then(res => {
                    if(res.status >= 200 && res.status < 300) {
                        this.dispatch('user/getUsersServ')
                        commit('page/toggleStatus', 200, { root: true })
                    } else {
                        throw new Error('Updating user failed')
                    }
                }).catch(err => {
                    console.log(err)
                    commit('page/toggleStatus', 400, { root: true })
                })
            } else {
                throw new Error('Updating permission failed')
            }
        }).catch(err => {
            console.log(err)
            commit('page/toggleStatus', 400, { root: true })
        })
    },
}

const mutations = {
    setToken(state, token) {state.token = token},
    setUser(state, user) {state.user = user},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
