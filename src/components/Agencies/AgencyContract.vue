<template>
  <main class="container">
    <LoadingSpinner v-if="loadingOptionsList || loading" />
    <div class="mb-5" v-if="!loadingOptionsList && !loading">
      <div class="" v-if="showEditButton">
        <router-link to="/agencies/me" class="btn btn-primary float-right">{{
          $t("lang.label.edit")
        }}</router-link>
      </div>
      <h1>Proposition Commerciale Oliverlist Agency</h1>
      <div class="mt-5">
        <div v-if="!isSignatureDateExpired">
          <p>Date : {{ today }}</p>
          <p>Validité : {{ daysLeft }} jours</p>
        </div>

        <div v-else class="alert alert-danger">
          {{ $t("lang.appointments.expiredcontract") }}
        </div>

        <br /><br />
        <h5>Fournisseur :</h5>
        <p>AIVONI SAS (Oliverlist Agency)</p>
        <p>9, rue bartholdi,92100 Boulogne-Billancourt</p>
        <p>SIRET : 80878516600022</p>

        <br /><br />
        <h5>Client :</h5>
        <p>{{ model.client.name }}</p>
        <p>{{ model.client.address }}</p>
        <p>SIRET : {{ model.client.siret }}</p>

        <br /><br />

        <h5>1.Périmètre :</h5>
        <p>
          Services de développement commercial avec prise de rendez-vous pour
          <b>{{ model.client.name }}</b> sur une période de 1 mois, renouvelée
          tacitement.
        </p>

        <br /><br />

        <h5>2.Le service comprend :</h5>
        <ul>
          <li>Étude du ciblage</li>
          <li>Rédaction des séquences d’email de prospection</li>
          <li>Recherche de données sur le marché adressable</li>
          <li>Compilation des données de contact vérifiées</li>
          <li>Stratégie de prospection commerciale</li>
          <li>Mise en place d’une équipe de business development</li>
          <li>Mesures et analyses de la conversion</li>
          <li>Transmission des rendez-vous en automatique</li>
        </ul>

        <br /><br />

        <h5>3.Marché cible :</h5>

        <div>
          <h4 class="mt-5">{{ $t("lang.label.target") }}</h4>

          <TargetsView :targets="model.targets" />

        </div>

        <br /><br />

        <h5>4.Objectif :</h5>

        <ul>
          <li>
            Quantité de commerciaux à fournir en rendez-vous :
            {{ model.salesRep.length }}
          </li>
          <li>
            Quantité de rendez-vous à fournir par mois :
            {{ model.client.appt_quantity }}
          </li>
          <li>Durée des rendez-vous : {{ model.client.appt_duration }} min</li>
          <li>Date de lancement prévue : {{ model.client.appt_start_date }}</li>
          <li>
            Vous souhaitez synchroniser tous les prospects contactés sur votre
            CRM (en option 0,05cts/contact) :
            {{ model.client.sync_crm == 1 ? "oui" : "non" }}
          </li>
        </ul>

        <br /><br />

        <h5>5.Commentaire du client :</h5>
        <p
          v-if="
            model.client.extra_info === null || model.client.extra_info === ''
          "
        >
          Aucun commentaire
        </p>
        <p v-else v-html="model.client.extra_info"></p>

        <br /><br />

        <h5>6.Coût :</h5>
        <p>
          Tarif par rendez-vous transmis : {{ model.client.meeting_price }} H.T
          / RDV
        </p>

        <br /><br />

        <h5>7.Inclus :</h5>
        <ul>
          <li>Frais de mise en place</li>
          <li>
            Création d’une landing page ultra optimisée pour la prospection
          </li>
          <li>Comptes Google Workspace illimités pour la prospection</li>
          <li>Achat et configuration du domaine de prospection</li>
          <li>Comptes Oliverlist Pro illimités</li>
        </ul>

        <br /><br />

        <h5>8.Détail de la prestation :</h5>
        <p>
          L’équipe d’Oliverlist vous propose un service d’externalisation votre
          prospection commerciale. À ce titre, notre équipe sera amenée à
          réaliser différentes campagnes de prospection par mail et à
          communiquer en votre nom auprès de différents prospects sourcés sur la
          base de la cible mentionnée dans les termes de cette proposition.
        </p>

        <br /><br />

        <h5>9.Ciblage :</h5>
        <p>
          Le ciblage utilisé par nos équipes dans vos campagnes de prospection
          est celui précisé plus haut dans ce document. Nos contrats étant
          spécifiques à une cible définie en amont, tout changement de cible
          pourra donner lieu à un changement de contrat, et donc de
          tarification. Nous vous demandons ainsi vous assurer que la cible
          précisée ci-avant correspond bien à vos attentes. Cette dernière ne
          pourra en effet pas être modifiée par la suite. Nous tenons également
          à préciser que la cible prospectée pourra être amenée à prendre
          rendez-vous avec votre équipe commerciale pour plusieurs sujets,
          incluant des demandes de devis, mais également des suggestions de
          partenariat.
        </p>

        <br /><br />

        <h5>10.Création des campagnes :</h5>
        <p>
          Après validation de cette proposition, nos équipes entameront la mise
          en place de vos campagnes. Nous vous solliciterons ainsi par écrit à
          plusieurs reprises afin de récupérer les documents nécessaires à
          l’élaboration de ces dernières. L’ensemble des campagnes sont gérées
          en interne, par notre équipe. Les séquences sont rédigées à partir des
          éléments de briefing transmis par votre équipe. Oliverlist se réserve
          le droit d’itérer sur la forme des messages, mais jamais sur le fond.
          Nous resterons ainsi fidèles au brief fourni concernant les campagnes.
          Les campagnes sont lancées une fois que la mise en place et la
          formation à nos outils est terminée. Une fois lancées, il faut compter
          une période de ramp-up d’environ 15 jours pour que les campagnes
          atteignent le régime demandé.
        </p>

        <br /><br />

        <h5>11.Travail de prospection :</h5>
        <p>
          La quantité de campagnes de prospection qui seront mises en place
          dépendra de la quantité de rendez-vous que vous souhaitez. Cette
          quantité peut varier selon votre cible et votre produit. Elle pourra
          être ajustée par le chef de projet en charge de votre compte. Le
          domaine des adresses emails qui sera utilisé pour la prospection sera
          : @[Offre Domain (deal custom)] + “-pro” avant le “.”. Ce domaine sera
          acheté et géré par l’agence Oliverlist une fois cette proposition
          commerciale validée. Par la suite un compte Google Workspace
          Professionnel sera mis en place et la quantité d’adresses emails
          utilisée dépendra de la quantité de rendez-vous que vous souhaitez.
          Cette quantité peut varier selon votre cible et votre produit. Elle
          pourra être ajustée par le chef de projet en charge de votre compte.
          Les frais de mise en place ainsi que les configurations (warm-up des
          adresses emails, CNAME, SPF, DKIM, DMARC, etc) seront aussi à la
          charge de l’agence Oliverlist. La quantité de comptes Oliverlist
          Professionnels qui seront mis en place dépendra de la quantité de
          rendez-vous que vous souhaitez. Cette quantité peut varier selon votre
          cible et votre produit. Elle pourra être ajustée par le chef de projet
          en charge de votre compte. La forme (copywriting, relances, délais,
          etc) des séquences de prospection sera gérée directement par l’équipe
          de l’agence Oliverlist. Le fond et l’argumentaire des messages
          proviendra d’un formulaire que nous vous demanderons de remplir une
          fois la proposition commerciale validée.
        </p>
        <br /><br />

        <h5>12.Conformité RGPD :</h5>
        <p>
          Le règlement général sur la protection des données entre en vigueur le
          25 mai 2018. Oliver, en tant que producteur de données, est
          directement concerné. Tous les processus d'acquisition et de contact
          utilisés par Oliver sont conformes au GDPR. Ainsi, Oliverlist se
          conforme aux obligations légales suivantes : Nous informons nos
          prospects des conditions de traitement des données, Nous respectons le
          droit d'opposition (lien de désabonnement) et nous nous assurons que
          la sollicitation est liée à la profession de la personne contactée.
        </p>

        <br /><br />

        <h5>13.Prise de rendez-vous :</h5>
        <p>
          Nous utiliserons des liens Calendly directement synchronisés avec
          l’agenda de vos commerciaux pour la transmission des rendez-vous.
          Cette étape de préparation est à effectuer par
          <b>{{ model.client.name }}</b>
          lors de la phase préparatoire. Le personnel de
          <b>{{ model.client.name }}</b> sera guidé par l’agence pour cette
          manipulation. Attention, le lien Calendly ne devra pas être utilisé
          pour prendre des rendez-vous en dehors du process de prospection de
          l’agence Oliverlist. Les business developers de l’agence Oliverlist ne
          participent pas aux rendez-vous transmis aux commerciaux de
          <b>{{ model.client.name }}</b
          >. Nous intervenons uniquement dans le processus de prise de
          rendez-vous et de retraitement en cas de non-présentation du prospect
          au rendez-vous.
        </p>

        <br /><br />

        <h5>14.Mails de confirmation plateforme Oliverlist :</h5>
        <p>
          Les prospects qui ont validé leur participation aux rendez-vous ainsi
          que le commercial lui-même recevront un rappel 24 h et 1 h avant le
          début des rendez-vous.
        </p>

        <br /><br />

        <h5>15.Participation aux rendez-vous :</h5>
        <p>
          Les rendez-vous sont pris par les prospects via un outil leur
          permettant de choisir un créneau disponible directement dans l’agenda
          du commercial qui effectue le rendez-vous (Calendly). De ce fait, le
          statut de participation à l’événement est automatiquement validé chez
          les deux participants. De votre côté, vous êtes notifié par mail qu’un
          nouveau rendez a été réservé. Vous recevrez à nouveau un rappel par
          mail quelques heures avant le début de votre rendez-vous.
        </p>

        <br /><br />

        <h5>16.Gestion et suivi des rendez-vous :</h5>
        <p>
          Vous pouvez consulter l’ensemble des rendez-vous pris par vos
          prospects directement sur l’interface de notre application. Les
          rendez-vous se situes dans des opportunités générée par Oliverlist
          dans lesquelles vous pouvez rentrouver le détail des actions
          effectuées par l’application et par les business developers en charge
          de votre compte.
        </p>

        <br /><br />

        <h5>17.Signalement d’un rendez-vous :</h5>
        <p>
          Si vous pensez qu’un rendez-vous présente un prospect ou entreprise en
          dehors du scope de prospection que vous avez établie dans ce contrat,
          vous pouvez le signaler en amont du rendez-vous uniquement et informer
          la ou les personnes ayant pris un rendez-vous avec votre équipe de
          l’annulation si vou le souhaitez. Les rendez-vous signalés sont
          ensuite vérifiés puis validés par nos équipes si les prospects sont
          effectivement hors cible. Dans ce cas, le rendez-vous ne vous sera pas
          facturé. Si vous contactez le ou les prospects ayants pris rendez-vous
          avec vous ou vos commerciaux, le rendez-vous sera comptabilisé en tant
          que rendez-vous facturable.
        </p>

        <br /><br />

        <h5>18.Cas de non-présentation du prospect au rendez-vous :</h5>
        <p>
          Le commercial de <b>{{ model.client.name }}</b> doit informer l’agence
          Oliverlist à travers l’opportunité dans laquelle se situe le
          rendez-vous en cliquant sur le bouton “Le rendez-vous n’a pas eu
          lieu”. Par la suite, le prospect sera retraité pour une nouvelle prise
          de rendez-vous par le business developer concerné par l’offre. Les
          rendez-vous avec cas de non-présentation ne sont pas facturés.
        </p>

        <br /><br />

        <h5>19.Cas d'empêchement pour le commercial :</h5>
        <p>
          Le commercial concerné devra gérer lui-même la planification d’un
          nouveau rendez-vous. Le rendez-vous sera facturé à la date initiale.
        </p>

        <br /><br />

        <h5>20.Support :</h5>
        <p>
          L’ensemble des échanges avec notre équipe se fait via le Chat situé en
          bas à droite de votre interface client. C’est le canal de
          communication à privilégier pour toute question relative au suivi de
          vos rendez-vous.
        </p>

        <br /><br />

        <h5>21.Facturation des rendez-vous :</h5>
        <p>
          Les rendez-vous vous sont facturés à la fin de chaque mois ou dès que
          votre compte atteint un montant prédéterminé appelé seuil de paiement,
          selon la première échéance atteinte. Un rendez-vous est considéré
          comme facturable s’il n’a pas été signalé en Absent, s’il n’a pas été
          signalé comme hors cible et 24h après la date et heure du rendez-vous.
        </p>

        <br /><br />

        <h5>22.Seuil de paiement :</h5>
        <p>
          Il s'agit du montant des coûts à partir duquel la facturation est
          déclenchée. Il commence à un niveau fixe de 300 €. Il augmente
          automatiquement de 100 € si vos coûts atteignent ce seuil avant la fin
          du cycle de facturation mensuel.
        </p>

        <br /><br />

        <h5>23.Méthode de facturation :</h5>
        <p>
          Le paiement par cartes bancaire est la seule méthode de paiement
          disponible. Vous pouvez décider de retirer votre méthode de paiement à
          n’importe quel moment sur l’application.
        </p>

        <br /><br />

        <h5>24.Résiliation :</h5>
        <p>
          Vous pouvez demander l’arrêt de la prospection commerciale pour votre
          compte à tout moment en nous informant par email à l’adresse
          agency@oliverlist.com. La prestation prendre fin à la fin du mois
          (facturable) en cours. À la fin de cette période, les rendez-vous
          futurs n’ayant pas encore été effectués seront considérés comme
          facturables.
        </p>

        <br /><br />

        <div v-if="!isUserLogin && !isSignatureDateExpired">
          <router-link class="btn btn-primary float-right" to="/login">
            {{ $t("lang.appointments.loginandvalidatetheproposal") }}
          </router-link>
        </div>
        <div v-else-if="showForm">
          <vue-form-generator
            ref="termsForm"
            :schema="schemaTerms"
            :model="termsModel"
            :options="formOptions"
          ></vue-form-generator>

          <br /><br />

          <h5>Méthode de paiement</h5>

          <p>
            Pour finaliser votre contrat, veuillez ajouter une méthode de
            paiement valide. Aucun frais ne vous seront facturés suite à
            l’enregistrement de votre méthode de paiement. Vous pouvez décider
            de retirer votre méthode de paiement à n’importe quel moment sur
            l’application.
          </p>

          <BillingProfile
            ref="billingProfileForm"
            :key="billingProfileKey"
            :showSaveButton="false"
          />
          <CreditCardForm ref="creditCardForm" :showSaveButton="false" />

          <button class="btn btn-primary float-right" @click="sendForm()">
            {{ $t("lang.appointments.validatemycontract") }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { clientsService } from "@/_services";
import BillingProfile from "@/components/Billing/BillingProfile.vue";
import CreditCardForm from "@/components/Billing/CreditCardForm.vue";
import TargetsView from "@/components/Agencies/TargetsView.vue";

export default {
  props: {},
  components: {
    LoadingSpinner,
    BillingProfile,
    CreditCardForm,
    TargetsView
  },
  data() {
    var self = this;
    return {
      loading: false,
      clientHash: undefined,
      termsModel: { accept_terms: false },
      billingProfileKey: 0,
      model: {},
      schemaTerms: {
        fields: [
          {
            type: "checkbox",
            label:
              "En cochant cette case, j’acception les confitions générale de l’agence Oliverlist mentionnées ci-dessus.",
            model: "accept_terms",
            featured: true,
            required: true,
            styleClasses: "col-md-6",
            validator(value, field, model) {
              if (!value) {
                return [self.$t("lang.label.required")];
              }
              return [];
            },
            // hint: "Please enter your full name",
            // help: "This is an other longer help text",
            // onChanged: function (model, newVal, oldVal, field) {
            //   console.log(
            //     `Model's name changed from ${oldVal} to ${newVal}. Model:`,
            //     model
            //   );
            // },
            // onValidated: function (model, errors, field) {
            //   if (errors.length > 0)
            //     console.warn("Validation error in Name field! Errors:", errors);
            // },
            // attributes: {
            //   "data-toggle": "collapse",
            //   title: "Some Tooltip Title",
            // },
          },
        ],
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.authentication.user,
      totalLoading: (state) => state.optionsList.totalLoading,
      loadingOptionsList: (state) => !state.optionsList.contractListLoaded,
      hierarchyoptions: (state) => state.optionsList.all["regions"].data,
      hierarchyoptionsSearch: (state) =>
        state.optionsList.all["categories_search_words"].data,
      hierarchyoptionsSearchFunction: (state) =>
        state.optionsList.all["categories_search_function"].data,
      hierarchyoptionsSearchLevel: (state) =>
        state.optionsList.all["categories_search_level"].data,
      hierarchyoptionsGoogleAll: (state) =>
        state.optionsList.all["categories_google_all"].data,
      hierarchyoptionsCountry: (state) =>
        state.optionsList.all["countries"].data,
    }),
    today: function () {
      let currentDate = new Date();
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      return day + "/" + month + "/" + year;
    },
    daysLeft: function () {
      let now = new Date().getTime();
      let expiration = new Date(
        this.model.client.signature_expiration_date
      ).getTime();
      let days = parseInt((expiration - now) / 1000 / 3600 / 24);
      return days;
    },
    isUserLogin: function () {
      return (
        this.currentUser !== undefined &&
        this.currentUser !== null &&
        this.currentUser.role_id == 4
      );
    },
    isSignatureDateExpired() {
      return this.daysLeft <= 0;
    },
    showForm: function () {
      return this.isUserLogin && !this.isSignatureDateExpired;
    },
    showEditButton: function () {
      return false && this.isUserLogin;
    },
  },
  created() {
    this.clientHash = this.$route.query.qclh;
    this.getAllOptionsList();
    if (
      !this.isUserLogin &&
      (this.clientHash === undefined || this.clientHash === "")
    ) {
      this.$router.push("/login");
    }
    if (this.isUserLogin && this.currentUser.agency_signed == 1) {
      // this.$router.push("/settings-account");
    }
    this.getAgency();
  },

  methods: {
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
    sendForm() {
      let billingProfileModel = this.$refs.billingProfileForm.getModel();
      // console.log(billingProfileModel);

      let creditCardModel = this.$refs.creditCardForm.getModel();
      // console.log(creditCardModel);

      this.$refs.termsForm.validate();

      if (
        !billingProfileModel ||
        !creditCardModel ||
        this.$refs.termsForm.errors.length > 0
      ) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.label.missingdata"),
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t("lang.button.ok"),
        });
        return false;
      }

      this.$refs.billingProfileForm.saveBillingProfile().then((result) => {
        this.billingProfileKey++;
      });

      this.$refs.creditCardForm.saveSepaPaymentMethod().then((result) => {
        // show message
      });
    },
    getAgency() {
      this.loading = true;
      if (this.isUserLogin) {
        clientsService.getAgency(0).then((response) => {
          this.setModel(response);
        });
      } else {
        clientsService.getProposalAgency(this.clientHash).then((response) => {
          this.setModel(response);
        });
      }
    },

    setModel(response) {
      this.model = response;

      if (this.model.targets !== undefined && this.model.targets !== null) {
        this.model.targets.forEach((target) => {
          // convert empty array into object
          if (Array.isArray(target.data.employees)) {
            target.data.employees = {};
          }
          if (
            target.data.categories_jobs === undefined ||
            Array.isArray(target.data.categories_jobs)
          ) {
            target.data.categories_jobs = {};
          }
        });
      }
      this.checkData();
      this.loading = false;
    },
    checkData() {
      if (this.model.client != null && this.model.user != null) {
        if (this.model.client.signed_on === null) {
          return true;
        }
      }

      if (this.isUserLogin) {
        //this.$router.push("/settings-account");
      } else {
        this.$router.push("/login");
      }
    },
  },
  watch: {},
};
</script>