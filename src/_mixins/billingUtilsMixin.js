import { store } from '@/_store'
export const billingUtilsMixin = {
  methods: {
    checkPaymentMethodAndBudget: function () {
      if (store.state.authentication.toastNotificationData.dontChargePayments == 1) {
        return false;
      } else if ((store.state.authentication.toastNotificationData.hasDefaultPaymentMethod.length == 0 && store.state.authentication.toastNotificationData.trialPeriodData.trial_period_ended == 1) || (store.state.authentication.toastNotificationData.hasPendingPayments.length > 0)) {
        return true;
      }
      return false;      
    },

    hasPaymentMethodCC: function () {
      if (store.state.authentication.toastNotificationData.dontChargePayments == 1 || store.state.authentication.toastNotificationData.hasDefaultPaymentMethod.length > 0) {
        return true;
      }
      return false;
    },

    hasPaymentMethodCCReal: function () {
      if (store.state.authentication.toastNotificationData.hasDefaultPaymentMethod.length > 0) {
        return true;
      }
      return false;
    },

    hasPaymentMethodCCTrialPeriodEnded: function () {
      if (store.state.authentication.toastNotificationData.dontChargePayments == 1 || store.state.authentication.toastNotificationData.trialPeriodData.trial_period_ended == 0 || store.state.authentication.toastNotificationData.hasDefaultPaymentMethod.length > 0) {
        return true;
      }
      return false;
      
    }

  }
}