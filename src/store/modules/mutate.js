const state = {
    showMutateWindow: false,
    editMode: false,
    type: '',

    showDeleteWindow: false,
}

const getters = {
    getShowMutateWindow: state => state.showMutateWindow,
    getEditMode: state => state.editMode,
    getShowDeleteWindow: state => state.showDeleteWindow,
    getType: state => state.type,
}

const actions = {}

const mutations = {
    toggleMutateWindow(state, value) {
        if (value) state.showMutateWindow = value;
        else state.showMutateWindow = !state.showMutateWindow;
    },
    toggleDeleteWindow(state, value) {
        if (value) state.showDeleteWindow = value;
        else state.showDeleteWindow = !state.showDeleteWindow;
    },
    setEditMode(state, value) { state.editMode = value },
    setType(state, value) { state.type = value }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}