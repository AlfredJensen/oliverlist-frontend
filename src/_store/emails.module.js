import { emailsService } from '@/_services'

const getDefaultState = () => {
    return {
        loading: false,
        all: {},
        allFilters: {
            actualQuickFilter: 'ALL',
            salesUserFilter: '',
        },
        selected: {},
        thread:{}
    }
}

// initial state
const state = getDefaultState()

const actions = {
    getAll({ commit }, args) {
        commit('startLoading')
        emailsService.getAll(args.currentPage, args.cantPerPage, args.searchFilter, state.allFilters.salesUserFilter,).then(
                emails => {
                    commit('getAllSuccess', emails)
                    commit('finishLoading')
                }
        )
        
    },

    getThread ({ commit }, args) {
        commit('startLoading')

        emailsService.getThreadById(args.id).then(
            thread => {
                commit('getThreadSuccess', thread)
                if (thread !== "") {
                    commit('finishLoading')
                }
            }
        )
    },

    getById ({ commit }, args) {
        commit('startLoading')

        emailsService.getById(args.id).then(
            business => {
                commit('getSelectedSuccess', business)
                if (business !== "") {
                    commit('finishLoading')
                }
            }
        )
    },


    startLoading ({commit}) {
        commit('startLoading')
    },

    finishLoading ({commit}) {
        commit('finishLoading')
    },

    startLoadingOpportunities ({commit}) {
        commit('startLoadingOpportunities')
    },

    finishLoadingOpportunities ({commit}) {
        commit('finishLoadingOpportunities')
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
    setSalesUserFilter ({commit}, args) {
        commit('setSalesUserFilter', args.salesUser)
    },
}

const mutations = {
    getAllSuccess (state, emails) {
        state.all = { data: emails };
    },
    getSelectedSuccess (state, email) {
        state.selected = { data: email };
    },
    getThreadSuccess (state, emails) {
        state.thread = { data: emails };
    },
    startLoading (state) {
        state.loading = true;
    },
    finishLoading (state) {
        state.loading = false;
    },
    startLoadingOpportunities (state) {
        state.loadingOpportunities = true;
    },
    finishLoadingOpportunities (state) {
        state.loadingOpportunities = false;
    }, 
    resetAllFilters (state) {
        state.allFilters.emailStatusFilter = '';
        state.allFilters.categoryFilter = '';
    },
    resetSelected(state) {
        state.selected = {};
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
    },
    setSalesUserFilter (state, filter) {
        state.allFilters.salesUserFilter = filter;
    },
}

export const emails = {
    namespaced: true,
    state,
    actions,
    mutations
}
