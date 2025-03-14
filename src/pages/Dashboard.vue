<template>
  <section>
    <NavMain />
    <v-content style="clear: both;padding: 2%;margin:0;width: 100%">
      <!-- <v-alert
        outlined
        type="warning"
        prominent
        border="left"
      >Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Suspendisse non nisl sit amet velit hendrerit rutrum. Nullam vel sem. Pellentesque dapibus hendrerit tortor.
      </v-alert>-->
      <h1 class="text-muted text-center" style="color: yellow; font-weight: bolder; font-size: 2em;">Welcome to {{appName}}</h1>
      <p class="text-muted text-center">What are we doing today?</p>
      <v-img
        v-bind:alt="appName"
        v-bind:title="appName"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="80%"
        style="margin-left: 50px;"
        src="../assets/dashboard2.png"
        width="200"
      />
    </v-content>
    <Footer />
  </section>
</template>

<script setup lang="ts">
  import NavMain from "../components/Navs/NavMain.vue";
  import Footer from "../components/Footers/Footer.vue";
  import { reactive } from 'vue';
  import { ref } from 'vue';
  import store from "@/store";
  import gql from 'graphql-tag';
  import { useVuelidate } from '@vuelidate/core'
  import { email, required } from '@vuelidate/validators'
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  const router = useRouter();

  const initialState = {
    password: '',
    email: '',
    leftDrawer: true,
  }

  const appName = store.state.appName;
  const isLogin = true;
  const leftDrawer = true;
  const isLoginAsVoter = true;
  const redirect = ref(true); // set true, if page should redirect to Dashboard
  const state = reactive({
    ...initialState,
  })

  const rules = {
    password: { required },
    email: { required, email },
  }

  const v$ = useVuelidate(rules, state)


  const GRAPHQL_ENDPOINT = store.state.tokenRequiredBackendUrl;

  async function fetchData() {

    const token = localStorage.getItem('token');
    
    const query = {
      query: `
        query FindAllAuthors {
            findAllAuthors {
                id
                name
                email
                telephone
                status
                age
            }
        }
      `,
    };

    try {
      const response = await axios.post(GRAPHQL_ENDPOINT, query, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('GraphQL query error:', error);
    }
  }

  fetchData();

</script>

<style scoped>
  .webBox{
    width: 100%;
  }
</style>
