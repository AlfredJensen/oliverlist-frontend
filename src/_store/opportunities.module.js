import { opportunitiesService } from '@/_services'

const getDefaultState = () => {
    return {
        loading: false,
        loadingOpportunity: false,
        all: [],
        allFilters: {
            actualQuickFilter: 'ALL',
            linkStatusFilter: '',
            salesUserFilter: '',
            productFilter: '',
            categoryFilter: '',
            parentCategoryFilter: '',
            businessFilter: '',
            tagFilter: '',
            orderBy: 'last_activity DESC',
            quickSearchFilter: ''
        },
        currentPage: 1,
        clicked: [],
        priority: {},
        priorityFilters: {
            categoryFilter: JSON.parse(localStorage.getItem('priorityCategoryFilter')) || {},
            parentCategoryFilter: JSON.parse(localStorage.getItem('priorityParentCategoryFilter')) || {},
            productFilter: JSON.parse(localStorage.getItem('priorityProductFilter')) || {},
        },
        filtersSystem: {},
        oldQuery: '',
        selected: {},
        empty: true,
        selectedList: "todo",
        tasksChange: 0
    }
}

// initial state
const state = getDefaultState()


const actions = {
    getAll({ commit }, args) {

        commit('startLoading')
        opportunitiesService.getAll(args.currentPage, args.cantPerPage, args.searchFilter, state.allFilters.productFilter, 
            state.allFilters.parentCategoryFilter, state.allFilters.linkStatusFilter, state.allFilters.salesUserFilter, state.allFilters.orderBy, state.allFilters.businessFilter,  state.allFilters.tagFilter).then(
                opportunities => {
                    if(opportunities !== ""){
                        opportunities.isSimpleSearch = true;
                    }
                    commit('getAllSuccess', opportunities)
                    commit('finishLoading')
                }
        )

    },

    getAllByFilter({ commit }, args) {
        commit('startLoading')

        let searchFilter = args.searchFilter;
        searchFilter.total = undefined;

        opportunitiesService.getAllByFilter(args.currentPage, args.cantPerPage, searchFilter).then(
            opportunities => {
                commit('getAllSuccess', opportunities)
                commit('finishLoading')
            }
        )

        
    },    

    getPriority ({ commit }) {
        if (Object.entries(state.priority).length === 0 && state.priority.constructor === Object) {
            commit('startLoading')

            opportunitiesService.getPriority(state.priorityFilters.parentCategoryFilter, state.priorityFilters.productFilter).then(
                opportunity => {
                    commit('getPrioritySuccess', opportunity)
                    if (opportunity !== {} && opportunity !== '' && opportunity !== null) {
                        commit('finishLoading')
                    }
                }
            )
        }
    },

    getOpportunityById ({ commit }, args) {
        commit('startLoadingOpportunity')

        opportunitiesService.getOpportunityById(args.id).then(
            opportunity => {
                commit('getSelectedSuccess', opportunity)
                if (opportunity !== "") {
                    commit('finishLoadingOpportunity')
                }
            }
        )
    },

    setTasks({ commit }, args) {
        commit('setTasks', args)
    },

    resetPriority ({commit}) {
        commit('resetPriority')
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

    startLoadingOpportunity ({commit}) {
        commit('startLoadingOpportunity')
    },

    finishLoadingOpportunity ({commit}) {
        commit('finishLoadingOpportunity')
    },

    setLinkStatusFilter ({commit}, args) {
        commit('setLinkStatusFilter', args.linkStatus)
    },

    setSalesUserFilter ({commit}, args) {
        commit('setSalesUserFilter', args.salesUser)
    },

    setProductFilter ({commit}, args) {
        commit('setProductFilter', args.product)
    },

    setCategoryFilter ({commit}, args) {
        commit('setCategoryFilter', args.category)
    },

    setParentCategoryFilter ({commit}, args) {
        commit('setParentCategoryFilter', args.parentCategory)
    },

    setOrderBy ({commit}, args) {
        commit('setOrderBy', args.orderBy)
    },

    setBusinessFilter ({commit}, args) {
        commit('setBusinessFilter', args.businessFilter)
    },

    setTagFilter ({commit}, args) {
        commit('setTagFilter', args.tag)
    },

    setPriorityCategoryFilter ({ commit }, args) {
        commit('setPriorityCategoryFilter', args.category);
    },

    setPriorityParentCategoryFilter ({ commit }, args) {
        commit('setPriorityParentCategoryFilter', args.parentCategory);
    },
    
    setPriorityProductFilter ({ commit }, args) {
        commit('setPriorityProductFilter', args.product);
    },

    setSelectedList ({ commit }, value) {
        commit('setSelectedList', value);
    },

    resetAllFilters ({ commit }) {
        commit('resetAllFilters')
    },

    resetPriority ({ commit }) {
        commit('resetPriority')
    },

    resetState ({ commit }) {
        commit('resetState')
    },

    reloadOpportunity ({ commit, dispatch }, args) {

        if(args.link_id !== undefined && args.link_id != state.selected.data.link.id){
            return;
        }

        if (args.headerTab === 'PRIORITY') {
            dispatch('resetPriority');
            dispatch('getPriority');
        } else {
            dispatch('getOpportunityById', {id: state.selected.data.link.id })
        }
    },

    changeOpportunityStatus({commit, dispatch}, args){
        commit('changeOpportunityStatus', args);
    },
    addOpportunityTag({commit, dispatch}, args){
        commit('addOpportunityTag', args);
    },
    removeOpportunityTag({commit, dispatch}, args){
        commit('removeOpportunityTag', args);
    },
}

const mutations = {
    getAllRequest (state) {
        state.all = { loading: true };
    },
    getAllSuccess (state, opportunities) {
        if(state.all.data === undefined || state.all.data === ''){
            state.all = { data: opportunities };
        }else if(opportunities.list !== true ){
            state.all.data.list =  opportunities.list;
            if(opportunities.isSimpleSearch !== undefined){
                state.all.data.total =  opportunities.total;
            }
        }else{
            if(opportunities){
                state.all.data.total =  opportunities.total;
            }else{
                state.all.data.total =  0;
            }
        }
    },
    getAllFailure (state, error) {
        state.all = { error };
    },
    getPriorityRequest (state) {
        state.priority = { loading: true };
    },
    getPrioritySuccess (state, opportunity) {
        state.priority = { data: opportunity };
    },
    getPriorityFailure (state, error) {
        state.priority = { error };
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
    getSelectedRequest (state) {
        state.selected = { loading: true };
    },
    getSelectedSuccess (state, opportunity) {
        state.selected = { data: opportunity };
    },
    getSelectedFailure (state, error) {
        state.selected = { error };
    },
    resetPriority (state) {
        state.priority = {};
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
        if(state.all.data !== undefined){
            state.all.data.total = 0;
        }
    },
    finishLoading (state) {
        state.loading = false;
    },
    startLoadingOpportunity (state) {
        state.loadingOpportunity = true;
    },
    finishLoadingOpportunity (state) {
        state.loadingOpportunity = false;
    },
    setLinkStatusFilter (state, filter) {
        state.allFilters.linkStatusFilter = filter;
    },
    setSalesUserFilter (state, filter) {
        state.allFilters.salesUserFilter = filter;
    },
    setProductFilter (state, filter) {
        state.allFilters.productFilter = filter;
    },
    setCategoryFilter (state, filter) {
        state.allFilters.categoryFilter = filter;
    },
    setParentCategoryFilter (state, filter) {
        state.allFilters.parentCategoryFilter = filter;
    },
    setOrderBy (state, orderBy) {
        state.allFilters.orderBy = orderBy;
    },
    setBusinessFilter (state, businessFilter) {
        state.allFilters.businessFilter = businessFilter;
    },
    setTagFilter (state, tagFilter) {
        state.allFilters.tagFilter = tagFilter;
    },
    setPriorityCategoryFilter (state, category) {
        localStorage.setItem('priorityCategoryFilter', JSON.stringify(category));
        state.priorityFilters.categoryFilter = category;
    },
    setPriorityParentCategoryFilter (state, parentCategory) {
        localStorage.setItem('priorityParentCategoryFilter', JSON.stringify(parentCategory));
        state.priorityFilters.parentCategoryFilter = parentCategory;
    },
    setPriorityProductFilter (state, product) {
        localStorage.setItem('priorityProductFilter', JSON.stringify(product));
        state.priorityFilters.productFilter = product;
    },
    setSelectedList(state, selectedList) {
        state.selectedList = selectedList;
    },
    resetAllFilters (state) {
        state.allFilters.linkStatusFilter = '';
        state.allFilters.salesUserFilter = '';
        state.allFilters.productFilter = '';
        state.allFilters.categoryFilter = '';
        state.allFilters.businessFilter = '';
        state.allFilters.tagFilter = '';
        state.allFilters.orderBy = '';
    },

    nextPage (state) {
        state.currentPage++
    },

    resetPriority (state) {
        state.priority = {};
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
    },
    changeOpportunityStatus(state, args){
        if(state.all.data){
            const opportunity = state.all.data.list.find( opportunity => { return opportunity.link_id == args.link_id});
            if(opportunity != undefined){
                opportunity.link_status_name = args.link_status_name;
            }
        }
    },
    addOpportunityTag(state, args){
        if(state.all.data){
            const opportunity = state.all.data.list.find( opportunity => { return opportunity.link_id == args.link_id});
            if(opportunity.tags == null){
                opportunity.tags = [];
            }
            opportunity.tags.push(args.tag);
        }
    },
    removeOpportunityTag(state, args){
        if(state.all.data){
            const opportunity = state.all.data.list.find( opportunity => { return opportunity.link_id == args.link_id});
            opportunity.tags.splice(opportunity.tags.indexOf(args.tag), 1);
        }
    },
    setTasks(state, args){
        if(state.all.data){
            const opportunity = state.all.data.list.find( opportunity => { return opportunity.link_id == args.link_id});
            opportunity.tasks = args.tasks
            state.tasksChange++;
        }
    }
}

export const opportunities = {
    namespaced: true,
    state,
    actions,
    mutations
}
