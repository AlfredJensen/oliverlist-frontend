export const statusPointMixin = {
    methods: {
        statusPoint(statusName) {
            switch (statusName) {
                case 'positive':
                case 'Created':
                case 'Active':
                    return 'status-colors positive';
                    break;
                case 'stopped':
                case 'Stopped':
                    return 'status-colors stopped';
                    break;
                default:
                    return 'status-colors paused';
            }
        },
    }
}