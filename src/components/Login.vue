<template>
  <section id="page">
    <v-row justify="center">
      <section class="dt-login--container loginBox">
        <section class="dt-login__content-wrapper">
          <section class="dt-login__bg-section">
            <section class="dt-login__bg-content">
              <img 
                class="h-auto max-w-lg rounded-lg loginImg" 
                src="../../assets/logo_small.png" 
                alt="{{appName}}" 
              >
              <p class="f-16 text-center text-gray-500">
                Login with a 
                {{appName}} 
                Admin account.
              </p><br>
            </section>
            <section 
              class="dt-login__logo"
            />
          </section>

          <section class="dt-login__content">
            <section class="dt-login__content-inner">
              <v-alert
                v-if="loginWarning"
                outlined
                type="warning"
                prominent
              >
                Invalid combination or not an admin user.
              </v-alert>
              <br>  
              <form>
                <v-text-field
                  v-model="state.email"
                  :error-messages="v$.email.$errors.map(e => e.$message)"
                  class="f-16 text-gray-900"
                  label="E-mail"
                  required
                  @blur="v$.email.$touch"
                  @input="v$.email.$touch"
                />

                <v-text-field
                  v-model="state.password"
                  :error-messages="v$.password.$errors.map(e => e.$message)"
                  class="f-16 text-gray-900"
                  label="Password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  @click:append="showPassword = !showPassword"
                  @blur="v$.password.$touch"
                  @input="v$.password.$touch"
                />

                <br>
                <v-btn 
                  class="me-4 float-right"
                  @click="clear"
                >
                  clear
                </v-btn>
                s
                <v-btn
                  class="me-4 mainButton float-right"
                  @click="submit"
                >
                  submit
                </v-btn>

                <section 
                  v-if="loading" 
                  class="f-16 text-center text-gray-500 me-4 float-right">
                  <img 
                    class="loadingGif" 
                    src="../../assets/orange_circles.gif" 
                    alt="loading"
                  >
                </section>
              </form>
            </section>
          </section>
        </section>
      </section>
    </v-row>  
  </section>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { reactive } from 'vue'
  // @ts-ignore
  import store from "@/store/index.js"
  import { useVuelidate } from '@vuelidate/core'
  import { email, required } from '@vuelidate/validators'
  import { useRouter } from 'vue-router'
  import {onMounted } from 'vue'
  import axios from 'axios'

  const router = useRouter();

  const GRAPHQL_ENDPOINT = store.state.noTokenRequiredBackendUrl;

  onMounted(async () => {
      if(localStorage.getItem('token')){
        if(redirect.value){
          router.push('Dashboard');
        }
      }
  });

  const initialState = {
    password: '',
    email: '',
  };

  const appName = store.state.appName;
  const showPassword = ref(false);
  const loginWarning = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const redirect = ref(true); // set true, if page should redirect to Dashboard
  const state = reactive({
    ...initialState,
  })

  const rules = {
    password: { required },
    email: { required, email },
  }

  const v$ = useVuelidate(rules, state)

  function clear () {
    v$.value.$reset()

    for (const [key, value] of Object.entries(initialState)) {
      state[key] = value
    }
    loading.value = false;
    loginWarning.value = false;
  }

  async function loginUser(email: string, password: string) {
      const mutation = `
      mutation LoginAdmin($email: String!, $password: String!) {
        loginAdmin(email: $email, password: $password)
      }
    `;

    try {
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: mutation,
          variables: { email, password },
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("GraphQL Mutation Login Error:", error);
    }
  }

  async function submit () {
    loading.value = true;
    try {

      const response = await loginUser(state.email, state.password);
      
      if(response?.data?.loginAdmin){
        clear();
        store.dispatch('setToken', response.data.loginAdmin);
        localStorage.setItem("token", response.data.loginAdmin);
      }else{
        loginWarning.value = true;
      }

      setTimeout(() => {
        if(redirect.value){
          router.push('Dashboard');
        }
      }, store.state.redirectTimeout);
    } catch (error) {
      loginWarning.value = true;
      console.log(error);
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped>

.loadingGif{
  width: 40px;
}

.loginImg{
  margin: auto; margin-top: 2%;
}

.loginBox{
  background-color: #FAF9F6; border-radius: 10px; padding: 1%; opacity: 0.8; width: 500px;
}

.mainButton{
  background-color: #e05307;
}

#page{
  background-color: hsl(134, 61%, 41%) !important;
  background-image: url(../../assets/images/background.jpg) !important;
  background-repeat: no-repeat;
  height: 100%;
  background-position: center;
  background-size: cover;
  display: block;
  height: 100%;
  width: 100%;
  padding-top: 20%;
}

.dt-login--container {
  margin-top: -9%;
}

.dt-login__bg-section {
  /* background-image: url(../../assets/images/login-background.jpg) !important; */
  /* background-color: #28a745 !important; */
}

.dt-login__bg-section:before {
  background-image: url(../../assets/images/login-background.jpg) !important;
  background-color: #28a745 !important;
}
</style>

