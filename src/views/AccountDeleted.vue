<template>
  <section class="users">
    <main>
      <div class="row mt-5">
      <div class="col-md-3">
      </div>
      <div class="col-md-6">  <div class="login-block well shadow  py-5">
    <img src="@/assets/images/2.png" class="rounded mx-auto d-block" width="150px">
      <strong>
Votre compte a été supprimé. Si vous souhaitez recréer un compte avec cet e-mail, envoyez-nous un e-mail à contact@oliverlist.com, et nous réactiverons votre compte.
      </strong>
      <p class="mt-2 mb-2">Vous pouvez vous déconnecter aussi et créer un compte avec une adresse e-mail différente.</p>
       <router-link class="btn-sm btn-primary" to="/login">
         {{ $t("lang.button.logout") }}
       </router-link>
      </div>
      </div>
      <div class="col-md-3">
      </div>
      </div>
    </main>
  </section>
</template>

<script>

export default {
  
};
</script>