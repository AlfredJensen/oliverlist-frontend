import { companiesService } from '@/_services'

const getDefaultState = () => {
    return {
        loading: false,
        all: [],
        allFilters: {
            actualQuickFilter: 'ALL',
            companyFilter: '',
            domainFilter: '',
            cityFilter: '',
        },
        selected: {},
        selectedTab: 'Info',
        loadingStats: false,
        filtersSystem: {},
        oldQuery: '',
        stats: {},
        currentPage:1,
        empty: true,
    }
}


const state = getDefaultState()

const actions = {
    getAll({ commit }, args) {
        commit('startLoading')
        companiesService.getAll(args.currentPage, args.cantPerPage, args.searchFilter, state.allFilters.companyFilter, state.allFilters.domainFilter, state.allFilters.cityFilter).then(
            companies => {
                commit('getAllSuccess', companies)
                commit('finishLoading')
            }
            )
        
    },

    getAllByFilter({ commit }, args) {
        commit('startLoading')
        companiesService.getAllByFilter(args.currentPage, args.cantPerPage, args.searchFilter).then(
            campaigns => {
                commit('getAllSuccess', campaigns)
                commit('finishLoading')
            }
        )
    },

    setFilterSystem ({commit}, args) {
        commit('setFilterSystem', args.filters);
    },

    resetFilterSystem ({commit}, args) {
        commit('resetFilterSystem', args.filters);
    },  

    startLoading ({commit}) {
        commit('startLoading')
    },

    finishLoading ({commit}) {
        commit('finishLoading')
    },

    startloadingStats ({commit}) {
        commit('startloadingStats')
    },

    finishloadingStats ({commit}) {
        commit('finishloadingStats')
    },

    resetAllFilters ({ commit }) {
        commit('resetAllFilters')
    },

    resetSelected ({ commit }) {
        commit('resetSelected')
    },

    resetState ({ commit }) {
        commit('resetState')
    },
    changeCampaignTab({ commit }, args) {
        commit('changeCampaignTab', args.tab);
    },
}

const mutations = {
    getAllSuccess (state, companies) {
        state.all = { data: companies };
    },
    getSelectedSuccess (state, company) {
        state.selected = { data: company };
    },
    getSelectedStatsSuccess (state, stats) {
        state.stats = { data: stats };
    },
    nextPage() {
        state.currentPage++;
    },
    prevPage() {
        if(state.currentPage > 1)
            state.currentPage--;
    },
    resetPage() {
        state.currentPage = 1;
    },
    getEmptySuccess (state, company) {
        state.selected = { data: company };
    },
    setFilterSystem (state, filters) {
        state.filtersSystem = filters.filters;
        state.oldQuery = filters.oldQuery;
    },
    resetFilterSystem (state) {
        state.filtersSystem = {};
        state.oldQuery = '';
    },
    startLoading (state) {
        state.loading = true;
    },
    finishLoading (state) {
        state.loading = false;
    },
    startloadingStats (state) {
        state.loadingStats = true;
    },
    finishloadingStats (state) {
        state.loadingStats = false;
    },
    resetAllFilters (state) {
        state.allFilters.companyStatusFilter = '';
        state.allFilters.categoryFilter = '';
    },
    resetSelected(state) {
        state.selected = {};
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
    },
    changeCampaignTab(state, tab) {
        state.selectedTab = tab
        setTimeout(function () { window.scrollTo(0, 0); }, 10)
    },

}

export const companies = {
    namespaced: true,
    state,
    actions,
    mutations
}