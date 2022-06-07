<template>
   <section id="footer-component" class="footer-component">
        <div class="">
            <div class="wrapper-footer p-3" :class="{ 'expand-footer' : isMenuCollapse }">
                <div class="content-links">
                <ul class="footer-links d-flex ">
                    <li>
                        <a href="https://www.oliverlist.com/">oliverlist.com © 2021</a>
                    </li>
                    <li>
                        <a href="https://oliverlist.com/conditions-generales/">{{ $t('lang.label.conditions') }}</a>
                    </li>
                   <li>-</li>
                    <li>
                        <a href="https://oliverlist.com/donnees-personnelles/">{{ $t('lang.label.policy') }}</a>
                    </li>
                </ul>
                </div>
            </div>
        </div>
   </section>
</template>
<script>
import { mapState,mapMutations  } from "vuex";
export default {
    data() {
    return {
      
    };
    },
      computed: {
    ...mapState({
      isMenuCollapse: state => state.sidebar.isNavOpen,
    }),
      }
}
</script>

<style>
#footer-component .wrapper-footer.expand-footer{
    margin-left: 60px;
}
section#footer-component{
background-color: #383E4B !important;
}
</style>