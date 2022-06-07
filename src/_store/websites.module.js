import { websitesService } from '@/_services'

const state = {
    loading: false,
    all: {},
}

const actions = {
    getAll({ commit }, args) {
        commit('startLoading')

        websitesService.getAll(args.currentPage, args.cantPerPage)
            .then(
                websites => {
                    commit('getAllSuccess', websites)
                    commit('finishLoading')
                }
            )
    },

    startLoading({ commit }) {
        commit('startLoading')
    },

    finishLoading({ commit }) {
        commit('finishLoading')
    },
}

const mutations = {
    getAllRequest(state) {
        state.all = { loading: true }
    },
    getAllSuccess(state, websites) {
        state.all = { data: websites }
    },
    getAllFailure(state, error) {
        state.all = { error }
    },
    startLoading(state) {
        state.loading = true
    },
    finishLoading(state) {
        state.loading = false
    }
}

export const websites = {
    namespaced: true,
    state,
    actions,
    mutations
}
