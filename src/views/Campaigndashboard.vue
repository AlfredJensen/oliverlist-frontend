<template>
  <section class="campaign">
  <main class="main  animated fadeIn faster">
    <LoadingSpinner v-if="loading" />
    <div class="view-dashboard" v-if="!loading">
      <ol class="breadcrumb">
        <li class="breadcrumb-item cursor-pointer" @click="changeTab('ALL')">{{ $t('lang.label.allcampaigns') }}</li>
        <li class="breadcrumb-item active">Campaign Name</li>
      </ol>
    <div class="contenedor animated fadeIn faster">
      <button class="btn btn-primary float-right">{{ $t('lang.button.editcampaign') }}</button>
    </div>
      <section class="five-step-company">
        <div class="styles-steps pb-4">
          <div class="contenedor">
            <div class="row ">
              <div class="col-sm-12 ">
                <div class="">
                  <h2 class="font-dark-blue my-3"></h2>
                  <div class="card ">
                   <div class="p-4 card-title-article">
                    <h5>{{ $t('lang.label.parameters') }}</h5>
                    <ul>
                      <li class="my-2">
                        <span>{{ $t('lang.label.name') }} :</span>
                        <span class="ml-2"></span>
                      </li>
                      <li class="my-2">
                        <span>{{ $t('lang.label.demourl') }} :</span>
                        <span class="ml-2"></span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="card mt-2">
                  <div class="p-4 card-title-article">
                    <li class="my-2">
                      <h5>{{ $t('lang.label.audience') }}</h5>
                      <h6 class="mt-4">{{ $t('lang.label.target') }}</h6>
                      <div class="row mt-2">
                        <div class="col-12">
                          <span>{{ $t('lang.label.location') }} : </span>
                            <div class="row mt-2 mb-2">
                              <div class="col-12">
                                <span class="badge mr-2 px-3" :class="statusBadge('theme')"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <span>{{ $t('lang.label.companysize') }} : </span>
                            <span  class="badge mr-2 px-3" :class="statusBadge('theme')">All options</span>
                            <span  class="badge mr-2 px-3" :class="statusBadge('theme')"></span>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <span>{{ $t('lang.label.industry') }} : </span>
                            <div class="row mt-2">
                              <div class="col-12">
                                <span class="badge mr-2 px-3" :class="statusBadge('theme')"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h6 class="mt-4">{{ $t('lang.label.decisionmakers') }}</h6>
                        <div class="row">
                          <div class="col-12">
                            <span>{{ $t('lang.label.department') }} : </span>
                            <span class="badge mr-2 px-3" :class="statusBadge('theme')">All options</span>
                            <span class="badge mr-2 px-3" :class="statusBadge('theme')"></span>
                          </div>
                        </div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
      <div class="contenedor animated fadeIn faster">
        <h2 class="title py-2" >{{ $t('lang.label.activity') }}</h2>
      <div class="row">
        <div class="col-12">
          <div class="card widget-inline">
            <div class="card-body p-0">
              <div class="row no-gutters">
                <div class="col-sm-6 col-xl-3">
                  <div class="card shadow-none m-0">
                    <div class="card-body text-center">
                      <i class="icon-flag text-muted" style="font-size: 24px;"></i>
                      <h3><span>340</span></h3>
                      <p class="text-muted mb-0">{{ $t('lang.label.engagedcompanies') }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-xl-3">
                  <div class="card shadow-none m-0 border-left">
                    <div class="card-body text-center">
                      <i class="icon-users text-muted" style="font-size: 24px;"></i>
                      <h3>715</h3>
                      <p class="text-muted mb-0">{{ $t('lang.label.engagedpeople') }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-xl-3">
                  <div class="card shadow-none m-0 border-left">
                    <div class="card-body text-center">
                      <i class="icon-desktop text-muted" style="font-size: 24px;"></i>
                      <h3><span>31</span></h3>
                      <p class="text-muted mb-0">{{ $t('lang.label.clicks') }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-xl-3">
                  <div class="card shadow-none m-0 border-left">
                    <div class="card-body text-center">
                      <i class="icon-phone text-muted" style="font-size: 24px;"></i>
                      <h3><span>22</span> <i class="mdi mdi-arrow-up text-success"></i></h3>
                      <p class="text-muted mb-0">{{ $t('lang.label.engagements') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <div class="row mt-4">
          <div class="col-md-12">
            <div class="content-chart" >
              <div class="card no-border">
                <LoadingSpinner v-if="loadingChart" />
                <div  v-if="!loadingChart">
                  <line-chart :width="300" :height="100"  :chart-data="multiaxis" :options="multiaxis.options" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-8">
            <div class="card py-2 px-3 no-border mb-auto">
              <h5 class="title py-2 text-center" >{{ $t('lang.label.topopportunities') }}</h5>
              <div class="table">
                <table class="table table-striped table-sm table-nowrap table-centered mb-0">
                  <thead>
                    <tr>
                      <th>{{ $t('lang.label.opportunity') }}</th>
                      <th>Score</th>
                      <th>{{ $t('lang.label.clicks') }}</th>
                      <th>{{ $t('lang.label.engagements') }}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">Mazar</h6>
                            <span class="text-muted font-13">Industry</span>
                        </td>
                        <td>187</td>
                        <td>154</td>
                        <td>49</td>
                        <td class="table-action">
                            <a href="/" class="icon-search"> <i class="mdi mdi-eye"></i></a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">EDF</h6>
                            <span class="text-muted font-13">Industry</span>
                        </td>
                        <td>235</td>
                        <td>127</td>
                        <td>83</td>
                        <td class="table-action">
                            <a href="/" class="icon-search"> <i class="mdi mdi-eye"></i></a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">Orange</h6>
                            <span class="text-muted font-13">Industry</span>
                        </td>
                        <td>365</td>
                        <td>148</td>
                        <td>62</td>
                        <td class="table-action">
                            <a href="/" class="icon-search"> <i class="mdi mdi-eye"></i></a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">Afflelou</h6>
                            <span class="text-muted font-13">Industry</span>
                        </td>
                        <td>753</td>
                        <td>159</td>
                        <td>258</td>
                        <td class="table-action">
                            <a href="/" class="icon-search"> <i class="mdi mdi-eye"></i></a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">BND Kapital</h6>
                            <span class="text-muted font-13">Industry</span>
                        </td>
                        <td>458</td>
                        <td>126</td>
                        <td>73</td>
                        <td class="table-action">
                            <a href="/" class="icon-search"> <i class="mdi mdi-eye"></i></a>
                        </td>
                    </tr>
                  </tbody>
                </table>
              </div>                         
            </div>
          </div>
          <div class="col-md-4">
            <div class="card py-2 px-3 no-border mb-auto">
                <h5 class="title py-2 text-center" >{{ $t('lang.label.newleads') }}</h5>

                <div class="media">
                    <img class="mr-3 bg-dark float-left rounded-circle" src="https://static-exp1.licdn.com/sc/p/com.linkedin.public-profile-frontend%3Apublic-profile-frontend-static-content%2B0.2.408/f/%2Fpublic-profile-frontend%2Fartdeco%2Fstatic%2Fimages%2Fghost-images%2Fperson.svg" width="40" height="40" alt="Generic placeholder image">
                    <div class="media-body">
                        <span class="badge badge-primary float-right">General Management</span>
                        <h6 class="mt-0 mb-1">Risa Pearson</h6>
                        <small class="font-13">richard.john@mail.com</small>
                    </div>
                </div>

                <div class="media mt-3">
                    <img class="mr-3 bg-dark float-left rounded-circle" src="https://static-exp1.licdn.com/sc/p/com.linkedin.public-profile-frontend%3Apublic-profile-frontend-static-content%2B0.2.408/f/%2Fpublic-profile-frontend%2Fartdeco%2Fstatic%2Fimages%2Fghost-images%2Fperson.svg" width="40" height="40" alt="Generic placeholder image">
                    <div class="media-body">
                        <span class="badge badgeTable-lpink float-right">Services Direction</span>
                        <h6 class="mt-0 mb-1">Margaret D. Evans</h6>
                        <small class="font-13">margaret.evans@rhyta.com</small>
                    </div>
                </div>

                <div class="media mt-3">
                    <img class="mr-3 bg-dark float-left rounded-circle" src="https://static-exp1.licdn.com/sc/p/com.linkedin.public-profile-frontend%3Apublic-profile-frontend-static-content%2B0.2.408/f/%2Fpublic-profile-frontend%2Fartdeco%2Fstatic%2Fimages%2Fghost-images%2Fperson.svg" width="40" height="40" alt="Generic placeholder image">
                    <div class="media-body">
                        <span class="badge badgeQualifier float-right">Owner</span>
                        <h6 class="mt-0 mb-1">Bryan J. Luellen</h6>
                        <small class="font-13">bryuellen@dayrep.com</small>
                    </div>
                </div>

                <div class="media mt-3">
                    <img class="mr-3 bg-dark float-left rounded-circle" src="https://static-exp1.licdn.com/sc/p/com.linkedin.public-profile-frontend%3Apublic-profile-frontend-static-content%2B0.2.408/f/%2Fpublic-profile-frontend%2Fartdeco%2Fstatic%2Fimages%2Fghost-images%2Fperson.svg" width="40" height="40" alt="Generic placeholder image">
                    <div class="media-body">
                        <span class="badge badge-primary float-right">General Management</span>
                        <h6 class="mt-0 mb-1">Kathryn S. Collier</h6>
                        <small class="font-13">collier@jourrapide.com</small>
                    </div>
                </div>

                <div class="media mt-3">
                    <img class="mr-3 bg-dark float-left rounded-circle" src="https://static-exp1.licdn.com/sc/p/com.linkedin.public-profile-frontend%3Apublic-profile-frontend-static-content%2B0.2.408/f/%2Fpublic-profile-frontend%2Fartdeco%2Fstatic%2Fimages%2Fghost-images%2Fperson.svg" width="40" height="40" alt="Generic placeholder image">
                    <div class="media-body">
                        <span class="badge badge-primary float-right">General Management</span>
                        <h6 class="mt-0 mb-1">Timothy Kauper</h6>
                        <small class="font-13">thykauper@rhyta.com</small>
                    </div>
                </div>

                <div class="media mt-3">
                    <img class="mr-3 bg-dark float-left rounded-circle" src="https://static-exp1.licdn.com/sc/p/com.linkedin.public-profile-frontend%3Apublic-profile-frontend-static-content%2B0.2.408/f/%2Fpublic-profile-frontend%2Fartdeco%2Fstatic%2Fimages%2Fghost-images%2Fperson.svg" width="40" height="40" alt="Generic placeholder image">
                    <div class="media-body">
                        <span class="badge badgeQualifier float-right">Owner</span>
                        <h6 class="mt-0 mb-1">Zara Raws</h6>
                        <small class="font-13">austin@dayrep.com</small>
                    </div>
                </div>
                   
            </div>
          </div>
        </div>
      </div>
      <div class="contenedor animated fadeIn faster">

          <h2 class="title py-2" >{{ $t('lang.label.interestlevels') }}</h2>
        <div class="row mt-2">
          <div class="col-md-6">
            <div class="content-chart" >
              <div class="card no-border">
                <LoadingSpinner v-if="loadingChart" />
                <div  v-if="!loadingChart">
                  <h5 class="title py-2 text-center" >{{ $t('lang.label.companysize') }}</h5>
                  <radar-chart class="py-2"  :chartdata="companysize" :options="companysize.options" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="content-chart" >
              <div class="card no-border">
                <LoadingSpinner v-if="loadingChart" />
                <div  v-if="!loadingChart">
                  <h5 class="title py-2 text-center" >{{ $t('lang.label.industry') }}</h5>
                  <radar-chart class="py-2"  :chartdata="industry" :options="companysize.industry" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-6">
            <div class="content-chart" >
              <div class="card no-border">
                <LoadingSpinner v-if="loadingChart" />
                <div  v-if="!loadingChart">
                  <h5 class="title py-2 text-center" >{{ $t('lang.label.hierarchicallevel') }}</h5>
                  <radar-chart class="py-2"  :chartdata="hierarchicallevel" :options="hierarchicallevel.options" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="content-chart" >
              <div class="card no-border">
                <LoadingSpinner v-if="loadingChart" />
                <div  v-if="!loadingChart">
                  <h5 class="title py-2 text-center" >{{ $t('lang.label.area') }}</h5>
                  <radar-chart class="py-2"  :chartdata="area" :options="area.options" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contenedor animated fadeIn faster">
        <h2 class="title py-2" >{{ $t('lang.label.websiteactivity') }}</h2>
        <div class="row mt-2">
          
          <div class="col-md-4">
            <div class="card py-2 px-3 no-border mb-auto">
              <h5 class="title py-2 text-center" >{{ $t('lang.label.topurl') }}</h5>
              <div class="table">
                <table class="table table-striped table-sm table-nowrap table-centered mb-0">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>{{ $t('lang.label.clicks') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">/home</h6>
                        </td>
                        <td>443</td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">/contact</h6>
                        </td>
                        <td>345</td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">/products</h6>
                        </td>
                        <td>134</td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">/who-we-are</h6>
                        </td>
                        <td>65</td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">/example</h6>
                        </td>
                        <td>45</td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="font-15 mb-1 font-weight-normal">/policy</h6>
                        </td>
                        <td>23</td>
                    </tr>  
                  </tbody>
                </table>
              </div>                         
            </div>
          </div>
          <div class="col-md-4">
            <div class="content-chart" >
              <div class="card no-border">
                <LoadingSpinner v-if="loadingChart" />
                <div  v-if="!loadingChart">
                  <h5 class="title py-2 text-center" >{{ $t('lang.label.sessionquantity') }}</h5>
                  <doughnut-chart class="py-2"  :chartdata="sessionquantity" :options="sessionquantity.options" />
                </div>
              </div>
            </div>
          </div>          <div class="col-md-4">
            <div class="content-chart" >
              <div class="card no-border">
                <LoadingSpinner v-if="loadingChart" />
                <div  v-if="!loadingChart">
                  <h5 class="title py-2 text-center" >{{ $t('lang.label.sessionsduration') }}</h5>
                  <doughnut-chart class="py-2"  :chartdata="timesessions" :options="timesessions.options" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
        </div>
      </div>
    </div>
    
    </main>
  </section>
</template>
<script>
import { statusBadgeMixin,statusPointMixin } from "@/_mixins/";
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import moment from "moment";
import LineChart from '@/components/Chart.vue';
import BubbleChart from '@/components/BubbleChart.vue';
import DoughnutChart from '@/components/DoughnutChart.vue';
import RadarChart from '@/components/RadarChart.vue';
import BarChart from '@/components/BarChart.vue';
import { opportunitiesService, usersService, campaignsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  data () {
    return {
      currentPage: 1,
      cantPerPage: 10,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      searchFilter: "",
      day:'',
      date:'',
      datePickerConfig: {
        format: "DD-MM-YYYY",
        useCurrent: false,
        minDate: moment().startOf("day")
      },
      period:{
        dateStar:'',
        dateEnd:''
      },

      chartdata: {
        labels:'',
        datasets: [{
          label: 'Clicks',
          type: 'line',
          fill:'false',
          pointBorderWidth:5,
          backgroundColor: '#36a2eb',
          borderColor: '#36a2eb',
          data:'',
        },{
          label: 'Engagements',
          type: 'line',
          fill:'false',
          pointBorderWidth:5,
          backgroundColor:'#ff6384',
          borderColor:'#ff6384',
          data:'',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        devicePixelRatio: 2,
          title: {
            display: true,
            text: 'Exemple'
        },
      },
      
      
      
      multiaxis: {
        labels:['1', '2', '3', '4', '5'],
        datasets: [{
          label: 'Label 1',
          borderColor: ['#ff6384'],
          backgroundColor: ['#ff6384'],
          yAxisID: 'y1',
          data: [100, 96, 84, 76, 69]
        }, {
          label: 'Label 2',
          borderColor: ['#ff6384'],
          backgroundColor: ['#ff6384'],
          yAxisID: 'y2',
          data: [2000, 2344, 3233, 2323, 4000]
        }]
      },
      options: {
        responsive: true,
        stacked: false,
        title: {
          display: true,
          text: 'Chart.js Line Chart - Multi Axis'
        },
        scales: {
          yAxes: [{
            id: 'y1',
            type: 'line',
            position: 'left',
          }, {
            id: 'y2',
            type: 'line',
            position: 'right',
            
          }]
        }
      },

      companysize: {
    labels: ['0 - 10', '10 - 30', '30 - 40', '40 - 50', '50 - 60', '60 - 70'],
    datasets: [{
        borderColor: ['#ff6384'],
        label: 'Tx Engagements',
        data: [20, 10, 4, 2, 0, 5]
      },{
        borderColor: ['#36a2eb'],
        label: 'Tx Clicks',
        data: [30, 13, 44, 22, 32, 12]
      }]

    },

    industry: {
    labels: ['Real Estate', 'Construction', 'Accounting', 'Industry'],
    datasets: [{
        borderColor: ['#ff6384'],
        label: 'Tx Engagements',
        data: [2, 5, 7, 12]
      },{
        borderColor: ['#36a2eb'],
        label: 'Tx Clicks',
        data: [22, 12, 67, 55]
      }]

    },

    hierarchicallevel: {
    labels: ['Owner', 'General Management', 'Services Direction'],
    datasets: [{
        borderColor: ['#ff6384'],
        label: 'Tx Engagements',
        data: [3, 10, 4]
      },{
        borderColor: ['#36a2eb'],
        label: 'Tx Clicks',
        data: [45, 13, 10]
      }]

    },
    area: {
    labels: ['Ile de France', 'Paca', 'Bretagne', 'Franche-Compté', 'Bourgogne', 'Nord'],
    datasets: [{
        borderColor: ['#ff6384'],
        label: 'Tx Engagements',
        data: [3,10, 4,3,10, 4]
      },{
        borderColor: ['#36a2eb'],
        label: 'Tx Clicks',
        data: [45, 13, 10, 13, 10,45]
      }]

    },


      timesessions: {
          datasets: [
                {
                  data: [10, 20, 40],
                  backgroundColor: ["#ff6384", "#ff9f40", "#4bc0c0"],
                  hoverBackgroundColor: ["#fbd2cd", "#fef5c9", "#d1e3f7"]
                }
              ],
              labels: ["0 - 2 min", "2 - 5 min", "+ 5 min"],
              option: {},
            },
      
      sessionquantity: {
          datasets: [
                {
                  data: [10, 20, 40, 70, 40, 20],
                  backgroundColor: ["#ffce56","#36a2eb","#185190","#ff6384", "#ff9f40"],
                  hoverBackgroundColor: ["#fbd2cd","#fef5c9","#d1e3f7","#fbd2cd", "#fef5c9"]
                }
              ],
              labels: ["1","2","3","4","5+"],
              option: {},
            },
          
        
    
        datacollection: {
          labels: ['Data'],
          datasets: [
            {
              label: 'Clicks',
              backgroundColor: '#f87979',
              pointBackgroundColor: 'white',
              borderWidth: 1,
              pointBorderColor: '#249EBF',
              data: [
                {
                  x: 100,
                  y: 62,
                  r: 25
                },
                {
                  x: 60,
                  y: 30,
                  r: 15
                },
                {
                  x: 40,
                  y: 60,
                  r: 5
                },
                {
                  x: 80,
                  y: 80,
                  r: 10
                },
                {
                  x: 20,
                  y: 30,
                  r: 25
                },
                {
                  x: 15,
                  y: 80,
                  r: 20
                }
              ]
            }
          ]
        },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                },
                legend: {
                    display: true
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return '$' + tooltipItems.yLabel;
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                height: 200

          },

          loadingChart:true,
        }
        
     
  },
  components: { 
    BubbleChart,
    RadarChart,
    BarChart,
    DoughnutChart,
    LineChart,
    LoadingSpinner,
  },

  mixins: [statusBadgeMixin,statusPointMixin],

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    ...mapState({
      loading: state => state.campaigns.loading,
      campaigns: state => state.campaigns.all.data
    }),
  },

  created() {
    this.day = this.getCurrentDay();
    this.date = this.getCurrentDate();
    this.getData();
    this.getCurrentClients();
  },
  
  methods:{
    ...mapActions("campaigns", {
      getAllCampaigns: "getAllByClientId"
    }),

    getData(){
      this.getDashboardData();
      this.getNotifications();
      this.searchCampaigns();
      
    },

    getDashboardData(){
      opportunitiesService.getDashboardData().then(result => {
        this.dashboardData = result;
        this.graphic();
      });
    },


    graphic(){
      this.chartdata.labels = this.dashboardData.labels;
      this.chartdata.datasets[0].data = this.dashboardData.clicksList;          
      this.chartdata.datasets[1].data = this.dashboardData.engagementsList;
      return this.loadingChart=false;
    },
    
    getCurrentClients(){
      opportunitiesService.getClients().then(result => {
        this.clients = result;
      });
    },

    getCurrentDay(){
      var d = new Date();
      var weekday = new Array(7);
      weekday[0] = this.$t('lang.label.sunday');
      weekday[1] = this.$t('lang.label.monday');
      weekday[2] = this.$t('lang.label.tuesday');
      weekday[3] = this.$t('lang.label.wednesday');
      weekday[4] = this.$t('lang.label.thursday');
      weekday[5] = this.$t('lang.label.friday');
      weekday[6] = this.$t('lang.label.saturday');
      return weekday[d.getDay()];
    },
    getCurrentDate(){
      var now  = new Date();
      var months    = [this.$t('lang.label.january'),this.$t('lang.label.frebruary'),this.$t('lang.label.march'),this.$t('lang.label.april'),this.$t('lang.label.may'),this.$t('lang.label.june'),this.$t('lang.label.july'),this.$t('lang.label.august'),this.$t('lang.label.september'),this.$t('lang.label.october'),this.$t('lang.label.november'),this.$t('lang.label.december')];
      var time = now.getUTCDate() +' ' + months[now.getMonth()] + ' '+  now.getFullYear();
      return time;
    },
    goToBilling(){
      router.push({
      name: "billing"
    });  
  }

  },
  
};
</script>
<style >
.card:hover.not-effect.not-shadow{
 box-shadow: none !important;
 -webkit-box-shadow: none !important;
}
</style>
