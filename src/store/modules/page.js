const state = {
    tableView: true,

    selectedCompany: '',
    selectedDepartment: '',
    selectedDivision: '',
    selectedGroup: '',
    selectedOffice: '',

    currentPage: 1,
    postsPerPage: 25,
    totalPages: 0,
    search: '',

    status: 200,
    showStatus: false,
}

const getters = {
    getFullNavigation: state => state.fullNavigation,
    isTableView: state => state.tableView,
    getCurrentPage: state => state.currentPage,
    getPostsPerPage: state => state.postsPerPage,
    getTotalPages: state => state.totalPages,

    getSelectedCompany: state => state.selectedCompany,
    getSelectedDepartment: state => state.selectedDepartment,
    getSelectedDivision: state => state.selectedDivision,
    getSelectedGroup: state => state.selectedGroup,
    getSelectedOffice: state => state.selectedOffice,

    getShowStatus: state => state.showStatus,
    getStatus: state => state.status,

    getSearch: state => state.search,
}

const actions = {}

const mutations = {
    toggleTableView(state, value) {
        if (value) state.tableView = value;
        else state.tableView = !state.tableView;
    },
    toggleFullNavigation(state, value) {
        if (value) state.fullNavigation = value;
        else state.fullNavigation = !state.fullNavigation;
    },
    incrementPage(state) {
        if(state.currentPage < state.totalPages){
            state.currentPage++;
        }
    },
    decrementPage(state) {
        if (state.currentPage > 1){
            state.currentPage--;
        }
    },
    
    toggleStatus: (state, status) => {
        state.status = status;
        if(!state.showStatus){
            state.showStatus = true;
            setTimeout(() => {
                state.showStatus = false;
            }, 3000);
        }},

    setPostsPerPage(state, value) {state.postsPerPage = value;},
    setSearch(state, value) {state.search = value;},
    setTotalPages(state, value) {state.totalPages = value;},
    setCurrentPage(state, value) {state.currentPage = value;},

    setSelectedCompany(state, company) {state.selectedCompany = company},
    setSelectedDepartment(state, department) {state.selectedDepartment = department},
    setSelectedDivision(state, division) {state.selectedDivision = division},
    setSelectedGroup(state, group) {state.selectedGroup = group},
    setSelectedOffice(state, office) {state.selectedOffice = office},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}