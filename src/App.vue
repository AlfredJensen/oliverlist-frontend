<template lang="html">
	<div id="app">
    <div  class="bg-white">
	<router-view :key="this.$store.state.sidebar.navigationClicked"></router-view>
    </div>
	<div class="fadeinoliver w-100">
		<img id="f1" src="@/assets/images/oliver-c.png" class="mx-auto">
	    <img id="f2" src="@/assets/images/oliver-d.png" class="mx-auto" >
	    <img id="f3" src="@/assets/images/oliver-e.png" class="mx-auto" >
	    <small class="text-primary">{{$t('lang.search.loading')}}...</small>
	</div>
	</div>
</template>

<script lang="js">
	export default {
		name: 'appoliver',
	}
</script>
<style scoped>
.fadeinoliver small {
	z-index:-3;
    top:40%;
    margin-top:95px;
    width:100%;
    text-align:center;
    position:absolute;
}
.fadeinoliver img {
	width:90px;
    left: 50%;
	z-index:-999;
    top:40%;
    margin-left: -45px !important;
    position:absolute;
    -webkit-animation-name: fade;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-duration: 6s;
    animation-name: fade;
    animation-iteration-count: infinite;
    animation-duration: 6s;
}

@-webkit-keyframes fade {
    0% {opacity: 0;}
    20% {opacity: 1;}
    33% {opacity: 1;}
    53% {opacity: 0;}
    100% {opacity: 0;}
}
@keyframes fade {
    0% {opacity: 0;}
    20% {opacity: 1;}
    33% {opacity: 1;}
    53% {opacity: 0;}
    100% {opacity: 0;}
}

#f1 {
}
#f2 {
    -webkit-animation-delay: -2s;
}
#f3 {
    -webkit-animation-delay: -4s;
}

</style>