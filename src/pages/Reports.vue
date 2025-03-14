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

      <section id="localBox">
        <h3 style="font-weight: bolder;text-align:left;">
          Local Elections Reports
          <i class="fas fa-chart-bar" style="margin-right: 10px;"></i>
        </h3>
        <div class="col-sm-12 col-md-4 col" v-for="item in localResults" :key="item.votersCount">
          <div style="width: 15%;float:left;">
            <img
              :src="getPartyLogo(item)"
              :alt="item.partyName"
              :title="item.partyName"
              width="150px"
            />
          </div>
          <div style="width: 30%;float:left;">
            <p style="color:#00ff00;font-weight: bold"></p>
            <p></p>
            <!-- <p>
            <i class="fas fa-box-open" style="margin-right: 10px;"></i>
            {{userData.email}}
          </p>
          <p>
            <i class="fa fa-phone" style="margin-right: 10px;"></i>
            {{userData.phone}}
          </p>
          <p>
            <i class="fa fa-globe" style="margin-right: 10px;"></i>
            {{userData.website}}
            </p>-->
          </div>
          <div style="width: 50%;float:left;">
            <p style="color:#00ff00;font-weight: bold">
              <i class="fa fa-users" style="margin-right: 10px;"></i>
              {{item.votersCount}}
            </p>
            <p>
              <i class="fas fa-user" style="margin-right: 10px;"></i>
              {{item.candidates}}
            </p>
            <p>
              <i class="fas fa-box-open" style="margin-right: 10px;"></i>
              {{item.electionName}}
            </p>
          </div>
          <div style="clear: both">
            <br />
            <br />
          </div>
        </div>
        <div style="clear:both;"></div>
      </section>

      <hr role="separator" aria-orientation="horizontal" class="mt-2 v-divider theme--light" />

      <section id="stateBox">
        <h3 style="font-weight: bolder;text-align:left;">
          State Elections Reports
          <i class="fas fa-chart-bar" style="margin-right: 10px;"></i>
        </h3>
        <div class="col-sm-12 col-md-4 col" v-for="item in stateResults" :key="item.votersCount">
          <div style="width: 15%;float:left;">
            <img
              :src="getPartyLogo(item)"
              :alt="item.partyName"
              :title="item.partyName"
              width="150px"
            />
          </div>
          <div style="width: 30%;float:left;">
            <p style="color:#00ff00;font-weight: bold"></p>
            <p></p>
            <!-- <p>
            <i class="fas fa-box-open" style="margin-right: 10px;"></i>
            {{userData.email}}
          </p>
          <p>
            <i class="fa fa-phone" style="margin-right: 10px;"></i>
            {{userData.phone}}
          </p>
          <p>
            <i class="fa fa-globe" style="margin-right: 10px;"></i>
            {{userData.website}}
            </p>-->
          </div>
          <div style="width: 50%;float:left;">
            <p style="color:#00ff00;font-weight: bold">
              <i class="fa fa-users" style="margin-right: 10px;"></i>
              {{item.votersCount}}
            </p>
            <p>
              <i class="fas fa-user" style="margin-right: 10px;"></i>
              {{item.candidates}}
            </p>
            <p>
              <i class="fas fa-box-open" style="margin-right: 10px;"></i>
              {{item.electionName}}
            </p>
          </div>
          <div style="clear: both">
            <br />
            <br />
          </div>
        </div>
        <div style="clear:both;"></div>
      </section>

      <hr role="separator" aria-orientation="horizontal" class="mt-2 v-divider theme--light" />

      <section id="federalBox">
        <h3 style="font-weight: bolder;text-align:left;">
          Federal Elections Reports
          <i class="fas fa-chart-bar" style="margin-right: 10px;"></i>
        </h3>
        <div class="col-sm-12 col-md-4 col" v-for="item in federalResults" :key="item.votersCount">
          <div style="width: 15%;float:left;">
            <img
              :src="getPartyLogo(item)"
              :alt="item.partyName"
              :title="item.partyName"
              width="150px"
            />
          </div>
          <div style="width: 30%;float:left;">
            <p style="color:#00ff00;font-weight: bold"></p>
            <p></p>
            <!-- <p>
            <i class="fas fa-box-open" style="margin-right: 10px;"></i>
            {{userData.email}}
          </p>
          <p>
            <i class="fa fa-phone" style="margin-right: 10px;"></i>
            {{userData.phone}}
          </p>
          <p>
            <i class="fa fa-globe" style="margin-right: 10px;"></i>
            {{userData.website}}
            </p>-->
          </div>
          <div style="width: 50%;float:left;">
            <p style="color:#00ff00;font-weight: bold">
              <i class="fa fa-users" style="margin-right: 10px;"></i>
              {{item.votersCount}}
            </p>
            <p>
              <i class="fas fa-user" style="margin-right: 10px;"></i>
              {{item.candidates}}
            </p>
            <p>
              <i class="fas fa-box-open" style="margin-right: 10px;"></i>
              {{item.electionName}}
            </p>
          </div>
          <div style="clear: both">
            <br />
            <br />
          </div>
        </div>
        <div style="clear:both;"></div>
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
  name: "Reports",
  mixins: [profileMixin],
  components: {
    NavMain,
    Footer
  },
  created: function() {
    let vmObjectInstance = this;
    vmObjectInstance.loadingPage = true;

    axios
      .get(this.endpointLocalElectionResult)
      .then(function(response) {
        if (response.data.responseCode === store.state.successCode) {
          vmObjectInstance.localResults = response.data.data;
        }
      })
      .catch(function(error) {
        console.error(error);
      });

    axios
      .get(this.endpointStateElectionResult)
      .then(function(response) {
        if (response.data.responseCode === store.state.successCode) {
          vmObjectInstance.stateResults = response.data.data;
        }
      })
      .catch(function(error) {
        console.error(error);
      });

    axios
      .get(this.endpointFederalElectionResult)
      .then(function(response) {
        if (response.data.responseCode === store.state.successCode) {
          vmObjectInstance.federalResults = response.data.data;
          vmObjectInstance.loadingPage = false;
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  },
  data: function() {
    return {
      loadingPage: true,
      isLogin: store.state.isLogin,
      endpoint:
        store.state.urlStore.baseUrl + store.state.urlStore.getUserByEmailUrl,
      endpointLocalElectionResult:
        store.state.urlStore.baseUrl +
        store.state.urlStore.getLocalElectionResult,
      localResults: null,
      endpointStateElectionResult:
        store.state.urlStore.baseUrl +
        store.state.urlStore.getStateElectionResult,
      stateResults: null,
      endpointFederalElectionResult:
        store.state.urlStore.baseUrl +
        store.state.urlStore.getFederalElectionResult,
      federalResults: null,
      breadCrumbsData: []
    };
  },
  methods: {
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
#localBox {
  clear: both;
}

#localBox p {
  float: left;
  width: 100%;
  text-align: left;
}

#stateBox {
  clear: both;
}

#stateBox p {
  float: left;
  width: 100%;
  text-align: left;
}

#federalBox {
  clear: both;
}

#federalBox p {
  float: left;
  width: 100%;
  text-align: left;
}
</style>