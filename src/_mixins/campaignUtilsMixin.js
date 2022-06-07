import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { emailsService } from "@/_services";

// Add the required rule
extend('required', {
  ...required,
  message: 'This field is required'
});

// Add a rule.
extend('token-validation', {
  validate: (value, [availableTokens]) => {

    availableTokens.forEach(token => {
      if (token.token != '[my_proposition]' && token.token != '[my_website_url_tracking]') {
        let tokenData = token.token;

        tokenData = tokenData.replace("[", "").replace("]", "");
        tokenData = "\\[" + tokenData + " default=\"[\\s\\w'À-ÿ\u00f1\u00d1]*\"\\]";

        const regexp = new RegExp(`${tokenData}`, "g");
        value = value.replace(regexp, "");
      }
    });

    if (value.includes("[") || value.includes("]")) {
      return false;
    }

    return true;
  },
  message: 'One or several tokens are misspelled'
});

extend('length-plain-text', {
  validate: (value, args) => {
    let regex = /(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g
    value = value.replace(regex, "");
    if (args[0].min != undefined && value.length < args[0].min) {
      return false;
    }
    if (args[0].max != undefined && value.length > args[0].max) {
      return false;
    }
    return true
  },
  message: (field, args, data) => {
    if (args[0].min != undefined) {
      return "Min length: " + args[0].min
    }
    if (args[0].max != undefined) {
      return "Max length: " + args[0].max
    }
  },
});

export const campaignUtilsMixin = {

  data() {
    return {
      testBusinessContactSelected: 0,
      testBusinessContact: [
        {
          '[prospect_last_name]': 'Duval',
          '[prospect_first_name]': 'Frédéric',
          '[prospect_city]': 'Montpellier',
          '[prospect_website_url]': 'https://abcconseil.fr/',
          '[prospect_company_name]': 'ABC Conseil',
          '[gender]': 'Mr',
          '[prospect_job_title]': 'CEO',
        }, {
          '[prospect_last_name]': 'Caral',
          '[prospect_first_name]': 'Céline',
          '[prospect_city]': 'Paris',
          '[prospect_website_url]': 'https://www.lvmh.fr/',
          '[prospect_company_name]': 'LVMH',
          '[gender]': 'Mme',
          '[prospect_job_title]': 'Directrice Marketing',
        }, {
          '[prospect_last_name]': 'Mary',
          '[prospect_first_name]': 'Pierre-Auguste',
          '[prospect_city]': 'Nantes',
          '[prospect_website_url]': 'https://www.generali.fr/',
          '[prospect_company_name]': 'Generali',
          '[gender]': 'Mr',
          '[prospect_job_title]': 'Chef de projet',
        }, {
          '[prospect_last_name]': 'Depradeux',
          '[prospect_first_name]': 'Erica',
          '[prospect_city]': 'Orléans',
          '[prospect_website_url]': 'https://www.avenirradio.com/',
          '[prospect_company_name]': 'Avenir Radio',
          '[gender]': 'Mme',
          '[prospect_job_title]': 'Présidente',
        }, {
          '[prospect_last_name]': 'Bansilhon',
          '[prospect_first_name]': 'Pierre',
          '[prospect_city]': 'Royan',
          '[prospect_website_url]': 'https://www.btsconstruction.com/',
          '[prospect_company_name]': 'BTS Construction',
          '[gender]': 'Mr',
          '[prospect_job_title]': 'Assistant de direction',
        }, {
          '[prospect_last_name]': 'Lemens',
          '[prospect_first_name]': 'Nicolas',
          '[prospect_city]': 'Bordeaux',
          '[prospect_website_url]': 'https://www.ayena.io/',
          '[prospect_company_name]': 'Ayena',
          '[gender]': 'Mr',
          '[prospect_job_title]': 'Founder',
        }, {
          '[prospect_last_name]': 'Chaumon',
          '[prospect_first_name]': 'Naik',
          '[prospect_city]': 'Marseille',
          '[prospect_website_url]': 'https://ncd.it/',
          '[prospect_company_name]': 'NCD Patrimoine',
          '[gender]': 'Mr',
          '[prospect_job_title]': 'Co-Founder',
        }, {
          '[prospect_last_name]': 'Minas',
          '[prospect_first_name]': 'Mathieu',
          '[prospect_city]': 'Toulon',
          '[prospect_website_url]': 'https://picky.com/',
          '[prospect_company_name]': 'Picky Spring',
          '[gender]': 'Mr',
          '[prospect_job_title]': 'PDG',
        },
      ],
    }
  },
  methods: {
    checkAvailableTokens: function (message) {
      let tokens = this.availableTokens;
      let i = 0;
      for (i = 0; i < tokens.length; i++) {
        let tokenData = tokens[i].token;

        tokenData = tokenData.replace('[', '\\[').replace(']', '\\]');
        const regexp = new RegExp(`${tokenData}`, 'g')
        message = message.replace(regexp, "");
      }
      if (message.includes("[") || message.includes("]")) {
        return false;
      }

      return true;
    },
    formatTokens: function (message) {
      let tokens = this.availableTokens;
      let i = 0;

      for (i = 0; i < tokens.length; i++) {
        let token = tokens[i].token;
        let tokenType = tokens[i].type;

        tokenData = token.replace("[", "").replace("]", "");
        tokenData = "\\[" + tokenData + "( default=\"[\\s\\w'À-ÿ\u00f1\u00d1]*\")?\\]";
        const regexp = new RegExp(`${tokenData}`, "g");
        message = message.replace(regexp, "<span class=\"token " + tokenType + "\">" + token + "</span>");
      }

      let tokenData = '[my_proposition]'.replace('[', '\\[').replace(']', '\\]');
      const regexp = new RegExp(`(${tokenData})`, 'g')

      if (this.model.campaign.tpl_first_step != undefined && this.model.campaign.tpl_first_step.service !== undefined && this.model.campaign.tpl_first_step.service !== '') {
        message = message.replace(regexp, this.model.campaign.tpl_first_step.service);
      }

      let contact = this.testBusinessContact[this.testBusinessContactSelected];
      if (this.model.campaign.demo_url !== undefined) {
        contact['[my_website_url_tracking]'] = this.model.campaign.demo_url;
      }
      if (this.currentUser.name !== undefined) {
        contact['[my_first_name]'] = this.model.campaign.conn_first_name != undefined ? this.model.campaign.conn_first_name : this.currentUser.name;
      }
      if (this.currentUser.lastname !== undefined) {
        contact['[my_last_name]'] = this.model.campaign.conn_last_name != undefined ? this.model.campaign.conn_last_name : this.currentUser.lastname;
      }
      if (this.currentUser.client_name !== undefined) {
        contact['[my_company_name]'] = this.currentUser.client_name;
      }

      for (const [key, value] of Object.entries(contact)) {
        let tokenData = key;
        tokenData = tokenData.replace('[', '\\[').replace(']', '\\]');
        const regexp = new RegExp(`(${tokenData})`, 'g')
        message = message.replace(regexp, value);
      }

      return message;
    },
    changeBusinessContactSelected($val) {
      let newSelected = this.testBusinessContactSelected + $val;
      let maxCant = this.testBusinessContact.length - 1;
      if (this.testBusinessContactSelected == 0 && $val == '-1') {
        this.testBusinessContactSelected = maxCant;
      } else if (newSelected > maxCant) {
        this.testBusinessContactSelected = 0;
      } else {
        this.testBusinessContactSelected = newSelected;
      }
    },

    formatForCKEditor: function (message) {
      if (message != '') {

        let matchesNewLine = false;
        let regexpNewLine = "((\n)+(\r)*)+";
        regexpNewLine = new RegExp(`${regexpNewLine}`, 'g')
        matchesNewLine = message.match(regexpNewLine)
        if (matchesNewLine) {
          message = message.replace(regexpNewLine, "</p><p></p><p>");
        }

        let matches = message.match(/\[(\w+)\]/g)
        // console.log(matches);
        if (matches) {

          matches.forEach((value, key, map) => {
            if (value != "[my_website_url_tracking]" && value != "[my_proposition]") {
              //console.log({value});
              //console.log({key});
              //console.log({map});
              let token = value.replace("[", "").replace("]", "");
              value = value.replace("[", "\\[")
              value = value.replace("]", "\\]")

              let regexp = "^((?:(?:.*?" + value + "){0}.*?))" + value;
              regexp = new RegExp(`${regexp}`, 'g')

              let aphId = "autoplaceholder_" + this.generateRandomId();
              let span = "<span class=\"autoplaceholder\" placeholder=\"" + token + "\" id=\"" + aphId + "\" customid=\"" + aphId + "\" name=\"\" defaultvalue=\"\">";
              let replace = "$1" + span + "[" + token + " default=\"\"]</span>"

              // console.log(message.match(regexp))
              message = message.replace(regexp, replace);
            }
          });
        }
        if (matchesNewLine) {
          message = "<p>" + message + "</p>";
        }
        // console.log("message___",message)
      }

      return message;
    },
    generateRandomId: function () {
      return Math.floor((Math.random() * 1000000) + 1 + Date.now());
    },
    sendTestEmail() {
      if (this.model.campaign.conn_activated != 1) {
        if (this.model.campaign.user_id == this.currentUser.id) {
          this.$swal({
            type: "warning",
            title: this.$t("lang.label.unlockyoursalesinboxadvanced"),
            text: this.$t("lang.label.youneedtosync2"),
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("lang.button.connectmyemail"),
            cancelButtonColor: "#d33a2c",
          }).then((result) => {
            if (result.value) {
              this.$router.push({
                path: "/settings-account?synchronisation=1",
              });
            }
          });
        } else {
          this.$swal({
            type: "warning",
            title: this.$t("lang.label.unlockyoursalesinboxadvanced"),
            text: this.$t("lang.label.youneedtosync3"),
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("lang.button.ok"),
            cancelButtonColor: "#d33a2c",
          })
        }
        return false;
      }
      this.sendingTestEmail = true;
      emailsService
        .sendTestEmail(
          this.model,
          this.testBusinessContact[this.testBusinessContactSelected]
        )
        .then(
          (result) => {
            this.sendingTestEmail = false;
            this.$swal({
              type: "success",
              text: this.$t("lang.label.emailwassentsuccessfully"),
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: this.$t("lang.button.ok"),
              cancelButtonColor: "#d33a2c",
            })
          },
          (error) => {
            this.request = false;
            //if(error.message == )
            this.$swal({
              type: "error",
              text: error.message,
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: this.$t("lang.button.ok"),
              cancelButtonColor: "#d33a2c",
            })
          }
        );
    },
    isParameterTF(param_id) {
      if (this.model.parameters_tf.indexOf(param_id) !== -1) {
        return true;
      }
      return false;
    },
    setParameterTF(param_id, value) {
      if (value) {
        if (this.model.parameters_tf.indexOf(param_id) === -1) {
          this.model.parameters_tf.push(param_id);
        }
      } else {
        if (this.model.parameters_tf.indexOf(param_id) !== -1) {
          this.model.parameters_tf.splice(
            this.model.parameters_tf.indexOf(param_id),
            1
          );
        }
      }
    },
  }
}