export const statusFeedNotificationsMixin = {
    methods: {
        statusFeedNotif(statusName) {
            switch (statusName) {
                case '1':
                    return 'blue';
                    break;
                case '2':
                    return 'pink';
                    break;
                case '3':
                    return 'green';
                    break;
                default:
                    return 'gray';
            }
        },
    }
}