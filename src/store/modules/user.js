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

const actions = {}

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
