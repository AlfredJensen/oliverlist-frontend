import { router } from '@/_helpers';
const state = {
    page:'',
    child:'',
    stackPages:0,
    nextPages:0,

}

const actions = {
    changePage({ commit }, args) {
        commit('changePage', args.page);
    },
    setStackPages({ commit }, args){
        commit('setStackPages', args.cantPages);
    },
    increment ({ commit }) {
        commit('increment')
    },
    decrement ({ commit }) {
        commit('decrement')
    },
    resetForward({commit}){
        commit('resetForward')
    },
    setRoute({commit}, args){
        commit('setRoute', args.page);
    },
    setRouteChild({commit}, args){
        commit('setRouteChild', args.child);
    },


}


const mutations = {
    changePage(state, page) {
        state.page = page;
    },
    setStackPages(state, cantPages){
        state.stackPages = cantPages;
    },
    increment(state){
        state.nextPages++;
    },
    decrement(state){
        state.nextPages --;
    },
    resetForward(state){
        state.nextPages = 0;
    },
    setRoute(state,page){
        state.page = page;
    },
    setRouteChild(state,child){
        state.child = child;
    }

}


export const headertopbar = {
    namespaced: true,
    state,
    actions,
    mutations
}