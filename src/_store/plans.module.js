import { plansService } from '@/_services'

const getDefaultState = () => {
  return {
    all: [
      {},
      {
        id: 1,
        name: 'Starter',
        img: '3',
        contacts: '150contactspermonth',
        data: {
          'findcontacts': {
            "unlockusecontacts": {"period": "month", "qty": 150},
            "exportandenrichcontactsgm": "unlimited",
            "exportandenrichcontactsli":  {"period": "day", "qty": 1000},
            "importyourowncontacts": "2000",
          },
          "coldemailoutreach": {
            "emailcampaignrunningatthesametime": "1",
            "connectyoure-mail": "yes",
            "trackemailperformances": "yes",
          },
          "analysisandfollowup": {
            "analyzeprospectbehavioronyourwebsite": "yes",
            "automatedtasksgeneration": "yes",
            "chatsupport": "yes",
            "opportunitiescsvexport": "no",
            "connectwithyourcrm": "no",
            "createyourowncustomvariables": "no",
            "advances statistics": "no",
          },
        }
      },
      {
        id: 2,
        name: 'Advanced',
        img: '2',
        contacts: 'unlimitedcontacts',
        data: {
          'findcontacts': {
            "unlockusecontacts": "unlimited",
            "exportandenrichcontactsgm": "unlimited",
            "exportandenrichcontactsli": {"period": "day", "qty": 1000},
            "importyourowncontacts": "unlimited",
          },
          "coldemailoutreach": {
            "emailcampaignrunningatthesametime": "3",
            "connectyoure-mail": "yes",
            "trackemailperformances": "yes",
          },
          "analysisandfollowup": {
            "analyzeprospectbehavioronyourwebsite": "yes",
            "automatedtasksgeneration": "yes",
            "chatemailphonesupport": "yes",
            "opportunitiescsvexport": "yes",
            "connectwithyourcrm": "yes",
            "createyourowncustomvariables": "yes",
            "advances statistics": "no",
          },
        },
      }, {
        id: 3,
        img: '5',
        name: 'Pro',
        contacts: 'unlimitedcontacts',
        data: {
          'findcontacts': {
            "unlockusecontacts": "unlimited",
            "exportandenrichcontactsgm": "unlimited",
            "exportandenrichcontactsli": {"period": "day", "qty": 1000},
            "importyourowncontacts": "unlimited",
          },
          "coldemailoutreach": {
            "emailcampaignrunningatthesametime": "unlimited",
            "connectyoure-mail": "yes",
            "trackemailperformances": "yes",
          },
          "analysisandfollowup": {
            "analyzeprospectbehavioronyourwebsite": "yes",
            "automatedtasksgeneration": "yes",
            "dedicatedtrainer": "yes",
            "opportunitiescsvexport": "yes",
            "connectwithyourcrm": "yes",
            "createyourowncustomvariables": "yes",
            "advances statistics": "yes",
          },
        },
      }
    ],
    allActives: [],
  }
}


  const state = getDefaultState()

  const actions = {
    getAll({ commit }, args) {
      plansService.getAll().then(
        plans => {
          commit('getAllSuccess', plans)
        }
      );
    },
  }

  const mutations = {
    getAllSuccess(state, plans) {
      state.allActives = plans;
    }
  }

  export const plans = {
    namespaced: true,
    state,
    actions,
    mutations
  }