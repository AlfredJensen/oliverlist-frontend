<template>
    <div class="person-sheet">
       <main class="">
            <ol class="breadcrumb">
            <li class="breadcrumb-item cursor-pointer">{{ $t('lang.label.olivercontacts') }}</li>
            <li class="breadcrumb-item active">{{ $t('lang.label.olivercompanies') }}</li>
            </ol>
           <div class="contenedor">
                <!-- <LoadingSpinner v-if="loading" /> -->
                <!-- <div class="contentCenter all" v-if="!loading"> -->
                <div class="contentCenter all">
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex justify-content-end">
                            <button class="btn btn-secondary btn-sm
                             themed-button ">
                             <i class="icon-navigate_before"></i>
                                 back 
                            </button>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <div class="card person rounded">
                                <div class="card-top rounded-top">
                                </div>
                                <div class="card-body pxmax-4">
                                    <div class="wrapper-img-person" >
                                        <img src="@/assets/images/emptyperson.png" class="rounded-circle img-profile"  alt="person image">
                                     </div>
                                     <h3>{{person.firstname+' '+person.lastname}}</h3>
                                     <p>{{person.job}} </p>
                                     <div>
                                         <span class="badge"  :class="statusBadge(person.role)">{{person.role}}</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <h5>
                                {{ $t('lang.label.contactinfo') }}
                            </h5>
                            <div class="card p-4 mt-4">
                                <div class="px-4">
                                    <ul>
                                        <li class="my-4">
                                            <i class="icon-building-o mr-3"></i>
                                            <span class="font-weight-bold">{{contactInformation.enterprise}}</span>
                                            <span class="ml-4">
                                                <a href="#" class="btn btn-secundary themed-button"><i class="icon-search" ></i></a>
                                            </span>
                                        </li>
                                         <li class="my-4">
                                            <i class="icon-phone mr-3"></i>
                                            <span class="">{{contactInformation.phone}}</span>
                                        </li>
                                         <li class="my-4">
                                            <i class="icon-mail_outline mr-3"></i>
                                            <span class="">{{contactInformation.email}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <h5>
                               {{ $t('lang.label.linkedopportunities') }}
                            </h5>
                            <div class="card opportunities-linked mt-4">
                                <div class="">
                                    <ul class="">
                                        <li  v-for="(opp ,key) in opp_linked" :key="key" class="p-4">
                                            <span class="font-weight-bold">{{opp.opp_name}}</span>
                                            <span class="ml-4">
                                                <a href="#" class="btn btn-secundary themed-button"><i class="icon-search"></i></a>
                                            </span>
                                             <div class="my-2">
                                                <span class="mr-3">Status: </span>
                                                <span class="badge" :class="statusBadge(opp.status)">{{opp.status}}</span>
                                            </div>
                                            <div class="my-2">
                                                <span class="mr-3">Last Activity: </span>
                                                <span>{{opp.last_activity}}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!--end contentCenter -->
           </div>
       </main>
    </div>
</template>
<script>
import { statusBadgeMixin,statusPointMixin } from "@/_mixins/";
export default {
     mixins: [statusBadgeMixin,statusPointMixin],
     data(){
         return{
             person:{
                     firstname:'Alexandre',
                     lastname:'Batista',
                     job:'Responsable Developement commercial chez Immo Concept 54 ',
                     role:'Sales',
             },
             contactInformation:{
                enterprise:'Immo Concept 54',
                phone:'01 68 75 95 60',
                email:'concept@immo.fr'
             },
             opp_linked:[{
                 opp_name:'Opportunité Website Immo Concept 54',
                 status:'positive',
                 last_activity:'24.04.2020'
             },{ opp_name:'Opportunité Website Immo Concept 54',
                 status:'negative',
                 last_activity:'24.04.2020'}
                ],
             collegues:[
                {
                 name:'Camilla Corbello',
                 job:'Responsable Gestion at Immo 54',
                 role:'Administration',
             },{
                 name:'Fabianne Blot',
                 job:'Responsable Gestion at Immo 54',
                 role:'Operations',}
             ]
         }
     }
}
</script>

