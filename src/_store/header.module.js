import { router } from '@/_helpers';
import i18n from '@/_helpers/i18n';

export const header = {
  namespaced: true,
  state: {
    tab: 'ALL',
    tabs:
    {
      "campaigns": [
        {
          referencia: "ALL",
          nombre: i18n.t("lang.label.all"),

        },
        {
          referencia: "SELECTED",
          nombre: i18n.t("lang.label.selected"),
        },
      ],
      "settings-account": [
        {
          referencia: "ACCOUNT",
          roles: [1, 2, 3, 4],
          nombre: i18n.t("lang.label.account"),

        },
        {
          referencia: "AGENCYDATA",
          roles: [4],
          nombre: i18n.t("lang.label.contractualdata"),

        },
        {
          referencia: "EMAILSETTINGS",
          roles: [2, 3],
          nombre: i18n.t("lang.label.emailsettings"),
        },
        {
          referencia: "BILLING",
          roles: [1, 2, 4],
          nombre: i18n.t("lang.label.billing"),
        },
        {
          referencia: "OLIVERSETTINGS",
          roles: [1],
          nombre: i18n.t("lang.label.settings"),
        },
        {
          referencia: "CUSTOMFIELDS",
          roles: [2, 3],
          nombre: i18n.t("lang.mycontacts.gotocreatecustomfields"),
        },
        {
          referencia: "TEAM",
          roles: [2],
          nombre: i18n.t("lang.label.team"),
        },
        {
          referencia: "INTEGRATIONS",
          roles: [1, 2, 4],
          planIdAccess: [2, 3],
          nombre: i18n.t("lang.label.integrations"),
        },
      ],
    },
  },
  actions: {
    changeTab({ commit }, args) {
      if(args.tab){
        commit('changeTab', args.tab);
      }
    }
  },
  mutations: {
    changeTab(state, tab) {
      state.tab = tab
    },
  }
}
