export const gmapsMixin = {
    methods: {
        checkAndAttachMapScript: function (callback) {
           if (!!window.google) {  // If you're using vue cli, then directly checking
                                   // 'google' obj will throw an error at the time of transpiling.
              callback();
              return true;
           }
           let apikey = "AIzaSyBC_P0f8Vc5jpGZnZZ0bBVOnNLkRos5T4s";
           window.mapApiInitialized = callback;
           let script = document.createElement('script');
           script.src = 'https://maps.googleapis.com/maps/api/js?key='+apikey+'&callback=mapApiInitialized&libraries=places';
           document.body.appendChild(script);
        }
    }
    
}