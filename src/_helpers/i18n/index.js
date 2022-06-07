import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './locale/en_US'
import es from './locale/es_ES'
import fr from './locale/fr_FR'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en',
  messages: {
    fr: {
      lang: fr
    },
    en: {
      lang: en
    },
    es: {
      lang: es
    },
   
  }
})