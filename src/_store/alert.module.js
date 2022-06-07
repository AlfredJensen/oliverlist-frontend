import i18n from '@/_helpers/i18n';

const generalErrors = ["error", "paymentrequired", "errordata", "outofservice"];
export const alert = {
    namespaced: true,
    state: {
        type: null,
        message: null
    },
    actions: {
        success({ commit }, message) {
            commit('success', message);
        },
        error({ commit }, message) {
            commit('error', message);
        },
        newError({ commit }, {message, section}) {
            message = String(message);
            if(message.includes('Failed to fetch')){
                if(section == 'login'){
                    commit('error', i18n.t('lang.'+section+'.error.failedtofetch'));
                }else{
                    commit('error', i18n.t('lang.general.error'));
                }
            }else if(generalErrors.includes(message)){
                commit('error', i18n.t('lang.general.'+message));
            }else if(section != undefined){
                commit('error', i18n.t('lang.'+section+'.error.'+message));
            }else{
                commit('error', message);
            }
        },
        clear({ commit }) {
            commit('clear');
        }
    },
    mutations: {
        success(state, message) {
            state.type = 'alert-success';
            state.message = message;
        },
        error(state, message) {
            state.type = 'alert-danger';
            state.message = message;
        },
        clear(state) {
            state.type = null;
            state.message = null;
        }
    }
}
