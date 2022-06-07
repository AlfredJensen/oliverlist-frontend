<template>
    <div class="row">
        <div class="col-md-4">
            <Sidebar></Sidebar>
        </div>
        <div class="col-md-8">
            <CreateAccount></CreateAccount>
        </div>
    </div>
</template>

<script>
    import Sidebar from "@/components/Signup/Sidebar.vue";
    import MultiStep from "@/components/Signup/MultiStep.vue";
    import LoadingSpinnerBar from "@/components/LoadingSpinnerBar.vue";
    import CreateAccount from "../views/CreateAccount.vue";
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                loading: false
            };
        },
        components: {
            LoadingSpinnerBar,
            Sidebar,
            MultiStep,
            CreateAccount
        },
        computed: {
           
        }
    };
</script>