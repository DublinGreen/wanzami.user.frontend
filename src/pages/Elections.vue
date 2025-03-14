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
                <div class="card-title font-weight-light">Elections</div>
              </div>
            </div>
          </div>

          <v-btn href="#/ElectionFederal" x-large color="success" class="subMenuButton" dark>
            Federal Election
            <i class="fa fa-boxes iconlight"></i>
          </v-btn>

          <v-btn href="#/ElectionState" x-large color="success" class="subMenuButton" dark>
            State Election
            <i class="fa fa-boxes iconlight"></i>
          </v-btn>

          <v-btn href="#/ElectionLocal" x-large color="success" class="subMenuButton" dark>
            Local Election
            <i class="fa fa-boxes iconlight"></i>
          </v-btn>
        </section>
      </section>
    </v-content>
    <Footer />
  </section>
</template>

<script>
import { appMixin } from "../mixins/appMixin.js";
import store from "../store/index.js";
import NavMain from "../components/Navs/NavMain.vue";
import Footer from "../components/Footers/Footer.vue";

export default {
  name: "Training",
  mixins: [appMixin],
  components: {
    NavMain,
    Footer
  },
  created: function() {
    // this.isLoggedIn();
  },
  data: function() {
    return {
      dialog: false,
      loadingPage: true,
      isLogin: store.state.isLogin,
      serverUrl: store.state.urlStore.serverUrl,
      breadCrumbsData: []
    };
  }
};
</script>


<style scoped>
</style>