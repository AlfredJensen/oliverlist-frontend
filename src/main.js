import Vue from 'vue'
import App from './App.vue'
import { router } from './_helpers'
import { store } from './_store'
import jQuery from 'jquery'
import i18n from './_helpers/i18n'

// Import Vue Bootstrap Datetime Picker 
import datePicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
Vue.use(datePicker);
jQuery.extend(true, jQuery.fn.datetimepicker.defaults, {
  icons: {
    time: 'icon-clock',
    date: 'icon-calendar',
    up: 'icon-arrow-up',
    down: 'icon-arrow-down',
    previous: 'icon-arrow-left',
    next: 'icon-arrow-right',
    today: 'icon-calendar-check-o',
    clear: 'icon-trash',
    close: 'icon-times-circle'
  }
});

import JsonCSV from 'vue-json-csv'

Vue.component('downloadCsv', JsonCSV)

Vue.use(require('vue-moment'));

import VuePapaParse from 'vue-papa-parse'
Vue.use(VuePapaParse)

import VModal from 'vue-js-modal'
Vue.use(VModal)

// Import Vue ToogleButton
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

// Import Vue Sweet Alert 2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2)

// Import Vue Multiselect
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css'
Vue.component('vue-multiselect', Multiselect);

// Import Vue html2canvas for vue
import VueHtml2Canvas from 'vue-html2canvas';
Vue.use(VueHtml2Canvas);



// Import Bootstrap Framework
import 'bootstrap'
//import 'bootstrap/dist/css/bootstrap.min.css'
require('./assets/css/bootstrap.min.css')

import './registerServiceWorker'

import sanitizeHTML from 'sanitize-html';
Vue.prototype.$sanitize = sanitizeHTML;

import { ValidationProvider } from 'vee-validate';
Vue.component('ValidationProvider', ValidationProvider);




// Import Fonts and Animate
require('./assets/fonts/style.css')
require('./assets/css/animate.css')

// Import custom styles
require('./assets/css/styles.css')
require('./assets/css/sassComponents.css')
require('./assets/css/custom.css')

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  var splitStr = value.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
})

Vue.filter('breakLines', function (value) {
  if (!value) return '';
 let ret = "";
  var groups = value.split(',');
  return groups.join('<br>');
})

Vue.filter('firstLetters', function (string) {
  if (!string) return ''
  var matches = string.match(/\b(\w)/g);
  return matches.join('');
})
Vue.filter('firstLetter', function (string) {
  return string.charAt(0).toUpperCase();
})

Vue.filter('formatDate', function (datetime) {
  if (!datetime) return '';
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var dateArray = datetime.split(/-|\s|:/);
  var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('-');
})


Vue.filter('formatContactName', function (contactName, email) {
  if (!contactName) return '';
  if (contactName.match(RegExp('\\b' + 'Generic' + '\\b', "ig"))) {
    if (!email) return '';
    let name = email.split('@')[0];
    name = name.replace(/[_.-]/gi, " ");
    name = name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
    return name;
  }
  else
    return contactName;
})


Vue.filter('formatDatetime', function (datetime) {
  if (!datetime) return '';
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var time = datetime.split(' ')[1];
  var dateArray = datetime.split(/-|\s|:/);
  var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  return `${time} hs. (` + [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('-') + ')';
})

Vue.filter('formatDatePretty', function (datetime) {
  if (!datetime) return '';
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var time = datetime.split(' ')[1];
  time = time.substring(0, 5);
  var dateArray = datetime.split(/-|\s|:/);
  var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  date = date.toDateString();
  return date + ` ${time} hs. `;
})

Vue.filter('invoiceFormat', function (invoice) {
  invoice = invoice.toString().padStart(10, "0");
  return invoice;
})

Vue.filter('VAT', function (amount) {
  let vat = (amount * 0.2).toFixed(2);
  return vat;
})
Vue.filter('TTC', function (amount) {
  let vat = (amount * 0.2).toFixed(2);
  return (parseFloat(amount) + parseFloat(vat)).toFixed(2);
})

import VueFormGenerator from 'vue-form-generator';
Vue.use(VueFormGenerator)
Vue.component('vue-form-generator', VueFormGenerator.component)

VueFormGenerator.validators.emailValidator = function (value, field, model) {
  if (value != undefined) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
    if (!re.test(value)) {
      let fieldLabel = field == undefined || field.label == undefined ? "Email" : field.label;
      return [i18n.t("lang.validation.email", { field_name: fieldLabel })]
    }
  }

  return [];

};

VueFormGenerator.validators.emailListValidator = function (value, field, model) {
  let errorList = [];
  if (value != undefined) {
    value = value.split(",");
    value.forEach((email) => {
      errorList = VueFormGenerator.validators.emailValidator(email.trim(), field, model);
      if (errorList.length > 0) {
        return false; // break
      }
      return true; // continue
    });
  }
  return errorList;
};
VueFormGenerator.validators.confirmPasswordValidator = function (value, field, model) {
  if (value != model.password) {
    return [i18n.t("lang.validation.confirmpassword")]
  } else {
    return [];
  }
};
VueFormGenerator.validators.validatePassword = function (value, field, model) {
  let re = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,}).{6,16}$/;
  if (!re.test(value)) {
    return [i18n.t("lang.validation.password")]
  } else {
    return [];
  }
};
VueFormGenerator.validators.numberBetweenValidator = function (value, field, model) {
  if (isNaN(value) || value < field.min || value > field.max) {
    return [
      this.$t("lang.validation.between", { min: field.min, max: field.max }),
    ];
  }
  return [];
};

function capitalizeFirstLetter(string) {
  if (string !== undefined) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return ''
}

if (process.env.VUE_APP_ENV == 'production') {
  if (store.state.authentication.user !== null) {
    let smartlook = document.createElement('script')
    smartlook.setAttribute('type', 'text/javascript');
    smartlook.innerHTML = "window.smartlook||(function(d) {";
    smartlook.innerHTML += "var o=smartlook=function()";
    smartlook.innerHTML += "{ o.api.push(arguments)},h=d.getElements";
    smartlook.innerHTML += "ByTagName('hea";
    smartlook.innerHTML += "d')[0];var c=d.createElement('scr";
    smartlook.innerHTML += "ipt');o.api=new Array();c.async";
    smartlook.innerHTML += "=true;c.type='text/javascript';c.charset='utf-8';c.src='https://rec.smartlook.com/recorder.js';h.appendChild(c);})(document);smartlook('init', '0f063fb33b5fd0506bb94fdeb193b421c7e957d1');window.smartlook('identify', ";
    smartlook.innerHTML += store.state.authentication.user.id;
    smartlook.innerHTML += ", { 'name': '";
    smartlook.innerHTML += store.state.authentication.user.name;
    smartlook.innerHTML += "','email': '";
    smartlook.innerHTML += store.state.authentication.user.email;
    smartlook.innerHTML += "'});smartlook('consentForms', 'true');smartlook('consentAPI', 'true');smartlook('consentIP', 'true');";
    document.body.appendChild(smartlook);
  }

  /*let pipedrive = document.createElement('script');
  pipedrive.setAttribute('type','text/javascript');
  pipedrive.innerHTML = "window.pipedriveLeadboosterConfig = {base: 'leadbooster-chat.pipedrive.com',companyId: 4741240,playbookUuid: '4d6b349d-1b0e-47e0-b306-e9504054b496',version: 2};(function () {var w = window;if (w.LeadBooster) {console.warn('LeadBooster already exists');} else {w.LeadBooster = {q: [],on: function (n, h) {this.q.push({ t: 'o', n: n, h: h });},trigger: function (n) {this.q.push({ t: 't', n: n });},};}})();";
  document.body.appendChild(pipedrive);
	
  let pipedriveSr = document.createElement('script');
  pipedriveSr.src = "https://leadbooster-chat.pipedrive.com/assets/loader.js";
  document.body.appendChild(pipedriveSr);*/

  if (store.state.authentication.user != null) {
    let crisp = document.createElement('script')
    crisp.setAttribute('type', 'text/javascript');
    crisp.innerHTML = "	window.$crisp=[]; ";
    crisp.innerHTML += " $crisp.push(['set', 'user:email', '";
    crisp.innerHTML += store.state.authentication.user.email;
    crisp.innerHTML += "']);";
    crisp.innerHTML += " $crisp.push(['set', 'user:nickname', '";
    crisp.innerHTML += capitalizeFirstLetter(store.state.authentication.user.name);
    crisp.innerHTML += "']);";
    crisp.innerHTML += " $crisp.push(['set', 'user:phone', '";
    crisp.innerHTML += store.state.authentication.user.phone;
    crisp.innerHTML += "']);";
    crisp.innerHTML += " $crisp.push(['set', 'session:data', [['oliver_id','";
    crisp.innerHTML += store.state.authentication.user.id;
    crisp.innerHTML += "']]]);";
    crisp.innerHTML += " $crisp.push(['set', 'session:event', [[['user_welcome', { event: 'event' }, 'red']]]]);";
    crisp.innerHTML += " window.CRISP_WEBSITE_ID='ce538b85-b022-4f10-8a24-a333dd98c3c2';(function(){d=document;s=d.createElement('script');s.src='https://client.crisp.chat/l.js';s.async=1;d.getElementsByTagName('head')[0].appendChild(s);})();";
    document.body.appendChild(crisp);
  }
}

new Vue({
  router,
  store,
  i18n,
  beforeMount() {
    window.addEventListener("load", this.onLoad);
    window.addEventListener("beforeunload", this.onUnload);
  },
  beforeDestroy() {
    window.removeEventListener("load", this.onLoad);
    window.removeEventListener("beforeunload", this.onUnload);
  },
  methods: {
    onLoad(event) {
    },
    onUnload(event) {
      if (store.state.authentication.user != undefined) {
        window.localStorage.setItem("xkhx$$", btoa(unescape(encodeURIComponent(JSON.stringify(store.state.authentication)))));
      }
    }
  },

  render: h => h(App),
}).$mount('#app')