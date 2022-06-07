import Vue from 'vue'
import Vuex from 'vuex'

import { authentication } from './authentication.module';
import { clients } from './clients.module';
import { alert } from './alert.module';
import { opportunities } from './opportunities.module';
import { businesses } from './businesses.module';
import { companies } from './companies.module';
import { emails } from './emails.module';
import { campaigns } from './campaigns.module';
import { header } from './header.module';
import { websites } from './websites.module';
import { sidebar } from './sidebar.module';
import { billings } from './billings.module';
import { contacts } from './contacts.module';
import { contactscsv } from './contactscsv.module';
import { users } from './users.module';
import { optionsList } from './optionsList.module';
import { headertopbar } from './headertopbar.module';
import { plans } from './plans.module';


Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    authentication,
    alert,
    opportunities,
    clients,
    emails,
    businesses,
    companies,
    campaigns,
    header,
    websites,
    sidebar,
    billings,
    contacts,
    contactscsv,
    users,
    optionsList,
    headertopbar, 
    plans
  },
})
