import { categoriesService, regionsService, campaignsService, countriesService, lenguagesService } from '@/_services'

const getDefaultState = () => {
  return {
    loading: false,
    all: [],
    totalLoading: 0,
    totalLoadingAll: 15,
    completeLoading: false,
    contractListLoaded: false
  }
}

const REGIONS = 'regions';
const COUNTRIES = 'countries';
const CATEGORIES_GOOGLE = 'categories_google';
const CATEGORIES_SEARCH_WORDS = 'categories_search_words';
const CATEGORIES_SEARCH_FUNCTION = 'categories_search_function';
const CATEGORIES_SEARCH_LEVEL = 'categories_search_level';
const CATEGORIES_GOOGLE_ALL = 'categories_google_all';
const PROFILE_COUNTRIES = 'profile_countries';
const TIMEZONES = 'timezones';
const LANGUAGES = 'languages';

const allOptionsSession = {
  countries: JSON.parse(sessionStorage.getItem(COUNTRIES)),
  regions: JSON.parse(sessionStorage.getItem(REGIONS)),
  categories_google: JSON.parse(sessionStorage.getItem(CATEGORIES_GOOGLE)),
  categories_google_all: JSON.parse(sessionStorage.getItem(CATEGORIES_GOOGLE_ALL)),
  categories_search_words: JSON.parse(sessionStorage.getItem(CATEGORIES_SEARCH_WORDS)),
  categories_search_function: JSON.parse(sessionStorage.getItem(CATEGORIES_SEARCH_FUNCTION)),
  categories_search_level: JSON.parse(sessionStorage.getItem(CATEGORIES_SEARCH_LEVEL)),
  param_5: JSON.parse(sessionStorage.getItem('param_5')),
  param_4: JSON.parse(sessionStorage.getItem('param_4')),
  param_10: JSON.parse(sessionStorage.getItem('param_10')),
  param_17: JSON.parse(sessionStorage.getItem('param_17')),
  parameters_tf: JSON.parse(sessionStorage.getItem('parameters_tf')),
  profile_countries: JSON.parse(sessionStorage.getItem(PROFILE_COUNTRIES)),
  timezones: JSON.parse(sessionStorage.getItem(TIMEZONES)),
  languages: JSON.parse(sessionStorage.getItem(LANGUAGES)),
}

// initial state
const state = getDefaultState()

const actions = {
  getAll({ dispatch, commit }, args) {
    // state.totalLoadingAll is the total dispatchs
    // 1
    dispatch('getCategoriesGoogle', args)
    // 2
    dispatch('getCategoriesGoogleAll', args)
    // 3
    dispatch('getCategoriesSearchFunction', args)
    // 4
    dispatch('getCategoriesSearchLevel', args)
    // 5
    dispatch('getRegions', args)
    // 6
    dispatch('getCountries', args)
    // 7
    dispatch('getParametersOptions', { parameterTypeId: 5 })
    // 8
    dispatch('getParametersOptions', { parameterTypeId: 10 })
    // 9
    dispatch('getParametersOptions', { parameterTypeId: 17 })
    // 10
    dispatch('getAvailableTokens', args)
    // 11
    dispatch('getParametersTypes', args)
    // 12
    dispatch('getParametersOptions', { parameterTypeId: 4 })
    // 13
    dispatch('getProfileCountries', args)
    // 14
    dispatch('getTimezones', args)
    // 15
    dispatch('getLanguages', args)
  },

  getCategoriesGoogle({ commit }, args) {
    commit('startLoading')
    if (!allOptionsSession[CATEGORIES_GOOGLE]) {
      categoriesService
        .getAll()
        .then(
          (response) => {
            if (response.length > 0) {
              sessionStorage.setItem(CATEGORIES_GOOGLE, JSON.stringify(response));
              commit('getAllSuccess', [response, CATEGORIES_GOOGLE])
              commit('finishLoading')
            }
          }
        )
    } else {
      commit('getAllSuccess', [allOptionsSession[CATEGORIES_GOOGLE], CATEGORIES_GOOGLE])
      commit('finishLoading')
    }
  },

  getCategoriesGoogleAll({ commit }, args) {
    commit('startLoading')
    if (!allOptionsSession[CATEGORIES_GOOGLE_ALL]) {
      categoriesService
        .getAllGoogle()
        .then(
          (response) => {
            if (response.length > 0) {
              sessionStorage.setItem(CATEGORIES_GOOGLE_ALL, JSON.stringify(response));
              commit('getAllSuccess', [response, CATEGORIES_GOOGLE_ALL])
              commit('finishLoading')
            }
          }
        )
    } else {
      commit('getAllSuccess', [allOptionsSession[CATEGORIES_GOOGLE_ALL], CATEGORIES_GOOGLE_ALL])
      commit('finishLoading')
    }
  },

  getCategoriesSearchWords({ commit }, args) {
    if (!allOptionsSession[CATEGORIES_SEARCH_WORDS]) {
      commit('startLoading')
      categoriesService
        .getCategoriesSearch()
        .then(
          (response) => {
            if (response.length > 0) {
              sessionStorage.setItem(CATEGORIES_SEARCH_WORDS, JSON.stringify(response));
              commit('getAllSuccess', [response, CATEGORIES_SEARCH_WORDS])
              commit('finishLoading')
            }
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[CATEGORIES_SEARCH_WORDS], CATEGORIES_SEARCH_WORDS])
      commit('finishLoading')
    }
  },


  getCategoriesSearchFunction({ commit }, args) {
    if (!allOptionsSession[CATEGORIES_SEARCH_FUNCTION]) {
      commit('startLoading')
      categoriesService
        .getCategoriesSearchFunction()
        .then(
          (response) => {
            if (response.length > 0) {
              sessionStorage.setItem(CATEGORIES_SEARCH_FUNCTION, JSON.stringify(response));
              commit('getAllSuccess', [response, CATEGORIES_SEARCH_FUNCTION])
              commit('finishLoading')
            }
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[CATEGORIES_SEARCH_FUNCTION], CATEGORIES_SEARCH_FUNCTION])
      commit('finishLoading')
    }
  },

  getCategoriesSearchLevel({ commit }, args) {
    if (!allOptionsSession[CATEGORIES_SEARCH_LEVEL]) {
      commit('startLoading')
      categoriesService
        .getCategoriesSearchLevel()
        .then(
          (response) => {
            if (response.length > 0) {
              sessionStorage.setItem(CATEGORIES_SEARCH_LEVEL, JSON.stringify(response));
              commit('getAllSuccess', [response, CATEGORIES_SEARCH_LEVEL])
              commit('finishLoading')
            }
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[CATEGORIES_SEARCH_LEVEL], CATEGORIES_SEARCH_LEVEL])
      commit('finishLoading')
    }
  },

  getRegions({ commit }, args) {
    commit('startLoading')
    if (!allOptionsSession[REGIONS] || allOptionsSession[REGIONS].length == 0) {
      regionsService
        .getHierarchy()
        .then(
          (response) => {

            sessionStorage.setItem(REGIONS, JSON.stringify(response));
            commit('getAllSuccess', [response, REGIONS])
            commit('finishLoading')

          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[REGIONS], REGIONS])
      commit('finishLoading')
    }
  },


  getCountries({ commit }, args) {
    commit('startLoading')
    if (!allOptionsSession[COUNTRIES]) {
      regionsService
        .getCountries()
        .then(
          (response) => {
            if (response.length > 0) {
              sessionStorage.setItem(COUNTRIES, JSON.stringify(response));
              commit('getAllSuccess', [response, COUNTRIES])
              commit('finishLoading')
            }
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[COUNTRIES], COUNTRIES])
      commit('finishLoading')
    }
  },

  getParametersOptions({ commit }, { parameterTypeId }) {
    let param = 'param_' + parameterTypeId
    commit('startLoading')
    if (!allOptionsSession[param]) {
      campaignsService
        .getParameterTypesOptions(parameterTypeId)
        .then(
          (response) => {
            response.forEach(item => {
              item.label = item.name;
              if (item.label == "Groupe National" || item.label == "Groupe International" || item.label == "Succursale" || item.label == "Franchisé") {
                item.isDisabled = true;
              }
            });
            sessionStorage.setItem(param, JSON.stringify(response));
            commit('getAllSuccess', [response, param])
            commit('finishLoading')
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[param], param])
      commit('finishLoading')
    }
  },

  getParametersTypes({ commit }) {
    let param = 'parameters_tf'
    commit('startLoading')
    if (!allOptionsSession[param] || true) {
      campaignsService
        .getParameterTypes()
        .then(
          (response) => {
            sessionStorage.setItem(param, JSON.stringify(response));
            commit('getAllSuccess', [response, param])
            commit('finishLoading')
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[param], param])
      commit('finishLoading')
    }
  },



  getAvailableTokens({ commit }, args) {
    let param = 'available_tokens'
    commit('startLoading')
    if (!allOptionsSession[param]) {
      campaignsService
        .getAvailableTokens()
        .then(
          (response) => {
            sessionStorage.setItem(param, JSON.stringify(response));
            commit('getAllSuccess', [response, param])
            commit('finishLoading')
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[param], param])
      commit('finishLoading')
    }
  },

  getProfileCountries({ commit }, args) {
    commit('startLoading')
    if (!allOptionsSession[PROFILE_COUNTRIES]) {
      countriesService
        .getAll()
        .then(
          (response) => {
            if (response.length > 0) {
              sessionStorage.setItem(PROFILE_COUNTRIES, JSON.stringify(response));
              commit('getAllSuccess', [response, PROFILE_COUNTRIES])
              commit('finishLoading')
            }
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[PROFILE_COUNTRIES], PROFILE_COUNTRIES])
      commit('finishLoading')
    }
  },

  getTimezones({ commit }, args) {
    commit('startLoading')
    if (!allOptionsSession[TIMEZONES]) {
      regionsService
        .getTimezones()
        .then(
          (response) => {
            if (response.length > 0) {
              sessionStorage.setItem(TIMEZONES, JSON.stringify(response));
              commit('getAllSuccess', [response, TIMEZONES])
              commit('finishLoading')
            }
          }
        );
    } else {
      commit('getAllSuccess', [allOptionsSession[TIMEZONES], TIMEZONES])
      commit('finishLoading')
    }
  },

  getLanguages({ commit }, args) {
    commit('startLoading')
    if (!allOptionsSession[LANGUAGES]) {
      lenguagesService.getAll().then((response) => {
        if (response.length > 0) {
          sessionStorage.setItem(LANGUAGES, JSON.stringify(response));
          commit('getAllSuccess', [response, LANGUAGES])
          commit('finishLoading')
        }
      }
      );
    } else {
      commit('getAllSuccess', [allOptionsSession[LANGUAGES], LANGUAGES])
      commit('finishLoading')
    }
  },

}

const mutations = {
  getAllSuccess(state, data) {
    let name_input = data[1];
    state.all[name_input] = { data: data[0] };
  },
  startLoading(state) {
    state.loading = true;
  },
  finishLoading(state) {
    state.loading = false;
    state.totalLoading++;

    //set completeLoading
    if (state.totalLoading == state.totalLoadingAll) state.completeLoading = true

    // set contractListLoaded
    state.contractListLoaded = allOptionsSession[CATEGORIES_GOOGLE_ALL] !== undefined &&
      allOptionsSession[CATEGORIES_SEARCH_WORDS] !== undefined &&
      allOptionsSession[CATEGORIES_SEARCH_FUNCTION] !== undefined &&
      allOptionsSession[CATEGORIES_SEARCH_LEVEL] !== undefined &&
      allOptionsSession[COUNTRIES] !== undefined &&
      allOptionsSession[REGIONS] !== undefined;
  },

}

export const optionsList = {
  namespaced: true,
  state,
  actions,
  mutations,
}