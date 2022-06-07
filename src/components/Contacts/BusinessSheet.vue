<template>
    <div class="business-sheet">
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
                            <div class="card business rounded">
                                <div class="card-top rounded-top">
                                </div>
                                <div class="card-body pxmax-4">
                                    <div class="wrapper-img-business" >
                                        <div class="content-img-business ">
                                        <img src="@/assets/images/realstate.png" class=" img-business"  alt="business image">
                                        </div>
                                     </div>
                                     <h3>{{business.name}}</h3>
                                     <div class="d-flex align-items-center mr-2 my-2">  
                                        <p class="mr-3">{{business.alias}} </p>
                                        <StarRating :grade="4" :maxStars="5" ></StarRating>
                                        <a href="#"><small class="ml-2 font-weight-bolder text-decoration">See reviews</small></a>
                                      </div>
                                     <div>
                                         <span class="badge"  :class="statusBadge(business.employers)">{{business.employers + ' Employers'}}</span>
                                         <span class="ml-2 badge"  :class="statusBadge(business.category_name)">{{business.category_name }}</span>
                                     </div>
                                     
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4 contact-information-business">
                        <div class="col-12">
                             <h5>
                                {{ $t('lang.label.contactinfo') }}
                            </h5>
                        </div>
                        <div class="col-6">
                           
                            <div class="card p-4 mt-4">
                                <div class="px-4 h-100 d-block">
                                    <ul class="h-100 d-flex flex-column justify-content-around">
                                         <li class="my-2">
                                            <i class="icon-phone mr-3"></i>
                                            <span class="">{{contactInformation.phone}}</span>
                                        </li>
                                        <li class="my-2">
                                            <i class="icon-room mr-3"></i>
                                            <span>{{contactInformation.address}}</span>
                                        </li>
                                         <li class="my-2">
                                            <i class="icon-markunread mr-3"></i>
                                            <span class="">{{contactInformation.email}}</span>
                                        </li>
                                        <li class="my-2">
                                            <i class="icon-public mr-3"></i>
                                            <a href="#">
                                                <span class="">{{contactInformation.website}}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                           
                            <div class="card p-4 mt-4">
                                <div class="px-4 g-maps">
                                   <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2698.7586095024535!2d-0.5158324848797603!3d47.436150079173665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4807d7c303134e3b%3A0xe8991cbeb50e3043!2sChemin%20des%20Maisons%20Rouges%2C%2049130%20Les%20Ponts-de-C%C3%A9%2C%20Francia!5e0!3m2!1ses!2sar!4v1589827609285!5m2!1ses!2sar" width="" height="" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
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



                    <div class="row mt-4">
                        <div class="col-12">
                            <h5>
                             Financial and juridical information
                            </h5>
                            <div class="card collegues mt-4 p-2">
                                <div class="p-4">
                                    <h6 class="mt-4 pb-2">About the establishment</h6>
                                    <table class="table table-bordered mb-4">
                                        <tbody>
                                            <tr>
                                                <th scope="row">SIRET</th>
                                                <td>53517063300015</td>                                           
                                                </tr>
                                                <tr>
                                                <th scope="row">NAF Code</th>
                                                <td>4399C</td>
                                                </tr>
                                                <tr>
                                                <th scope="row">Number of employees</th>
                                                <td>1 2 Employees</td>
                                                 </tr>
                                                 <tr>
                                                <th scope="row">Company typology</th>
                                                <td>Corporate Office</td>
                                                </tr>
                                           
                                        </tbody>
                                        </table>
                                         <h6 class="mt-4 pt-2 ">About the company</h6>
                                        <table class="table table-bordered mt-3">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">SIREN</th>
                                                    <td>535170633</td>                                           
                                                    </tr>
                                                    <tr>
                                                    <th scope="row">Headquarters</th>
                                                    <td>4 r Ste Marguerite, 97490 Saint Denis</td>
                                                    </tr>
                                                    <tr>
                                                    <th scope="row">Juridical Status</th>
                                                    <td>SARL unipersonnelle</td>
                                                    </tr>
                                                    <tr>
                                                    <th scope="row">Creation date</th>
                                                    <td>01/10/2011</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Number of employees</th>
                                                        <td>1 2 Employees</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Other names</th>
                                                        <td> --- </td>
                                                    </tr>
                                                 
                                            
                                            </tbody>
                                        </table>

                                </div>
                            </div>
                        </div>
                    </div>

                     <div class="row mt-4">
                        <div class="col-12">
                            <h5>
                            Notice 
                            </h5>
                            <div class="card collegues mt-4">
                                <div class="">
                                    <ul class="list-collegues">
                                        <li  v-for="(notice ,key) in notices" :key="key" class=" p-4">
                                           <div class="d-flex align-items-center">
                                               <div class="collegues-img mr-3">
                                                   <img src="@/assets/images/emptyperson.png" class="rounded-circle img-collegue"  alt="person image">
                                               </div>
                                                <div>
                                                    <strong>{{notice.name}}</strong>
                                                    <div>
                                                         <StarRating :grade="4" :maxStars="5" ></StarRating>
                                                    </div>
                                                    <div>
                                                        <small>{{notice.comment}}</small>
                                                    </div>
                                                </div>
                                                
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
import StarRating from "@/components/StarRating.vue";
export default {
     mixins: [statusBadgeMixin,statusPointMixin],
    components: {
    StarRating,
  },
     data(){
         return{
             business:{
                 name:'Super Immo Concept 54',
                 alias:'Real Estate Agency',
                 category_name:'Real Estate',
                 raing:'4.6',
                 reviews:'399',
                 employers:'1-50'
             },
             contactInformation:{
                address:'43 Rue Du Mont Saint George, Saint Francois',
                phone:'01 68 75 95 60',
                email:'concept@immo.fr',
                website:'www.immmoconcept.fr'
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
             ],
             notices:[{
                 name:'Camilla Corbello',
                 score:'4.8',
                 comment:'Very good, the service here is amazing'
             },{ name:'Camilla Corbello',
                 score:'4.8',
                 comment:'Very good, the service here is amazing'},
                 { name:'Camilla Corbello',
                 score:'4.8',
                 comment:'Very good, the service here is amazing'},
                 { name:'Camilla Corbello',
                 score:'4.8',
                 comment:'Very good, the service here is amazing'},

                ],
         }
         
     }
}
</script>
<style>

</style>

