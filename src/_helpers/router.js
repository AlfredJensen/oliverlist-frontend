import Vue from "vue";
import Router from "vue-router";
import i18n from "@/_helpers/i18n";
import { store } from '@/_store'

// Import views
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Agencies from "../views/Agencies.vue";
import AgencyContract from "../components/Agencies/AgencyContract.vue";

import LostPassword from "../views/LostPassword.vue";
import AllOpportunities from "@/components/Opportunities/AllOpportunities.vue";
import Emails from "../views/Emails.vue";
import Users from "../views/Users.vue";
import Campaigns from "../views/Campaigns.vue";
import Billing from "../views/Billing.vue";
import SettingsAccount from "../views/SettingsAccount.vue";
import Dashboard from "../views/Dashboard.vue";
import DashboardFirst from "../views/Dashboard.vue";
import Upgrade from "../views/Upgrade.vue";
import Downgrade from "../views/Downgrade.vue";
import CreateAccount from "../views/CreateAccount.vue";
import Businesses from "../views/Businesses.vue";
import AccountDeleted from "../views/AccountDeleted.vue";
import Companies from "../views/Companies.vue";
import faq from "../views/faq.vue";
import tutorials from "../views/tutorials.vue";
import checklist from "../views/Checklist.vue";
import improvement from "../views/improvement.vue";
import WebsitesAnalysis from "../views/WebsitesAnalysis.vue";
import ImportLinkedinContacts from "@/components/Contacts/ImportLinkedinContacts.vue";
import OnDemandView from "@/components/Contacts/OnDemandView.vue";
import MyContactsList from "@/views/MyContactsList.vue";
import SelectedUser from "@/components/Users/SelectedUser.vue";
import Campaigndashboard from "../views/Campaigndashboard.vue";
import EmailView from "@/components/Emails/EmailView.vue";
import CampaignDashboard from "@/components/Campaigns/CampaignDashboard.vue";
import YourAudience from "@/components/AccountCreation/Steps/Campaign/YourAudience.vue";
import YourMessage from "@/components/AccountCreation/Steps/Campaign/YourMessage.vue";
import Tracking from "@/components/AccountCreation/Steps/Campaign/Tracking.vue";
import Budget from "@/components/AccountCreation/Steps/Campaign/Budget.vue";
import Summary from "@/components/AccountCreation/Steps/Campaign/Summary.vue";
import Connection from "@/components/AccountCreation/Steps/Campaign/Connection.vue";
import CampaignEdit from "@/components/AccountCreation/Steps/CampaignEdit.vue";
import SelectedContact from "@/components/Businesses/SelectedContact.vue";
import SelectedCompany from "@/components/Businesses/SelectedCompany.vue";
import MonthlyReport from "@/components/Reports/MonthlyReport.vue";
import Usages from "../views/Usages.vue";
import SignUp from "../views/SignUp.vue"

import jQuery from 'jquery'
let $ = jQuery;

Vue.use(Router);

export const router = new Router({
  linkActiveClass: "active",
  mode: "history",
  duplicateNavigationPolicy: "ignore",
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp
    },
    {
      path: "/lostpassword",
      name: "lostpassword",
      component: LostPassword,
    },
    {
      path: "/deleted",
      name: "deleted",
      component: AccountDeleted,
      meta: {
        rolAuth: ["2", "3"]
      },
    },
    {
      path: "/proposal",
      name: "proposal",
      component: AgencyContract,
    },
    {
      path: "/createaccount/",
      name: "createaccount",
      component: CreateAccount,
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        KeepAlive: true // Need to be cached
      },
      redirect: {
        name: "dashboardfirst",
      },
      children: [
        {
          path: "/agencies/:id?",
          name: "agencies",
          component: Agencies,
          meta: {
            rolAuth: ["1"],
            KeepAlive: true // Need to be cached
          },
        },
        {
          path: "/contract",
          name: "contract",
          component: AgencyContract,
          meta: {
            rolAuth: ["4"],
            KeepAlive: true // Need to be cached
          },
        },
        {
          path: "/upgrade",
          name: "ugrade",
          component: Upgrade,
          meta: {
            rolAuth: ["2"]
          },
        },
        {
          path: "/downgrade",
          name: "downgrade",
          component: Downgrade,
          meta: {
            rolAuth: ["2"]
          },
        },
        {
          path: "/mysearchs",
          name: "mysearchs",
          component: ImportLinkedinContacts,
          meta: {
            rolAuth: ["1", "2", "3"]
          },
        },
        {
          path: "/checklist",
          name: "checklist",
          component: checklist,
          meta: {
            rolAuth: ["1", "2", "3"]
          },
        },
        {
          path: "/mysearchs/:defaulttab",
          props: { defaulttab: 'newsearch' },
          name: "mysearchs",
          component: ImportLinkedinContacts,
          meta: {
            rolAuth: ["1", "2", "3"]
          },
        },
        {
          path: "/ondemand",
          name: "ondemand",
          component: OnDemandView,
          meta: {
            rolAuth: ["1", "2", "3"]
          },
        },
        {
          path: "/opportunities",
          name: "opportunities",
          component: AllOpportunities,
          meta: {
            rolAuth: ["1", "2", "3"],
            afterTrialPeriodAvailable: false,
            KeepAlive: true // Need to be cached
          },
        },
        {
          path: "/opportunities/:id",
          name: "opportunity",
          component: AllOpportunities,
          props: { id: true },
          meta: {
            rolAuth: ["1", "2", "3"],
            afterTrialPeriodAvailable: false,
          },
        },
        {
          path: "/emails/:id?",
          name: "emails",
          component: Emails,
          meta: {
            rolAuth: ["1", "2"]
          },
          children: [
            {
              path: "/emails/:id",
              component: EmailView,
              props: { id: true },
              meta: {
                rolAuth: ["1", "2"]
              },
            },
          ],
        },
        {
          path: "/emailscat/:cat?",
          name: "emails",
          component: Emails,
          meta: {
            rolAuth: ["1", "2"]
          },
        },
        {
          path: "/businesses/:id?",
          name: "businesses",
          component: Businesses,
          meta: {
            rolAuth: ["1", "2", "3"],
            afterTrialPeriodAvailable: false,
            KeepAlive: true // Need to be cached
          },
          children: [
            {
              path: "/contact/:id",
              name: "selected-contact",
              component: SelectedContact,
              props: { id: true, business_id: true },
              meta: {
                rolAuth: ["1", "2"],
              },
            },
            {
              path: "/company/:id",
              component: SelectedCompany,
              name: "selected-company",
              props: { id: true, contact_id: true },
              meta: {
                rolAuth: ["1", "2"]
              },
            },
          ],
        },
        {
          path: "/companies/:id?",
          name: "companies",
          component: Companies,
          meta: {
            rolAuth: ["1", "2"]
          },

        },
        {
          path: "/mycontacts",
          name: "mycontacts",
          component: MyContactsList,
          meta: {
            rolAuth: ["1", "2"]
          },
        },
        {
          path: "/users/:id?",
          name: "users",
          component: Users,
          meta: {
            rolAuth: ["1", "2"]
          },
          children: [
            {
              path: "/users/:id",
              component: SelectedUser,
              props: { id: true },
              meta: {
                rolAuth: ["1", "2"]
              },
            },
          ],
        },
        {
          path: "/links-analysis",
          name: "links-analysis",
          component: WebsitesAnalysis,
          meta: {
            rolAuth: ["1", "2"]
          },
        },
        {
          path: "/dashboard/:id?",
          name: "dashboard",
          component: Dashboard,
          meta: {
            rolAuth: ["1", "2", "3"],
            KeepAlive: true // Need to be cached
          },
        },
        {
          path: "/dashboardfirst",
          name: "dashboardfirst",
          component: DashboardFirst,
          meta: {
            rolAuth: ["1", "2", "3"],
            KeepAlive: true // Need to be cached
          },
        },
        {
          path: "/campaigndashboard",
          name: "campaigndashboard",
          component: Campaigndashboard,
          meta: {
            rolAuth: ["1", "2", "3"],
            KeepAlive: true // Need to be cached
          },
        },
        {
          path: "/faq",
          name: "faq",
          component: faq,
          meta: {
            rolAuth: ["1", "2", "3"]
          },
        },
        {
          path: "/tutorials",
          name: "tutorials",
          component: tutorials,
          meta: {
            rolAuth: ["1", "2", "3"]
          },
        },
        {
          path: "/improvement",
          name: "improvement",
          component: improvement,
          meta: {
            rolAuth: ["1", "2", "3"]
          }
        },
        {
          path: "/settings-account/:section?/:type?",
          name: "settings-account",
          component: SettingsAccount,
          meta: {
            rolAuth: ["1", "2", "3"]
          },
        },
        {
          path: "/billing/:id?",
          name: "billing",
          component: Billing,
          meta: {
            rolAuth: ["1", "2"]
          },
        },
        {
          path: "/campaigns/:id?",
          name: "campaigns",
          component: Campaigns,
          meta: {
            rolAuth: ["1", "2", "3"],
            afterTrialPeriodAvailable: false,
            KeepAlive: true // Need to be cached
          },
          children: [
            {
              path: "/campaigns/filter/:filter",
              component: Campaigns,
              props: { filter: true },
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              }
            },
            {
              path: "/campaigns/:id",
              component: CampaignEdit,
              props: { id: true },
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
              children: [
                {
                  path: "step1/",
                  name: "editCampaignStep1",
                  component: CampaignEdit,
                  meta: {
                    rolAuth: ["1", "2", "3"],
                    afterTrialPeriodAvailable: false,
                  },
                },
                {
                  path: "step2/",
                  name: "editCampaignStep2",
                  component: YourAudience,
                  meta: {
                    rolAuth: ["1", "2", "3"],
                    afterTrialPeriodAvailable: false,
                  },
                },
                {
                  path: "step3/",
                  name: "editCampaignStep3",
                  component: YourMessage,
                  meta: {
                    rolAuth: ["1", "2", "3"],
                    afterTrialPeriodAvailable: false,
                  },
                },
                {
                  path: "step4/",
                  name: "editCampaignStep4",
                  component: Tracking,
                  meta: {
                    rolAuth: ["1", "2", "3"],
                    afterTrialPeriodAvailable: false,
                  },
                },
                {
                  path: "step5/",
                  name: "editCampaignStep5",
                  component: Budget,
                  meta: {
                    rolAuth: ["1", "2", "3"],
                    afterTrialPeriodAvailable: false,
                  },
                },
                {
                  path: "step6/",
                  name: "editCampaignStep6",
                  component: Summary,
                  meta: {
                    rolAuth: ["1", "2", "3"],
                    afterTrialPeriodAvailable: false,
                  },
                },
                {
                  path: "step7/",
                  name: "editCampaignStep7",
                  component: Connection,
                  meta: {
                    rolAuth: ["1", "2", "3"],
                    afterTrialPeriodAvailable: false,
                  },
                },
                {
                  path: "step8/",
                  name: "editCampaignStep8",
                  component: Connection,
                  meta: {
                    rolAuth: ["1", "2", "3"],
                    afterTrialPeriodAvailable: false,
                  },
                },
              ],
            },
            {
              path: "/campaigns/:id/copy",
              name: "copyCampaign",
              component: CampaignEdit,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
            {
              path: "/campaigns/:id/stats",
              component: CampaignDashboard,
              props: { id: true },
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
                KeepAlive: true // Need to be cached
              },
            },
            {
              path: "step1/",
              name: "campaignStep1",
              component: CampaignEdit,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
            {
              path: "step2/",
              name: "campaignStep2",
              component: YourAudience,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
            {
              path: "step3/",
              name: "campaignStep3",
              component: YourMessage,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
            {
              path: "step4/",
              name: "campaignStep4",
              component: Tracking,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
            {
              path: "step5/",
              name: "campaignStep5",
              component: Budget,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
            {
              path: "step6/",
              name: "campaignStep6",
              component: Summary,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
            {
              path: "step7/",
              name: "campaignStep7",
              component: Connection,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
            {
              path: "step8/",
              name: "campaignStep8",
              component: Connection,
              meta: {
                rolAuth: ["1", "2", "3"],
                afterTrialPeriodAvailable: false,
              },
            },
          ],
        },
        {
          path: "/reports/campaigns/monthly/last",
          name: "monthlyReport",
          component: MonthlyReport,
          meta: {
            rolAuth: ["2", "3"]
          },
        },
        {
          path: "/usages/:id?",
          name: "usages",
          component: Usages,
          meta: {
            rolAuth: ["1"]
          },
        },
      ],
    },
    // otherwise redirect to opportunities
    { path: "*", redirect: "/opportunities" },
  ],
});

router.beforeEach((to, from, next) => {
  // maintenance mode | modo mantenimiento
  // window.location.href = "https://oliverlist.com/in-maintenance";

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login", "/createaccount", "/lostpassword", "/proposal", "/signup"];
  const authRequired = !publicPages.includes(to.path);
  //const loggedIn = localStorage.getItem("user");

  if (store.state.authentication.toastNotificationData == undefined) {
    store.dispatch("authentication/logout");
  }

  const loggedIn = store.state.authentication.user;

  const subscriptionActive = store.state.authentication.toastNotificationData.subscriptionActive;
  const isAppAvailable = true; //store.state.authentication.isAppAvailable;
  const dontChargePayments = store.state.authentication.toastNotificationData.dontChargePayments;
  const hasDefaultPaymentMethod = store.state.authentication.toastNotificationData.hasDefaultPaymentMethod === undefined ? false :
    store.state.authentication.toastNotificationData.hasDefaultPaymentMethod.length > 0;
  const hasDeclinedPayments = store.state.authentication.toastNotificationData.hasDeclinedPayments === undefined ? false :
    store.state.authentication.toastNotificationData.hasDeclinedPayments.length > 0;
  const trialPeriodEnded = store.state.authentication.toastNotificationData.trialPeriodData === undefined ? 0 :
    store.state.authentication.toastNotificationData.trialPeriodData.trial_period_ended;

  //var loggedIn = JSON.parse(loggedIn);
  // console.log('loggedIn', loggedIn)
  // console.log('isAppAvailable*', isAppAvailable)
  // console.log('to.meta.rolAut', to.meta.rolAuth)
  // console.log('to.path', to.path);
  // console.log('to.fullPath', to.fullPath);
  // console.log('dontChargePayments', dontChargePayments);
  // console.log('subscriptionActive', subscriptionActive);
  // console.log('store.state.authentication', store.state.authentication);

  if (authRequired) {

    store.state.sidebar.isExpandedList = false;
    if (!loggedIn || (loggedIn.role_id > 1 && (loggedIn.plan_id === undefined) || loggedIn.is_agency === undefined)) {
      if (from.fullPath !== "login") {
        localStorage.setItem('afterLoginGoTo', to.fullPath);
        // return next({ path: "/login", query: { redirect: to.fullPath } })
      }
      return next("/login");
    }    

    if (loggedIn.subscription_status_id == 2) {
      if (to.fullPath == '/deleted') {
        return next();
      } else {
        return next("/deleted");
      }
    }

    if (loggedIn && loggedIn.role_id != 1) {
      if (loggedIn.verificationcode != null || loggedIn.client_id == null) {
        return next("/signup");
      }
    }

    if (loggedIn.role_id == 4 && loggedIn.is_agency == 1 && loggedIn.agency_signed == 0) {
      if (to.fullPath == '/contract' || to.fullPath == '/agencies/me' || to.fullPath.includes('/settings-account/payment') ) {
        return next();
      } else {
        return next("/contract");
      }
    }

    if (dontChargePayments == 1) {
      return next();
    }

    let afterLoginGoTo = localStorage.getItem('afterLoginGoTo');
    if (afterLoginGoTo !== undefined && afterLoginGoTo !== to.fullPath && afterLoginGoTo !== "/login") {
      localStorage.removeItem('afterLoginGoTo');
      return next({ path: afterLoginGoTo, query: null })
    }

    if (!isAppAvailable && to.fullPath != '/upgrade' && !to.fullPath.includes('/settings-account?billing=1&payment=1') && to.fullPath != '/settings-account' && !to.fullPath.includes('/settings-account/payment/')) {
      // esta suscrito pero el plan no esta activo porque el metodo de pago por defecto ha fallado por mas de 1 mes
      if (loggedIn.plan_version_id != 0 && subscriptionActive == 0) {
        console.log('go to settings 1');
        return next("/settings-account?billing=1&payment=1");
      }
      // si tiene metodo de pago y no esta suscrito o no tiene metodo de pago y no esta suscrito
      else if (hasDefaultPaymentMethod || (!hasDefaultPaymentMethod && loggedIn.plan_version_id == 0)) {
        console.log('go to upgrade');
        return next("/upgrade");
      } else {
        console.log('go to settings 2');
        return next("/settings-account?billing=1&payment=1");
      }
    } else if (!isAppAvailable && (to.fullPath == '/upgrade' || to.fullPath.includes('/settings-account?billing=1&payment=1') || to.fullPath.includes('/settings-account/payment/'))) {
      return next();
    }

    // ROLE ACCESS
    if ($.inArray(loggedIn.role_id, to.meta.rolAuth) == -1) {
      return next("/dashboard");
    }

    // PLAN ID ACCESS
    if (loggedIn.role_id != 1 && to.meta.planIdAccess != undefined && $.inArray(loggedIn.plan_id, to.meta.planIdAccess) == -1) {
      return next("/dashboard");
    }

    if (loggedIn.subscription_status_id != 1 && trialPeriodEnded == 0
      && to.meta.trialPeriodAvailable != undefined && to.meta.trialPeriodAvailable == false) {
      return next("/upgrade");
    }

    if (loggedIn.subscription_status_id != 1 && trialPeriodEnded == 1
      && to.meta.afterTrialPeriodAvailable != undefined && to.meta.afterTrialPeriodAvailable == false
    ) {
      console.log('hasDeclinedPayments', hasDeclinedPayments);
      if (hasDeclinedPayments) {
        if (to.fullPath.includes('/settings-account?billing=1&payment=1')) {
          return next();
        }
        return next("/settings-account?billing=1&payment=1");
      }
      return next("/upgrade");
    }
  }
  if (loggedIn) {
    i18n.locale = loggedIn.lang_code;
  }

  next();
});

router.afterEach((to, from) => {
  //const loggedIn = localStorage.getItem("user");
  //var user = JSON.parse(loggedIn);
  var user = store.state.authentication.user;

  if (user && process.env.VUE_APP_ENV == 'production') {
    if (to.fullPath == '/login') {
    } else {
      let method;
      if (from.fullPath == '/login') {
        method = 'boot';
      } else {
        method = 'update';
      }
    }
  }
})
