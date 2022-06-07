<template>
  <div class="wrapperNav">
    <nav
      id="main-navbar"
      class="navbar navbar-expand-lg"
      :class="isMenuCollapse ? 'collapseNav' : ''"
    >
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        ref="toggleMenu"
      >
        <span class="icon-more_horiz"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto d-flex flex-column">
          <img
            v-if="!isMenuCollapse"
            src="@/assets/images/logomenu.png"
            class="rounded mx-auto d-block mb-4 logooliver"
          />
          <img
            v-if="isMenuCollapse"
            src="@/assets/images/oliver.png"
            width="50px"
            class="rounded mx-auto d-block mb-4"
          />

          <div v-if="menu">
            <div v-for="(link, index) in menu">
              <router-link
                :to="link.linkTo"
                @mousedown.native="
                  checkPlan(index) ? mousedown(link.linkTo) : restrictedAccess()
                "
              >
                <li class="nav-item py-1 px-1 m-0" v-if="checkRol(index)">
                  <div
                    :class="isMenuCollapse ? 'text-center' : 'text-left'"
                    class="nav-link"
                  >
                    <div
                      class="d-inline"
                      :class="isMenuCollapse ? ' mx-auto' : ''"
                    >
                      <i :class="link.icon"></i>
                      <small
                        :class="isMenuCollapse ? ' ml-1' : 'pl-0'"
                        class=""
                        v-if="link.linkTo == '/opportunities'"
                      >
                        <transition enter-active-class="animated tada">
                          <span
                            v-show="
                              notifications > 0 &&
                              !(
                                user.team_role_id !== undefined &&
                                user.team_role_id == 3
                              )
                            "
                            enter-active-class="animated tada"
                            class="
                              minimize-linkedin
                              mr-1
                              position-absolute
                              float-right
                              btn btn-sm btn-primary
                            "
                          >
                            {{ notifications }}
                          </span>
                        </transition>
                      </small>
                    </div>
                    <span class="item-name ml-2">
                      <span class="title">{{ link.name }}</span>
                    </span>
                  </div>
                </li>
              </router-link>

              <span
                v-if="
                  minlink &&
                  link.linkTo == '/dashboard' &&
                  $route.fullPath !== '/mysearchs/mysearch' &&
                  $route.fullPath !== '/mysearchs'
                "
                @click="toggleMinLink()"
                class="
                  pb-4
                  align-center
                  position-absolute
                  p-1
                  notif
                  cursor-pointer
                  text-white
                "
              >
                <strong class="ease-in-out bg-primary pt-1 px-1 mb-2 rounded">
                  <i class="icon-plus"></i
                ></strong>
              </span>

              <span
                v-if="
                  minondemand &&
                  link.linkTo == '/dashboard' &&
                  $route.fullPath !== '/mysearchs/mysearch' &&
                  $route.fullPath !== '/mysearchs'
                "
                @click="toggleMinOndemand()"
                class="
                  pb-4
                  align-center
                  position-absolute
                  p-1
                  notif
                  cursor-pointer
                  text-white
                "
              >
                <strong class="ease-in-out bg-primary pt-1 px-1 mb-2 rounded">
                  <i class="icon-plus"></i
                ></strong>
              </span>
            </div>
            <div class="divider bg-white mt-3"></div>

            <router-link
              :to="'/checklist'"
              v-if="
                !((user.team_role_id !== undefined && user.team_role_id == 3) || user.role_id == 4)
              "
              @mousedown.native="mousedown('/checklist')"
            >
              <li class="nav-item py-1 px-1 m-0">
                <div class="nav-link text-left" href>
                  <div
                    class="d-inline"
                    :class="isMenuCollapse ? ' mx-auto' : ''"
                  >
                    <i class="icon-checkmark"></i>
                  </div>
                  <span class="item-name ml-2">
                    <span class="title">{{ $t("lang.checklist.link") }} </span>
                    <span
                      v-if="this.$store.state.authentication.checklist > 0"
                      class="
                        minimize-linkedin
                        mr-1
                        position-absolute
                        float-right
                        btn btn-sm btn-primary
                      "
                    >
                      {{ this.$store.state.authentication.checklist }}
                    </span>
                  </span>
                </div>
              </li>
            </router-link>

            <router-link
              v-if="
                !(
                  user.team_role_id !== undefined &&
                  user.team_role_id == 3 &&
                  user.role_id != 4
                )
              "
              :to="'/settings-account'"
              @mousedown.native="mousedown('/settings-account')"
            >
              <li class="nav-item py-1 px-1 m-0">
                <div class="nav-link text-left" href>
                  <div
                    class="d-inline"
                    :class="isMenuCollapse ? ' mx-auto' : ''"
                  >
                    <i class="icon-gear"></i>
                  </div>
                  <span class="item-name ml-2">
                    <span class="title">{{ $t("lang.button.settings") }}</span>
                  </span>
                </div>
              </li>
            </router-link>

            <a
              v-if="
                !((user.team_role_id !== undefined && user.team_role_id == 3) || user.role_id == 4)
              "
              target="_blank"
              href="https://help.oliverlist.com/"
            >
              <li class="nav-item py-1 px-1 m-0">
                <div class="nav-link text-left" href>
                  <div
                    class="d-inline"
                    :class="isMenuCollapse ? ' mx-auto' : ''"
                  >
                    <i class="icon-question"></i>
                  </div>
                  <span class="item-name ml-2">
                    <span class="title">{{ $t("lang.button.help") }}</span>
                  </span>
                </div>
              </li>
            </a>

            <router-link :to="'/login'">
              <li class="nav-item py-1 px-1 m-0">
                <div class="nav-link text-left" href>
                  <div
                    class="d-inline"
                    :class="isMenuCollapse ? ' mx-auto' : ''"
                  >
                    <i class="icon-sign-out"></i>
                  </div>
                  <span class="item-name ml-2">
                    <span class="title">{{ $t("lang.button.logout") }}</span>
                  </span>
                </div>
              </li>
            </router-link>
          </div>
        </ul>
      </div>

      <span
        v-if="isMenuCollapse"
        class="btn-toggleCollapse cursor-pointer bg-primary pt-1"
        @click="CollapseNav"
      >
        <i class="icon-navigate_next"></i
      ></span>

      <span
        v-if="!isMenuCollapse"
        class="btn-toggleCollapse cursor-pointer bg-primary pt-1"
        @click="CollapseNav"
      >
        <i class="icon-navigate_before"></i
      ></span>
    </nav>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { tabsMixin } from "@/_mixins/";
import jQuery from "jquery";
let $ = jQuery;

export default {
  created() {
    this.CollapseNavOpen();
  },
  data() {
    return {
      avatar: null,
      keyLinkedin: 1,
      minlink: false,
      stopondemand: false,
      minondemand: false,
      menu: [
        {
          name: this.$t("lang.menu.dashboard"),
          linkTo: "/dashboard",
          event: "mousedown('/dashboard')",
          icon: "icon-dashboard",
          roles: [1,2,3,4],
          team_roles: [1,2],
        },
        {
          name: this.$t("lang.search.mysearchs"),
          linkTo: "/mysearchs",
          event: "mousedown('/mysearchs')",
          icon: "icon-search",
          roles: [1,2,3],
          team_roles: [1,2],
          afterTrialPeriodAvailable: false,
        },
        {
          name: this.$t("lang.mycontacts.mycontacts"),
          linkTo: "/businesses",
          event: "mousedown('/businesses')",
          icon: "icon-users",
          roles: [1,2,3],
          team_roles: [1,2],
          afterTrialPeriodAvailable: false,
        },
        {
          name: this.$t("lang.menu.campaigns"),
          linkTo: "/campaigns",
          event: "mousedown('/campaigns')",
          icon: "icon-bullhorn",
          roles: [1,2,3],
          team_roles: [1,2],
          afterTrialPeriodAvailable: false,
        },
        {
          name: this.$t("lang.menu.opportunities"),
          linkTo: "/opportunities",
          event: "mousedown('/opportunities')",
          icon: "icon-headset_mic",
          roles: [1,2,3,4],
          team_roles: [1,2,3],
          afterTrialPeriodAvailable: false,
        },
        {
          name: this.$t("lang.menu.emails"),
          linkTo: "/emails",
          event: "mousedown('/emails')",
          icon: "icon-envelope-o",
          roles: [1],
        },
        {
          name: "Usages",
          linkTo: "/usages",
          event: "mousedown('/usages')",
          icon: "icon-money",
          roles: [1],
        },
        {
          name: this.$t("lang.menu.users"),
          linkTo: "/users",
          event: "mousedown('/users')",
          icon: "icon-person",
          roles: [1],
        },
        {
          name: this.$t("lang.menu.agencies"),
          linkTo: "/agencies",
          event: "mousedown('/agencies')",
          icon: "icon-briefcase2",
          roles: [1],
        },
      ],
    };
  },

  mixins: [tabsMixin],

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    toastNotificationData() {
      return this.$store.state.authentication.toastNotificationData;
    },
    ...mapState({
      isMenuCollapse: (state) => state.sidebar.isNavOpen,
    }),
    notifications() {
      return this.$store.state.authentication.notifications;
    },
  },

  methods: {
    ...mapMutations("sidebar", {
      CollapseNav: "toggleNav",
      CollapseNavOpen: "toggleNavOpen",
      CollapseNavClose: "toggleNavClose",
      NavigationClicked: "navigationClicked",
    }),
    goToPage(url) {},
    stopOndemand() {
      this.stopondemand = true;
    },
    toggleMinLink() {
      this.minlink = !this.minlink;
    },
    toggleMinOndemand() {
      this.minondemand = !this.minondemand;
    },
    refreshLinkedin() {
      this.keyLinkedin++;
    },
    mousedown(routeTo) {
      if (this.$route.fullPath == routeTo) {
        return;
      }

      if (screen.width <= 480) {
        this.$refs.toggleMenu.click();
      }

      if (this.$route.path.includes(routeTo)) {
        this.NavigationClicked();
        this.$router.push({
          path: routeTo,
        });
      }
    },
    checkRol(item) {
      
      if (
        $.inArray(parseInt(this.user.role_id), this.menu[item]["roles"]) == -1
      ) {
        return false;
      } else {
        if ( this.menu[item]["team_roles"] != undefined &&
          this.user.team_role_id !== null && this.user.role_id != 4 &&
          $.inArray(parseInt(this.user.team_role_id), this.menu[item]["team_roles"]) == -1
        ) {
          return false;
        }
      }
      return true;
    },
    checkPlan(item) {
      if (this.toastNotificationData.dontChargePayments == 1) {
        return true;
      } else if (
        this.user.subscription_status_id == 0 &&
        this.toastNotificationData.trialPeriodData.trial_period_ended == 0 &&
        this.menu[item]["trialPeriodAvailable"] != undefined &&
        this.menu[item]["trialPeriodAvailable"] == false
      ) {
        return false;
      } else if (
        this.menu[item]["planIdAccess"] != undefined &&
        $.inArray(
          parseInt(this.user.plan_id),
          this.menu[item]["planIdAccess"]
        ) == -1
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
  <style scoped lang="scss" >
#main-navbar,
#main-navbar ul li,
#main-navbar img,
#main-navbar .dropdown-description,
#main-navbar #navbarSupportedContent,
#main-navbar .navbar-nav {
  transition: all 0.5s;
}
.collapseNav {
  width: 60px !important;

  .logooliver {
    width: 55px;
  }
  .item-name .title,
  .dropdown-description {
    display: none;
  }
  .navbar-nav {
    width: 60px;
  }
  .img-user {
    width: 25px;
  }

  .navbar-nav .dropdown-menu {
    min-width: 60px;
    border-radius: 0px;
    .dropdown-item {
      padding: 0.25rem 1.4rem;
    }
  }
  .btn-toggleCollapse i.icon-angle-left {
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
}
.notif {
  right: 10px;
}
.navbar-nav .btn-toggleCollapse i.icon-angle-left {
  -moz-transition: all 0.3s linear;
  -webkit-transition: all 0.3s linear;
  transition: all 0.3s linear;
}
.navbar-nav .dropdown-menu {
  min-width: 140px;
  border-radius: 0px;
  .dropdown-item {
    padding: 0.25rem 1.4rem;
  }
}
.notification-linkedin {
  position: fixed;
  bottom: 0;
  z-index: 999;
  width: 200px;
}
.minimize-linkedin {
  z-index: 1000;
  right: 0;
  padding: 0px 5px;
}
.user-name {
  display: block;
}
div#navbarSupportedContent {
  background-color: #1f2041;
}
.btn-toggleCollapse {
  position: absolute;
  right: -10px;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  z-index: 3;
  background: #1f2041;
  border: none;
  color: #fff;
  font-size: 12px;
  bottom: 30px;
  &:hover {
    background: #13143a;
  }
}
.img-user {
  width: 35px;
}

.logooliver {
  width: 140px;
}
.navbar .nav-item .nav-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.link-logout {
  padding-bottom: 40px;
}
.link-logout .nav-link {
  line-height: 0;
}
.navbar .navbar-nav {
  padding-top: 2em !important;
}
.border-color {
  border: 2px solid #ffffff;
}
</style>