export const urlMixin = {
    methods: {
        buildUrl(url) {
            var pattern = /^((http|https):\/\/)/;
            if (pattern.test(url)) {
                url = url.replace(/^https?\:\/\//i, "");
            }
            if (!(/www./.test(url))) {
                url = 'www.' + url;
            }
            return url;
        },

    }
}