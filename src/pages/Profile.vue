<template>
  <section style="width: 100%;background-color: #f5f8fb;border-radius: 10px;">
    <NavMain />
      <v-content style="clear: both;padding: 2%;margin:0;width: 96%;margin:1% 1%;background-color:#fff;">
            <section class="breadCrumbsBox">
              <v-breadcrumbs :items="breadCrumbsData" large></v-breadcrumbs>
            </section>
            <section class="clearfix"></section>
            <br />
            
            <section id="profileBox">
              <h3 style="font-weight: bolder;text-align:left;">Profile 
                <i @click="editProfile()" class="fa fa-edit" style="margin-right: 10px;"></i></h3>
              <div style="width: 15%;float:left;">
                <img style="border-radius: 50%" :src="require('../assets/male.jpeg')" :alt="userData.name" :title="userData.name" width="150px"/>
              </div>
              <div style="width: 30%;float:left;">
                <p style="color:#00ff00;font-weight: bold"><i class="fa fa-power-off" style="margin-right: 10px;"></i> Active</p>
                <p><i class="fas fa-user" style="margin-right: 10px;"></i> {{userData.name}}</p>
                <p><i class="fa fa-envelope" style="margin-right: 10px;"></i> {{userData.email}}</p>
                <p><i class="fa fa-phone" style="margin-right: 10px;"></i> {{userData.phone}}</p>
                <p><i class="fa fa-globe" style="margin-right: 10px;"></i> {{userData.website}}</p>
              </div>
              <div style="width: 50%;float:left;">
                <p>{{userData.about}}</p>
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
  name: "Profile",
  mixins: [profileMixin],
  components: {
    NavMain,
    Footer
  },
  created: function() {
    let tempToken = localStorage.getItem(store.state.setTokenLocalStorageKey);
    if (tempToken === "") {
      //GOT TOKEN
      this.$router.push("/#");
    }

    let vmObjectInstance = this;

    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          store.state.setTokenLocalStorageKey
        )}`
      }
    };

    let dataToSend = {
      email: localStorage.getItem(store.state.setEmailLocalStorageKey)
    };
    console.log(localStorage.getItem(
          store.state.setTokenLocalStorageKey
        ));

    axios
      .post(this.endpoint, dataToSend, config)
      .then(function(response) {
        if (response.data.status) {
            vmObjectInstance.userData = response.data.data;
            vmObjectInstance.profileName = vmObjectInstance.userData.name;
            vmObjectInstance.breadCrumbsData = 
            [
            {
                text: "Edit Profile",
                disabled: false,
                href: "#/EditProfile/" + vmObjectInstance.profileName
              },
              {
                text: "View Profile",
                disabled: true,
                href: "#/"
              }
            ]
        }else{
          vmObjectInstance.logout();
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
      userData: "",
      profileName: "",
      endpoint:
        store.state.urlStore.baseUrl + store.state.urlStore.getUserByEmailUrl,
      breadCrumbsData: [
        {
          text: "Edit Profile",
          disabled: false,
          href: "#/EditProfile/" + this.profileName
        },
        {
          text: "View Profile",
          disabled: true,
          href: "#/"
        }
      ]
    };
  },
  methods: {
    editProfile() {
      // this.$router.push(this.breadCrumbsData[0].href);
      // window.open(this.breadCrumbsData[0].href); // open in new tab
      location.replace(this.breadCrumbsData[0].href);
    }
  }
  
};
</script>


<style scoped>
  #profileBox{
    clear: both;
  }


  #profileBox p{
    float: left;
    width: 100%;
    text-align: left;
  }
</style>