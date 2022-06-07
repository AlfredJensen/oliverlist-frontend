import { businessContactsService } from '@/_services'

const getDefaultState = () => {
    return {
        loading: false,
        all: [],
        all2: [],
        allFilters: {
            actualQuickFilter: 'ALL',
            emailFilter:'',
            companyFilter:'',
            cityFilter:'',
            jobFilter:'',
            roleFilter:'',
            contactFilter:'',

        },
        filtersSystem: {},
        oldQuery: '',
        selected: {},
        currentPage: 1,
        empty: true
    }
}


// initial state
const state = getDefaultState()

const actions = {
    getAll({ commit }, args) {
        commit('startLoading')
        businessContactsService.getAll(args.currentPage, args.cantPerPage, args.searchFilter, state.allFilters.emailFilter, state.allFilters.companyFilter, state.allFilters.cityFilter, state.allFilters.jobFilter, state.allFilters.roleFilter, state.allFilters.contactFilter).then(
            businessContacts => {
                commit('getAllSuccess', businessContacts)
                commit('finishLoading')
            }
            )
    },

    getAllByFilter({ commit }, args) {
        commit('startLoading')
        businessContactsService.getAllByFilter(args.currentPage, args.cantPerPage, args.searchFilter, args.importCsv).then(
            businessContacts => {
                commit('getAllSuccess', businessContacts)
                commit('finishLoading')
            }
        )
    },

    getAll2({ commit }, args) {
        commit('startLoading')
        businessContactsService.getAll2(args.currentPage, args.cantPerPage, args.searchFilter, args.campaignId).then(
                businessContacts => {
                    commit('getAll2Success', businessContacts)
                    commit('finishLoading')
                }
        )
    },

    getById ({ commit }, args) {
        commit('startLoading')
        businessContactsService.getById(args.id).then(
            businessContact => {
                commit('getSelectedSuccess', businessContact)
                if (businessContact !== "") {
                    commit('finishLoading')
                }
            }
            )
    },

    getContactById ({ commit }, args) {
        commit('startLoading')
        businessContactsService.getContactById(args.id).then(
            businessContact => {
                commit('getSelectedSuccess', businessContact)
                if (businessContact !== "") {
                    commit('finishLoading')
                }
            }
            )
    },

    setEditedbusinessContact ({commit}, args) {
        if (typeof (state.selected.data.businessContact) !== 'undefined') {
            commit('setEditedbusinessContact', args.editedbusinessContact);
        }
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

    setAllbusinessContactStatusFilter ({commit}, args) {
        commit('setAllbusinessContactStatusFilter', args.businessContactStatus)
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
    setEmailFilter ({commit}, args) {
        commit('setEmailFilter', args.emailFilter)
    },
    setCompanyFilter ({commit}, args) {
        commit('setCompanyFilter', args.companyFilter)
    },
    setCityFilter ({commit}, args) {
        commit('setCityFilter', args.cityFilter)
    },
    setJobFilter ({commit}, args) {
        commit('setJobFilter', args.jobFilter)
    },
    setRoleFilter ({commit}, args) {
        commit('setRoleFilter', args.roleFilter)
    },
    setContactFilter ({commit}, args) {
        commit('setContactFilter', args.contactFilter)
    },
}

const mutations = {
    getAllSuccess (state, businessContacts) {
        state.all = { data: businessContacts };
    },
    getAll2Success (state, businessContacts) {
        state.all2 = { data: businessContacts };
    },
    getSelectedSuccess (state, businessContact) {
        state.selected = { data: businessContact };
    },
    setEditedbusinessContact (state, editedbusinessContact) {
        state.selected.data.businessContact = editedbusinessContact;
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
    setFilterSystem (state, filters) {
        state.filtersSystem = filters.filters;
        state.oldQuery = filters.oldQuery;
    },
    resetFilterSystem (state) {
        state.filtersSystem = [];
    },
    startLoading (state) {
        state.loading = true;
    },
    finishLoading (state) {
        state.loading = false;
    },
    setAllbusinessContactStatusFilter (state, filter) {
        state.allFilters.businessContactStatusFilter = filter;
    },
    setAllCategoryFilter (state, filter) {
        state.allFilters.categoryFilter = filter;
    },
    resetAllFilters (state) {
        state.allFilters.businessContactStatusFilter = '';
        state.allFilters.categoryFilter = '';
    },
    resetSelected(state) {
        state.selected = {};
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
    },
    setEmailFilter (state, emailFilter) {
        state.allFilters.emailFilter = emailFilter;
    },
    setCompanyFilter (state, companyFilter) {
        state.allFilters.companyFilter = companyFilter;
    },
    setCityFilter (state, cityFilter) {
        state.allFilters.cityFilter = cityFilter;
    },
    setJobFilter (state, jobFilter) {
        state.allFilters.jobFilter = jobFilter;
    },
    setRoleFilter (state, roleFilter) {
        state.allFilters.roleFilter = roleFilter;
    },
    setContactFilter (state, contactFilter) {
        state.allFilters.contactFilter = contactFilter;
    },
}

export const contactscsv = {
    namespaced: true,
    state,
    actions,
    mutations
}
