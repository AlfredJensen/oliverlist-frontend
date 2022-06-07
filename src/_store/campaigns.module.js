import { campaignsService } from '@/_services'

import relEn from "../assets/json/rel_en.json";
import relEs from "../assets/json/rel_es.json";
import relFr from "../assets/json/rel_fr.json";

const relLanguajes = [relEn, relEs, relFr];

const getDefaultState = () => {
    return {
        loading: false,
        all: [],
        alldashboard: [],
        listAllCampaigns: [],
        allFilters: {
            actualQuickFilter: 'ALL',
            statusFilter: '',
            siteFilter: '',
            budgetFilter:'',
            ownerFilter:'',
        },
        selected: {},
        created: {},
        selectedTab: 'Info',
        loadingStats: false,
        filtersSystem: {},
        oldQuery: '',
        stats: {},
        modified: false,
        empty: true,
    }
}

const getRandomMessage = (language_id, step) => {
    let language = relLanguajes.find(lang => lang.id == language_id);
    let sep = "\n\n";
    let stepContent = "";
    switch(step){
    case 1:
        stepContent = language.messagePart0;
        break;
    case 2:
        stepContent = language.messagePart1[Math.floor(Math.random() * language.messagePart1.length)] + sep +
                      language.messagePart2[Math.floor(Math.random() * language.messagePart2.length)] + sep +
                      language.messagePart6[Math.floor(Math.random() * language.messagePart6.length)] + sep +
                      language.messagePart5[Math.floor(Math.random() * language.messagePart5.length)];
        break;
    case 3:
        stepContent = language.messagePart1[Math.floor(Math.random() * language.messagePart1.length)] + sep +
                      language.messagePart4[Math.floor(Math.random() * language.messagePart4.length)] + sep +
                      language.messagePart6[Math.floor(Math.random() * language.messagePart6.length)] + sep +
                      language.messagePart5[Math.floor(Math.random() * language.messagePart5.length)];
        break;
    case 4:
        stepContent = language.messagePart1[Math.floor(Math.random() * language.messagePart1.length)] + sep +
                      language.messagePart3[Math.floor(Math.random() * language.messagePart3.length)] + sep +
                      language.messagePart7[Math.floor(Math.random() * language.messagePart7.length)] + sep + "[my_website_url_tracking]";
        break;
    }
    return stepContent;
}

const getDefaultCampaignSteps = (language_id) => {
    return [{
            "step": 1,
            "subject": "[my_first_name] [my_last_name] / [prospect_company_name]",
            "message": getRandomMessage(language_id, 1),
            "recall_step": false
        }, {
            "step": 2,
            "subject": "[my_first_name] [my_last_name] / [prospect_company_name]",
            "message": getRandomMessage(language_id, 2),
            "delay": "5",
            "recall_step": false
        }, {
            "step": 3,
            "subject": "[my_first_name] [my_last_name] / [prospect_company_name]",
            "message": getRandomMessage(language_id, 3),
            "delay": "90",
            "recall_step": true
        }, {
            "step": 4,
            "subject": "[my_first_name] [my_last_name] / [prospect_company_name]",
            "message": getRandomMessage(language_id, 4),
            "delay": "5",
            "recall_step": false
        }]
}

// initial state
const state = getDefaultState()

const actions = {
    getAll({ commit }, args) {
        commit('startLoading')
        campaignsService.getAll(args.currentPage, args.cantPerPage, args.searchFilter, state.allFilters.statusFilter, state.allFilters.siteFilter, state.allFilters.budgetFilter, state.allFilters.ownerFilter).then(
            campaigns => {
                commit('getAllSuccess', campaigns)
                commit('finishLoading')
            }
            )
        
    },

    getInfoCampaigns({ commit }, args) {
        commit('startLoading')
        campaignsService.getInfoCampaigns().then(
            campaigns => {
                commit('getAllDashboardSuccess', campaigns)
                commit('finishLoading')
            }
        )
    },

    getListAllCampaigns({ commit }, args) {
        commit('startLoading')
        campaignsService.getAllByClientId().then(
            campaigns => {
                commit('getListAllCampaignsSuccess', campaigns)
                commit('finishLoading')
            }
        )
    },

    getAllByFilter({ commit }, args) {
        commit('startLoading')
        campaignsService.getAllByFilter(args.currentPage, args.cantPerPage, args.searchFilter).then(
            campaigns => {
                commit('getAllSuccess', campaigns)
                commit('finishLoading')
            }
        )
    },

    getAllByClientId({ commit }, args) {
        commit('startLoading')
        campaignsService.getAllByClientId().then(
            campaigns => {
                commit('getAllSuccess', campaigns)
                commit('finishLoading')
            }
        )
        
    },

    getById ({ commit }, args) {
        commit('startLoading')
        if(isNaN(args.id)){
            commit('finishLoading')
        }
        campaignsService.getModelEdit(args.id).then(
            campaign => {
                campaign.campaign.tpl_first_step_before = JSON.parse(JSON.stringify(campaign.campaign.tpl_first_step));
                campaign.changed = [];
                commit('getSelectedSuccess', campaign)
                commit('finishLoading')
            }
        )
    
    
    },

    getStatsById ({ commit }, args) {
        commit('startloadingStats')
        campaignsService.getStatsRange(args.id).then(
            stats => {
                commit('getSelectedStatsSuccess', stats)
                if (stats !== "") {
                    commit('finishloadingStats')
                }
            }
            )
    },

    getStatsByIdAndRange ({ commit }, args) {
        commit('startloadingStats')
        campaignsService.getStatsRange(args.id,args.startDate,args.endDate,args.client,args.filters).then(
            stats => {
                commit('getSelectedStatsSuccess', stats)
                if (stats !== "") {
                    commit('finishloadingStats')
                }
            }
            )
    },

    getEmpty ({ commit }, args) {
        commit('startLoading')
        commit('getEmptySuccess', {
            'regions_selected':{},
            'categories_google_selected': {},
            'categories_google_all_selected': {},
            'company_size_selected':[],
            'company_type_selected':{},
            'categories_search_words_selected': {},
            'regions_allowed':[],
            'param_5':[],
            'campaign' : {
                'is_tpl_first_step': true,
                'tpl_first_step': {
                    'subject': '',
                    'entrance': '',
                    'hook': '',
                    'personalized_hook': '',
                    'final_hook': '',
                    'service': '',
                    'presentation': '',
                    'politeness': '',
                    'exit': '',
                    'final_message': '',
                },
                'daily_budget' : '50', 
                'daily_budget_custom' : '',
                'emails_per_day': '50',
                'my_proposition' : '',
                'language_id': '',
                'start_date': '',
            },
            'param_4': [{"id": "1", "name": "Monday"}, {"id": "2", "name": "Tuesday"}, {"id": "3", "name": "Wednesday"}, {"id": "4", "name": "Thursday"}, {"id": "5", "name": "Friday"}],
            'parameters_tf': ["1", "2", "3"],
            'campaign_steps': [],
            'campaign_steps_default': []
          })
        commit('finishLoading')        
    },

    generateDefaultsSteps({ commit }, args) {
        commit('startLoading')
        commit('generateDefaultsStepsSuccess', {
            'campaign_steps_default': getDefaultCampaignSteps(args.language_id),
            'language_id': args.language_id,
            'tpl_first_step': {
                'subject': '',
                'entrance': '',
                'hook': '',
                'personalized_hook': '',
                'final_hook': '',
                'service': '',
                'presentation': '',
                'politeness': '',
                'exit': '',
                'final_message': '',
            }
        })
        commit('finishLoading')
    },
    getOptionsMessage({ commit }, args) {
        return relLanguajes.find(lang => lang.id == args.language_id);
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
    changeMode({ commit }, args) {
        commit('changeMode', args.isTplFirstStep);
    },
    changeCampaignStatus({commit, dispatch}, args){
        commit('changeCampaignStatus', args);
    },
}

const mutations = {
    getAllSuccess (state, campaigns) {
        state.all = { data: campaigns };
    },
    getAllDashboardSuccess (state, campaigns) {
        state.alldashboard = { data: campaigns };
    },
    getListAllCampaignsSuccess (state, campaigns) {
        state.listAllCampaigns = { data: campaigns };
    },
    getSelectedSuccess (state, campaign) {
        state.selected = { data: campaign };
    },
    getSelectedStatsSuccess (state, stats) {
        state.stats = { data: stats };
    },
    getEmptySuccess (state, campaign) {
        state.selected = { data: campaign };
    },
    generateDefaultsStepsSuccess (state, args) {
        state.selected.data.campaign_steps_default = args.campaign_steps_default;
        state.selected.data.campaign.language_id = args.language_id;
        state.selected.data.campaign.tpl_first_step = args.tpl_first_step;
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
        state.allFilters.campaignStatusFilter = '';
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
    changeMode(state, isTplFirstStep) {
        state.selected.data.campaign.is_tpl_first_step = isTplFirstStep;
    },  
    changeCampaignStatus(state, args){
        if(state.all.data){
            const campaign = state.all.data.list.find( campaign => { return campaign.id == args.id});
            campaign.campaign_status_id = args.campaign_status_id;
            campaign.campaign_status = args.campaign_status;
        }
    }, 
}

export const campaigns = {
    namespaced: true,
    state,
    actions,
    mutations
}