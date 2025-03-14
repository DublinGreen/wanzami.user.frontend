<template>
  <section style="width: 100%;background-color: #f5f8fb;border-radius: 10px;">
    <NavMain />
    <v-content
      style="clear: both;padding: 2%;margin:0;width: 96%;margin:1% 1%;background-color:#fff;"
    >
      <section class="breadCrumbsBox">
        <v-breadcrumbs :items="breadCrumbsData" large></v-breadcrumbs>
      </section>
      <section class="clearfix"></section>
      <br />
      <section class="container container--fluid">
        <section class="row">
          <div class="col col-12">
            <div class="d-flex grow flex-wrap">
              <div
                class="text-start v-card--material__heading mb-n6 v-sheet theme--dark elevation-6 success pa-7"
                style="max-height: 90px; width: auto;"
              >
                <i
                  aria-hidden="true"
                  class="v-icon notranslate fas fa-box-open theme--dark"
                  style="font-size: 32px;"
                ></i>
                <!---->
              </div>
              <!---->
              <div class="ml-4">
                <div class="card-title font-weight-light">State Election</div>
              </div>
            </div>

            <v-dialog v-model="dialog" hide-overlay persistent width="300">
              <v-card color="green" dark>
                <v-card-text>
                  Sending Request Please Stand By
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>

            <sweetalert-icon icon="success" v-show="showSuccessIcon" />
            <v-alert v-show="showSuccessIcon" dense text type="success">
              {{responseMessage}}
              <strong>Success</strong>
            </v-alert>

            <sweetalert-icon icon="error" v-show="showErrorIcon" />
            <v-alert v-show="showErrorIcon" dense text type="error">
              Error with voting (Unable to send voting request)
              <!-- <strong>Failed</strong> -->
            </v-alert>
          </div>

          <div class="col-sm-12 col-md-4 col" v-for="item in elections" :key="item.candidatesId">
            <div
              class="col-sm-12 col-md-12 col"
              v-bind:style="{color:'#4caf50',fontWeight: '900',fontSize:'1.2em',textTransform: 'capitalize',float:'left'}"
            >
              <div
                class="v-card--material pa-3 v-card v-sheet theme--light v-card--material--hover-reveal"
              >
                <div class="d-flex grow flex-wrap">
                  <div
                    class="text-start v-card--material__heading mb-n6 v-sheet theme--dark elevation-6 transparent"
                    style="width: 100%;"
                  >
                    <div class="v-responsive v-image">
                      <div class="v-responsive__sizer" style="padding-bottom: 66.1667%;"></div>
                      <div
                        class="v-image__image v-image__image--cover"
                        v-bind:style="{zIndex: 99,marginTop: hoverTraining + 'px',backgroundImage: 'url(' + getPartyLogo(item) + ')', backgroundPosition: 'center center',backgroundSize: 'contain' }"
                      ></div>
                      <div class="v-responsive__content" style="width: 1200px;"></div>
                    </div>
                  </div>
                  <div class="text-center py-0 mt-n12 col col-12">
                    <span class="v-tooltip v-tooltip--bottom">
                      <div
                        class="v-tooltip__content"
                        style="left: 0px; opacity: 0; top: 12px; z-index: 0; display: none;"
                      ></div>
                    </span>
                    <span class="v-tooltip v-tooltip--bottom"></span>
                  </div>
                </div>
                <br />

                <div
                  class="v-card__title justify-center font-weight-light"
                  :class="{hovering: isHovering}"
                >{{item.partyName | capitalize }}</div>
                <div class="v-card__text body-1 text-center mb-3 font-weight-light grey--text">
                  {{item.candidates}}
                  <hr
                    role="separator"
                    aria-orientation="horizontal"
                    class="mt-2 v-divider theme--light"
                  />
                  <input style="text-align: center" type="number" placeholder="Enter OTP" />
                  <br />
                </div>
                <hr
                  role="separator"
                  aria-orientation="horizontal"
                  class="mt-2 v-divider theme--light"
                />
                <div class="v-card__actions pb-0">
                  <v-btn type="button" @click="vote(item)" color="success">
                    <i class="fas fa-box-open"></i>Voter For Candidate
                  </v-btn>

                  <div class="display-1 font-weight-light grey--text"></div>
                  <div class="spacer"></div>
                  <span class="caption grey--text font-weight-light">
                    <i
                      aria-hidden="true"
                      class="v-icon notranslate mdi mdi-map-marker theme--light"
                      style="font-size: 16px;"
                    ></i>
                    {{item.partyName}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </v-content>
    <Footer />
  </section>
</template>

<script>
import axios from "axios";
import { profileMixin } from "../mixins/profileMixin.js";
import store from "../store/index.js";
import NavMain from "../components/Navs/NavMain.vue";
import Footer from "../components/Footers/Footer.vue";

export default {
  name: "ElectionState",
  mixins: [profileMixin],
  components: {
    NavMain,
    Footer
  },
  created: function() {
    let vmObjectInstance = this;

    let tempData = {
      responseCode: "00",
      responseMessage: "SUCCESSFUL",
      data: [
        {
          electionId: 1,
          electionName: "Federal",
          candidates: "olumide olowo",
          candidatesId: 1,
          partyName: "PDP"
        },
        {
          electionId: 2,
          electionName: "Federal",
          candidates: "Tolulope jamesl",
          candidatesId: 2,
          partyName: "APC"
        },
        {
          electionId: 3,
          electionName: "Federal",
          candidates: "Adekunle Uboh",
          candidatesId: 3,
          partyName: "ZLP"
        }
      ]
    };

    vmObjectInstance.elections = tempData.data;
    axios
      .get(this.endpoint)
      .then(function(response) {
        if (response.data.responseCode === store.state.successCode) {
          vmObjectInstance.elections = response.data.data;
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  },
  data: function() {
    return {
      responseMessage: "",
      showSuccessIcon: false,
      showErrorIcon: false,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      loadingPage: true,
      isLogin: store.state.isLogin,
      hoverTrainImageHoverValueMin: 0,
      hoverTrainImageHoverValueMax: -75,
      hoverTraining: 0,
      isHovering: true,
      elections: null,
      serverUrl: store.state.urlStore.serverUrl,
      endpoint:
        store.state.urlStore.baseUrl + store.state.urlStore.getStateElections,
      endpointVoting: store.state.urlStore.baseUrl + store.state.urlStore.vote,
      breadCrumbsData: []
    };
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  methods: {
    vote(item) {
      let vmObjectInstance = this;

      // console.log(item);
      let answer = confirm(
        `Are you sure you want to vote for ${item.candidates} under ${item.partyName}`
      );

      if (answer) {
        this.dialog = true;
        vmObjectInstance.showSuccessIcon = false;
        vmObjectInstance.showErrorIcon = false;

        let dataToSend = {
          id: localStorage.getItem(store.state.setTokenLocalStorageKey),
          electionParticipantsId: item.candidatesId,
          isVoted: true,
          otp: localStorage.getItem(store.state.setOTPLocalStorageKey)
        };
        // console.log("data to send for vote >>> ", dataToSend);
        // this.showErrorIcon = false;
        // this.showSuccessIcon = false;

        this.voteUrlCall(vmObjectInstance, dataToSend);
      }
    },
    voteUrlCall(vmObjectInstance, headers) {
      axios
        .post(this.endpointVoting, headers)
        .then(function(response) {
          vmObjectInstance.dialog = false;

          if (response.data.responseCode === store.state.successCode) {
            vmObjectInstance.responseMessage = response.data.responseMessage;
            vmObjectInstance.showSuccessIcon = true;
            vmObjectInstance.showErrorIcon = false;

            setTimeout(() => {
              this.$v.$reset();
            }, store.state.alertLongTimeout);
          } else {
            vmObjectInstance.showErrorIcon = true;
            vmObjectInstance.showSuccessIcon = false;

            // vmObjectInstance.serverReturnedErrors = `${response.data.errors.email}  ${response.data.errors.name}`;
          }
        })
        .catch(function(error) {
          console.error(error);
          vmObjectInstance.dialog = false;
          vmObjectInstance.showErrorIcon = true;
          vmObjectInstance.showSuccessIcon = false;
        });
    },
    editProfile() {
      // this.$router.push(this.breadCrumbsData[0].href);
      // window.open(this.breadCrumbsData[0].href); // open in new tab
      // location.replace(this.breadCrumbsData[0].href);
    },
    combineCurrencyAndPrice(currency, price) {
      return currency + price;
    },
    getPartyLogo(item) {
      if (item != null) {
        if (item.partyName === "PDP") {
          return store.state.pdpLogoUrl;
        }

        if (item.partyName === "APC") {
          return store.state.apcLogoUrl;
        }

        if (item.partyName === "ZLP") {
          return store.state.zlpLogoUrl;
        }
      }
    }
  }
};
</script>


<style scoped>
</style>