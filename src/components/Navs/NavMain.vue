<template>
  <nav>
    <v-navigation-drawer v-if="toogleDrawer" app>
      <v-list dense active-class="border">
        <v-list-item class="leftNavs">
          <v-list-item-action>
            <router-link to="/Dashboard">
              <i class="fa fa-home fa-4x iconlight"></i>
            </router-link>
          </v-list-item-action>
          <!--<v-list-item-content>
            <router-link style="float: right; margin-top: -40px; margin-right: 100px;" class="leftNavText" to="/Dashboard">Dashboard </router-link>
          </v-list-item-content>-->
        </v-list-item>
        <v-list-item class="leftNavs">
          <v-list-item-content>
            <v-list-item-title class="leftNavText">
              <router-link to="/ManageAuthors">
                Authors
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="leftNavs">
          <v-list-item-content>
            <v-list-item-title class="leftNavText">
              <router-link to="/ManageCountries">
                Countries
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="leftNavs" v-show="isLogin">
          <v-list-item-action>
            <router-link to="/ManageUsers">
            </router-link>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="leftNavText">
              <router-link to="/ManageUsers">
                Users
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="leftNavs" v-show="isLoginAsVoter">
          <v-list-item-action>
            <router-link to="/Elections">
              <i class="fas fa-box-open fa-4x iconlight"></i>
            </router-link>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="leftNavText">
              <router-link to="/Elections">Elections</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="leftNavs">
          <v-list-item-action>
            <router-link to="/Reports">
              <i class="fas fa-chart-bar fa-4x iconlight"></i>
            </router-link>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="leftNavText">
              <router-link to="/Reports">Reports</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="leftNavs" @click="logout">
          <v-list-item-action>
            <i class="fa fa-power-off fa-4x iconlight"></i>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#e05307" dark>
      <v-app-bar-nav-icon @click="toogleLeftDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ appName }} Backend Application</v-toolbar-title>
    </v-app-bar>
  </nav>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { reactive } from 'vue'
  // @ts-ignore
  import store from "@/store/index.js"
  import { useRouter } from 'vue-router'
  import {onMounted } from 'vue'
  import axios from 'axios'

  const router = useRouter();

  const GRAPHQL_ENDPOINT = store.state.noTokenRequiredBackendUrl;

  onMounted(async () => {
      if(localStorage.getItem('token') == ""){
        if(redirect.value){
          router.push('/');
        }
      }
  });

  const initialState = {
    password: '',
    email: '',
    leftDrawer: true,
  }

  const appName = store.state.appName;
  const toogleDrawer = ref<boolean>(true);
  const isLogin = true;
  const isLoginAsVoter = true;
  const redirect = ref(true); // set true, if page should redirect to Dashboard
  const state = reactive({
    ...initialState,
  })

  async function logoutRequest(token: string) {
    const mutation = `
      mutation Logout($token: String!) {
          logout(token: $token)
      }
    `;

    try {
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: mutation,
          variables: { token },
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      return response.data;
      console.log(response);
    } catch (error) {
      console.error("GraphQL Mutation Logout Error:", error);
    }
  }

  async function logout () {
    if (confirm("Are you sure you want to logout?")) {

      try {
        const token = localStorage.getItem("token") ?? '';
        const response = await logoutRequest(token);
        
        if(response?.data.logout){
          localStorage.setItem("token", "");
        }

      } catch (error) {
        console.log(error);
      } finally {
        
        store.dispatch('setToken', "");
        localStorage.setItem("token", "");

        if(redirect.value){
          router.push('/');
        }
      }
    }
  }

  function toogleLeftDrawer () {
      // alert(toogleDrawer.value);
      toogleDrawer.value = !toogleDrawer.value;
      store.dispatch('toogleLeftDrawer', !state.leftDrawer);
  }

</script>

<style scoped>
nav {
  /* border: 5px solid #ff0000; */
  box-shadow: 3px 0px 3px #333333;
}

.leftNavs {
  background-color: #e05307;
  color: #ffffff;
  margin-bottom: 10px;
}

.leftNavs:hover {
  box-shadow: 5px 5px 5px #333333;
  border: 1px dotted #ffffff;
}

.leftNavText{
  font-size: 2em;
  font-weight: bolder;
  color: #fff;
}

.leftNavText:hover {
  color: #ffff00;
}

.iconlight {
  color: #ffffff;
}

.iconlight:hover {
  color: #ffff00;
}

.footerBox{
  background-color: #e05307;
}
</style>