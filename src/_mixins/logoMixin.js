export const logoMixin = {
    methods: {
        logoUrl(url) {
            if (typeof url == 'string' && url.includes('netty')) {
                var base64Url = btoa(url);
                return `http://ec2-3-82-232-206.compute-1.amazonaws.com/logo.php?url=${base64Url}`;
            } else {
                return url;
            }
        },

        isSvgLogo(logo) {
            return logo != null && logo.includes('<svg') && logo.includes('</svg>')
        }
    }
}