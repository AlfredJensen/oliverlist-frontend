import { usersService, notificationService } from '@/_services';
import { campaignsService } from '@/_services';
import { router } from '@/_helpers';
import i18n from '@/_helpers/i18n'
import { store } from '.';


let user = null;
try {
  user = window.localStorage.getItem("xkhx$$") != null ? JSON.parse(decodeURIComponent(escape(atob(window.localStorage.getItem("xkhx$$"))))) : null;
//window.localStorage.removeItem("xkhx$$");
}catch (error) {
  user = null;
}
if (user && user.user && user.user.lang_code) {
  i18n.locale = user.user.lang_code;
}

const initialState = user ? user :
  {
    status: {},
    user: null,
    notifications: 0,
    isEmailSync: false,
    notificationspopup: [],
    toastNotificationData: {
      'credits': { total: 0, attempts: "0", from: "0", to: "0", left: 0 },
      'trialPeriodData': {
        'trial_period_ended': 0,
      },
      'hasDefaultPaymentMethod': {},
      'hasDeclinedPayments': {},
      'dontChargePayments': 0,
      'hasPendingPayments': false,
      'subscriptionActive': 0,
      'notifications': 0,
    },
    isAppAvailable: false
  };

export const authentication = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ dispatch, commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        commit('loginRequest', { username });
        usersService.login(username, password)
          .then(
            user => {
              commit('loginSuccess', user);
              dispatch('getToastNotificationData');

              i18n.locale = user.lang_code;

              // TODO delete this
              localStorage.setItem('priorityCategoryFilter', JSON.stringify({}));
              localStorage.setItem('priorityProductFilter', JSON.stringify({}));

              resolve('ok');

            },
            error => {
              commit('loginFailure', error);
              dispatch('alert/newError', { message: error, section: 'login' }, { root: true });
              reject('error')
            }
          );
      });
    },

    refreshToken({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        usersService.refreshToken()
          .then(
            user => {
              commit('loginSuccess', user);
              dispatch('getToastNotificationData');
              resolve('ok');
            },
            error => {
              commit('loginFailure');
              dispatch('alert/newError', { message: error, section: 'login' }, { root: true });
              localStorage.setItem('afterLoginGoTo', router.currentRoute.fullPath);
              router.push('/login');
              // router.push({ name: 'login', query: { redirect: router.currentRoute.fullPath } });
              reject('error')
            }
          );
      });
    },

    verificationcode({ dispatch, commit }, { code, username, password, clientId }) {
      if (username == '') {
        commit('emailNotVerified');
        usersService.verificationCodeLoggedIn(code)
          .then(
            args => {
              commit('emailVerified');
            },
            error => {
              dispatch('alert/error', error, { root: true });
            }
          );

      } else {
        usersService.verificationCode(code, username, password, clientId)
          .then(
            args => {
              dispatch('login', { username: args.username, password: password, redirectDashboard: false }).then(
                result => {
                  commit('emailVerified');
                }
              );
            },
            error => {
              dispatch('alert/error', error, { root: true });
            }
          );
      }
    },

    resendVerificationCode({ dispatch, commit }, { username }) {
      dispatch('alert/clear', {}, { root: true })
      return new Promise((resolve, reject) => {

        username = username == '' ? user.user.username : username;
        usersService.resendVerificationCode(username)
          .then(
            args => {
              resolve('ok');
            },
            error => {
              dispatch('alert/error', "Server error", { root: true });
              reject('error')
            }
          );
      });

    },

    create({ dispatch, commit }, { dataUser }) {
      dispatch('alert/clear', {}, { root: true })
      usersService.create(dataUser)
        .then(
          user => {
            commit('emailSent');
          },
          error => {
            dispatch('alert/newError', { message: error, section: 'user' }, { root: true });
          }
        );
    },

    addNewUser({ dispatch, commit }, { dataUser }) {
      dispatch('alert/clear', {}, { root: true })
      return new Promise((resolve, reject) => {
        usersService.addNewUser(dataUser)
          .then(
            user => {
              // commit('emailSent');
              resolve('ok');
            },
            error => {
              dispatch('alert/newError', { message: error, section: 'user' }, { root: true });
              reject('error');
            }
          );
      });
    },

    requestNewPassword({ dispatch, commit }, { email }) {
      let message = 'Nous traitons votre demande.';
      dispatch('alert/success', message, { root: true });
      usersService.requestNewPassword(email)
        .then(
          response => {
            message = 'Veuillez vérifier votre boîte aux lettres.';
            dispatch('alert/success', message, { root: true });
          },
          error => {
            dispatch('alert/error', error, { root: true });
          }
        );
    },

    logout({ commit }) {
      usersService.logout();
      commit('logout');
    },

    setNotifications({ dispatch, commit }, cant) {
      commit('setNotifications', cant);
    },

    watchVideo({ dispatch, commit }, yes) {
      commit('watchVideo', yes);
    },

    getIsEmailSync({ dispatch, commit }) {
      usersService.getEmailSettings()
        .then(result => {
          let isEmailSync = false;
          if (result.email && result.activated == 1) {
            isEmailSync = true;
          }
          commit('setIsEmailSync', isEmailSync);
        });
    },

    setIsEmailSync({ dispatch, commit }, isEmailSync) {
      commit('setIsEmailSync', isEmailSync);
    },

    getToastNotificationData({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        usersService.hasPaymentDefault().then(
          toastNotificationData => {
            if (toastNotificationData !== undefined) {
              commit('setToastNotificationData', toastNotificationData);
            }
            resolve('ok');

          },
          error => {
            reject('error')
          }
        );
        notificationService.getTasksPopup().then(
          notificationspopup => {
            if (notificationspopup !== undefined) {
              commit('setNotificationPopupData', notificationspopup);
            }
          }
        ).catch((err) => {

        });
      });
    },

    setLangCode({ dispatch, commit }, langCode) {
      i18n.locale = langCode;
      commit('setLangCode', langCode);
    },

  },
  mutations: {
    loginRequest(state, user) {
      state.status = { loggingIn: true };
      state.user = user;
    },
    setNotifications(state, cant) {
      state.notifications = cant;
    },
    watchVideo(state, yes) {
      state.watchvideo = yes;
    },
    setIsEmailSync(state, isEmailSync) {
      state.isEmailSync = isEmailSync;
      localStorage.setItem("xkhx$$", btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
    },
    setLangCode(state, langCode) {
      state.user.lang_code = langCode;
      localStorage.setItem("xkhx$$", btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
    },
    loginSuccess(state, user) {
      state.status = { loggingIn: true };
      state.user = user;
    },
    emailNotVerified(state) {
      state.status = { loggedIn: true, emailSent: false, emailVerified: false };
    },
    emailVerified(state) {
      state.status = { loggedIn: true, emailSent: true, emailVerified: true };
      state.user.verificationcode = null;
      localStorage.setItem("xkhx$$", btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
    },
    emailSent(state) {
      state.status = { emailSent: true };
    },
    loginFailure(state) {
      state.status = {};
      state.user = null;
    },
    logout(state) {
      state.status = {};
      state.user = null;
    },
    setNotificationPopupData(state, notificationspopup) {
      if (notificationspopup !== undefined && notificationspopup.length > 0)
        state.notificationspopup = notificationspopup;
    },


    setToastNotificationData(state, toastNotificationData) {
      state.toastNotificationData = toastNotificationData;
      state.notifications = toastNotificationData.notifications;
      state.isAppAvailable = true; // isAppAvailable;
      localStorage.setItem("xkhx$$", btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
    }
  }
}
