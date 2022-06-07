import { businessesService } from '@/_services'

const getDefaultState = () => {
    return {
        loading: false,
        all: [],
        allFilters: {
            actualQuickFilter: 'ALL',
            businessStatusFilter: '',
            categoryFilter: '',
        },
        selected: {}
    }
}

// initial state
const state = getDefaultState()

const actions = {
    getAll({ commit }, args) {
        commit('startLoading')

        businessesService.getAll(args.currentPage, args.cantPerPage, args.searchFilter, state.allFilters.businessStatusFilter, 
            state.allFilters.categoryFilter).then(
                businesses => {
                    commit('getAllSuccess', businesses)
                    commit('finishLoading')
                }
        )
    },

    getById ({ commit }, args) {
        commit('startLoading')

        businessesService.getById(args.id).then(
            business => {
                commit('getSelectedSuccess', business)
                if (business !== "") {
                    commit('finishLoading')
                }
            }
        )
    },

    setEditedBusiness ({commit}, args) {
        if (typeof (state.selected.data.business) !== 'undefined') {
            commit('setEditedBusiness', args.editedBusiness);
        }
    },

    startLoading ({commit}) {
        commit('startLoading')
    },

    finishLoading ({commit}) {
        commit('finishLoading')
    },

    setAllBusinessStatusFilter ({commit}, args) {
        commit('setAllBusinessStatusFilter', args.businessStatus)
    },

    setAllCategoryFilter ({commit}, args) {
        commit('setAllCategoryFilter', args.category)
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
}

const mutations = {
    getAllSuccess (state, businesses) {
        state.all = { data: businesses };
    },
    getSelectedSuccess (state, business) {
        state.selected = { data: business };
    },
    setEditedBusiness (state, editedBusiness) {
        state.selected.data.business = editedBusiness;
    },
    startLoading (state) {
        state.loading = true;
    },
    finishLoading (state) {
        state.loading = false;
    },
    setAllBusinessStatusFilter (state, filter) {
        state.allFilters.businessStatusFilter = filter;
    },
    setAllCategoryFilter (state, filter) {
        state.allFilters.categoryFilter = filter;
    },
    resetAllFilters (state) {
        state.allFilters.businessStatusFilter = '';
        state.allFilters.categoryFilter = '';
    },
    resetSelected(state) {
        state.selected = {};
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
    },
}

export const businesses = {
    namespaced: true,
    state,
    actions,
    mutations
}
