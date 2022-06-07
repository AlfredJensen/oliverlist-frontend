<template>
    <div>
        <section class="create-user hv-100">
            <div class="d-flex align-items-center justify-content-center h-100">
                <div class="container">
                    <div class="row h-100">
                        <div class="col-sm-12 col-lg-8 h-100 mx-auto">
                            <div class="p-4 border rounded">
                                    <div class="wrapper-form ">
                                        <div class="my-4">
                                            <h2 class="dark-blue">{{ $t('lang.label.welcometooliver') }}</h2>
                                        </div>
                                        <div class="my-4">
                                            <h4 class="dark-blue">{{ $t('lang.label.createyouraccount') }}</h4>
                                        </div>
                                        <form class="mt-4">
                                            <div class="form-row my-4">
                                                <div class="col">
                                                    <input type="text" class="form-control" v-bind:placeholder="$t('lang.label.firstname')" v-model="newUser.surname">
                                                </div>
                                                <div class="col">
                                                    <input type="text" class="form-control" v-bind:placeholder="$t('lang.label.lasname')" v-model="newUser.name">
                                                </div>
                                            </div>
                                            <div class="form-row my-4">
                                                <div class="form-group col-md-12">
                                                    <input type="email" class="form-control" id="emailUser" value="" v-bind:placeholder="$t('lang.label.email')" v-model="newUser.email">
                                                    <small id="emailHelp" class="form-text dark-gray">{{ $t('lang.label.youwillhavetoconfirmthatthisemailisyours') }}</small>
                                                </div>
                                            </div>
                                            <div class="form-row my-4">
                                                <div class="form-group col-md-6">
                                                    <input type="password" class="form-control" id="password" v-bind:placeholder="$t('lang.label.newpassword')" v-model="newUser.password">
                                                    <small id="emailHelp" class="form-text dark-gray">{{ $t("lang.validation.texttosmall", {min: "8"}), }}</small>
                                                </div>
                                                <div class="form-group col-md-6">
                                                    <input type="password" class="form-control" id="confirm-pass" v-bind:placeholder="$t('lang.label.confimrpassword')">
                                                </div>
                                            </div>
                                            <div class="w-100 d-flex justify-content-end">
                                                <button type="button" class="btn btn-primary themed-button text-right" @click="showData()">{{ $t('lang.button.next') }}</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
       </section>
    </div>
</template>
<script>
export default {
    data(){
        return{
            newUser:{
                surname:'',
                name:'',
                email:'',
                password:''
            }
        }
    },
    created(){
        this.clean();
    },
    methods:{
        showData(){
            // console.log(this.newUser);
        },
        clean(){
            document.addEventListener("DOMContentLoaded", function(event) {
                document.getElementById("emailUser").value = "";
            }
        )}
            
        
         }
}
</script>