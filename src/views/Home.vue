<template>
  <div class="home" v-if="!loading">
    <Sidebar />
	<HeaderTopBar />
	<ToastNotifications/>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
		
	 <Footer />
  </div>
</template>

<script lang="js">
	import Sidebar from '@/components/Sidebar';
	import HeaderTopBar from '@/components/HeaderTopBar.vue';
	import ToastNotifications from "@/components/ToastNotifications.vue";
	import Footer from "@/components/Footer.vue";


	export default {
		name: 'home',
		components: {
			Sidebar,
			HeaderTopBar,
			ToastNotifications,
			Footer
		},
		data () {
			return { 
				loading: true,
			}
		},
		created() {
			const { dispatch } = this.$store;
			dispatch("authentication/refreshToken").then(
				(response) => {
					this.loading = false;
				}  
			)
		}
	}
</script>
