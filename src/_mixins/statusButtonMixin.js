import i18n from '@/_helpers/i18n';

export const statusButtonMixin = {
    methods: {
        statusButton(statusName) {
            switch (statusName.toLowerCase()) {
                case 'positive':
                case 'analyzed':
                case 'converted':
                    return "btn-warning";
                    break;
                case 'lost':
                    return "btn-danger";
                    break;
                case 'deleted':
                case 'negative':
                case 'do not contact':
                    return "btn-secondary";
                    break;
                case 'preanalyzed':
                    return "btn-warning";
                    break;
                case 'busy':
                case 'branch':
                    return "btn-primary busy-button";
                    break;
                case 'late qualified':
                    return "btn-info";
                    break;
                case 'received':
                case 'working':
                    return "btn-secondary";
                    break;
                default:
                    return "btn-secondary";
            }
        },
        statusButtonName(statusName) {

                switch (statusName.toLowerCase()) {
                    case 'positive':
                        return i18n.t('lang.opportunities.stoprelance');
                        break;
                    case 'lost':
                        return "Lost";
                        break;
                    case 'analyzed':
                    case 'converted':
                    case 'busy':
                    case 'branch':
                    case 'negative':
                    case 'late qualified':
                    case 'working':
                    case 'preanalyzed':
                    case 'created':
                        return i18n.t('lang.opportunities.relance');
                        break;
                    case 'do not contact':
                        return i18n.t('lang.opportunities.stopcontact');
                        break;
                    case 'deleted':
                        return i18n.t('lang.label.deleted');
                        break;
                    case 'received':
                        return "Received";
                        break;
                    case 'donotcontact':
                        return i18n.t('lang.opportunities.donotcontact');
                        break;
                        return i18n.t('lang.opportunities.donotcontact');
                        break;
                    default:
                        return i18n.t('lang.label.created');
                }
        },
    }
}