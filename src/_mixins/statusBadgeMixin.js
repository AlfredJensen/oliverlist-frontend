export const statusBadgeMixin = {
    methods: {
        statusEmail(statusName) {
            switch (statusName) {
                case 'OK':
                    return "btn-success";
                    break;
                case 'DELIVERY-STATUS':
                    return "btn-danger";
                    break;
                case 'Undelivered Message':
                    return "btn-danger";
                    break;
                case 'REJECTED':
                    return "btn-danger";
                    break;
                case 'POSITIVE':
                    return "btn-success";
                    break;
                case 'NEGATIVE':
                    return "btn-danger";
                    break;
                case 'STOP':
                    return "btn-danger";
                    break;
            }
        },
        statusBadge(statusName) {
           
            switch (statusName.toLowerCase()) {
                case 'positive':
                case 'analyzed':
                case 'converted':
                    return "btn-success";
                    break;
                case 'lost':
                    return "btn-danger";
                    break;
                case 'deleted':
                case 'negative':
                    return "btn-success";
                    break;
                case 'do not contact':
                    return "btn-danger";
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
        statusBadgeOliver(statusName) {
            switch (statusName) {
                case 'Created':
                    return "btn-success";
                    break;
                case 'Negative':
                    return "btn-success";
                    break;
                case 'Do not contact':
                        return "btn-danger";
                        break;
                case 'Unsubscribed':
                    return "btn-secondary";
                    break;
                default:
                    return "btn-secondary";
            }
        },

        statusBadgeName(statusName) {
           
            switch (statusName.toLowerCase()) {
                    case 'positive':
                        return "Oliver OFF";
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
                        return "Oliver ON";
                        break;
                    case 'do not contact':
                        return this.$t('lang.campaigns_dashboard.donotcontactinfo')
                        break;
                    case 'deleted':
                        return "Deleted";
                        break;
                    case 'received':
                        return "Reçu";
                        break;
                    case 'unsubscribe':
                        return "Unsubscribed";
                        break;
                    case 'donotcontact':
                        return this.$t('lang.campaigns_dashboard.donotcontactinfo')
                        break;
                        return this.$t('lang.campaigns_dashboard.donotcontactinfo')
                        break;
                    default:
                        return "Created";
            }
        },
        statusPayment(statusName) {
            switch (statusName) {
                case '1':
                    return "badge-primary";
                    break;
                case '2':
                    return "badge-success";
                    break;
                case '3':
                    return "badge-warning";
                    break;                
            }
        },
        statusVariation(value) {
            value = parseFloat(value).toFixed(2);
            if(value < 0)
                return "text-warning";
            else
                return "text-success";
            
        },
    }
}