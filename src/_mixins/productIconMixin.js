export const productIconMixin = {
    methods: {
        productIcon(productName) {
            switch (productName) {
                case 'Video':
                    return 'icon-video-camera';
                    break;
                case 'Website':
                    return 'icon-desktop1';
                    break;
                case 'Marketing':
                    return 'icon-line-chart';
                    break;
                case 'Optimum':
                    return 'icon-battery-empty';
                    break;
                default:
                    return 'icon-cube';
            }
        },
    }
}