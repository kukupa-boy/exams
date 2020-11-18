import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhcnLocal from './zhcn.js'
import zhuyLocal from './zhuy.js'

Vue.use(VueI18n)

const messages = {
	zhcn: {
	  ...zhcnLocal
	},
	zhuy: {
	  ...zhuyLocal
	}
}

const i18n = new VueI18n({  
  locale: 'zhcn',
  messages: messages
})

export default i18n