import { usersService } from '@/_services'

const getDefaultState = () => {
    return {
        loading: false,
        all: [],
        allFilters: {
            actualQuickFilter: 'ALL',
        },
        selected: {},
        filtersSystem: {},
        oldQuery: '',
        empty: true,
    }
}

// initial state
const state = getDefaultState()

const actions = {
    getAll({ commit }, args) {
        commit('startLoading')
        usersService.getList(args.currentPage, args.cantPerPage, args.searchFilter).then(
                users => {
                    commit('getAllSuccess', users)
                    commit('finishLoading')
                }
        )
    },
    getAllByFilter({ commit }, args) {
        commit('startLoading')
        usersService.getAllByFilter(args.currentPage, args.cantPerPage, args.searchFilter).then(
            users => {
                commit('getAllSuccess', users)
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

    getAllUserTeam({ commit }, args) {
        commit('startLoading')
        usersService.getList(args.currentPage, args.cantPerPage, args.searchFilter).then(
                users => {
                    commit('getAllSuccess', users)
                    commit('finishLoading')
                }
        )
    },
    getById ({ commit }, args) {
        commit('startLoading')
        usersService.getById(args.id).then(
            user => {
                commit('getSelectedSuccess', user)
                if (user !== "") {
                    commit('finishLoading')
                }
            }
        )
    },

    getUserById ({ commit }, args) {
        commit('startLoading')
        usersService.getUserById(args.id).then(
            user => {
                commit('getSelectedSuccess', user)
                if (user !== "") {
                    commit('finishLoading')
                }
            }
        )
    },

    setEditedUser ({commit}, args) {
        if (typeof (state.selected.data.user) !== 'undefined') {
            commit('setEditedUser', args.editedUser);
        }
    },

    startLoading ({commit}) {
        commit('startLoading')
    },

    finishLoading ({commit}) {
        commit('finishLoading')
    },

    setAllUserStatusFilter ({commit}, args) {
        commit('setAllUserStatusFilter', args.userStatus)
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
    }
}

const mutations = {
    getAllSuccess (state, users) {
        state.all = { data: users };
    },
    getSelectedSuccess (state, user) {
        state.selected = { data: user };
    },
    setEditedUser (state, editedUser) {
        state.selected.data.user = editedUser;
    },
    startLoading (state) {
        state.loading = true;
    },
    finishLoading (state) {
        state.loading = false;
    },
    setAllUserStatusFilter (state, filter) {
        state.allFilters.userStatusFilter = filter;
    },
    setAllCategoryFilter (state, filter) {
        state.allFilters.categoryFilter = filter;
    },
    resetAllFilters (state) {
        state.allFilters.userStatusFilter = '';
        state.allFilters.categoryFilter = '';
    },
    resetSelected(state) {
        state.selected = {};
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
    },
    setFilterSystem (state, filters) {
        state.filtersSystem = filters.filters;
        state.oldQuery = filters.oldQuery;
    },
    resetFilterSystem (state) {
        state.filtersSystem = [];
    },
}

export const users = {
    namespaced: true,
    state,
    actions,
    mutations
}
