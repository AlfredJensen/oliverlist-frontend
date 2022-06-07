import { billingsService } from '@/_services'


const getDefaultState = () => {
    return {
        loading: false,
        all: [],
        selected: {}
    }
}

// initial state
const state = getDefaultState()

const actions = {
    getAll({ commit }) {
        commit('startLoading')
        billingsService.getPaymentMethods().then(
            billingsService => {
                    commit('getAllSuccess', billingsService)
                    commit('finishLoading')
                }
        )
    },
    startLoading ({commit}) {
        commit('startLoading')
    },

    finishLoading ({commit}) {
        commit('finishLoading')
    },
}

    
const mutations = {
    getAllSuccess (state, billings) {
        state.all = { data: billings };
    },
    startLoading (state) {
        state.loading = true;
    },
    finishLoading (state) {
        state.loading = false;
    },
    resetSelected(state) {
        state.selected = {};
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
    },
    
}

export const billings = {
    namespaced: true,
    state,
    actions,
    mutations
}