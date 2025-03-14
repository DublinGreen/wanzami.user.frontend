<template>
  <v-row justify="center">
    <section class="dt-login--container">
      <section class="dt-login__content-wrapper">
        <section class="dt-login__bg-section">
          <section class="dt-login__bg-content">
            <a
              href="#/Login"
              style="float: right;margin-right: -30px;margin-top: -40px;color: #fff"
            >
              <i class="fa fa-arrow-right"></i>
            </a>
            <h1 class="dt-login__title" style="margin-left: -15%;font-weight: 900">{{appName}}</h1>
            <p class="f-16">Login with your voters account.</p>
          </section>

          <section class="dt-login__logo"></section>
        </section>

        <section class="dt-login__content">
          <section class="dt-login__content-inner">
            <form>
              <v-row justify="center">
                <v-dialog v-model="dialogCallResponse" persistent max-width="290">
                  <v-card>
                    <v-alert v-show="showErrorIcon" dense text type="error">
                      Mobile and OTP combination incorrect
                      <strong>Failed</strong>
                    </v-alert>
                    <sweetalert-icon icon="error" v-show="showErrorIcon" />
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" text @click="dialogCallResponse = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>

              <v-dialog v-model="dialog" hide-overlay persistent width="300">
                <v-card color="green" dark>
                  <v-card-text>
                    Sending Request Please Stand By
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                  </v-card-text>
                </v-card>
              </v-dialog>

              <v-text-field
                v-model="mobile"
                :error-messages="mobileErrors"
                :counter="15"
                label="Mobile Number"
                required
                @input="$v.mobile.$touch()"
                @blur="$v.mobile.$touch()"
              ></v-text-field>

              <v-text-field
                :error-messages="otpErrors"
                v-model="otp"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="OTP"
                hint="your OTP"
                :counter="6"
                @input="$v.otp.$touch()"
                @blur="$v.otp.$touch()"
                @click:append="showPassword = !showPassword"
              ></v-text-field>

              <v-btn class="mr-4" @click="submit">Login</v-btn>
              <v-btn @click="clear">clear</v-btn>
            </form>
          </section>

          <section class="breadCrumbsBox">
            <v-breadcrumbs :items="breadCrumbsData" large></v-breadcrumbs>
          </section>
        </section>
      </section>
    </section>
  </v-row>
</template>

<script>
import store from "../store";
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "Login",
  created: function() {
    let tempToken = localStorage.getItem(store.state.setTokenLocalStorageKey);
    if (tempToken !== "") {
      // GOT TOKEN, SO USER HAS LOGIN BEFORE NOW
      // this.$router.push("ManageUsersCrud");
    } else {
      // DON'T HAVE TOKEN
      localStorage.setItem(store.state.setIsLoginLocalStorageKey, false);
      localStorage.setItem(store.state.setTokenLocalStorageKey, "");
    }
  },
  mixins: [validationMixin],
  validations: {
    mobile: { required, maxLength: maxLength(15) },
    otp: { required, maxLength: maxLength(50) }
  },
  data: () => ({
    appName: "Voters App",
    showPassword: false,
    showErrorIcon: false,
    dialog: false,
    dialogCallResponse: false,
    endpoint:
      store.state.urlStore.baseUrl + store.state.urlStore.voterUserLogin,
    mobile: "",
    otp: "",
    objectToSend: {
      mobileNumber: null,
      otp: null
    },
    breadCrumbsData: [
      {
        text: "INEC Login",
        disabled: false,
        href: "#/Login"
      },
      {
        text: "Voters Login",
        disabled: true,
        href: "#/LoginVoters"
      }
    ]
  }),
  computed: {
    mobileErrors() {
      const errors = [];
      if (!this.$v.mobile.$dirty) return errors;
      !this.$v.mobile.maxLength &&
        errors.push("Mobile must be no more than 15 characters long");
      //!this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.mobile.required && errors.push("Mobile is required");
      return errors;
    },
    otpErrors() {
      const errors = [];
      if (!this.$v.otp.$dirty) return errors;
      !this.$v.otp.maxLength &&
        errors.push("OTP must be no more than 10 characters long");
      !this.$v.otp.required && errors.push("otp is required.");
      return errors;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.dialog = true;
        let vmObjectInstance = this;
        this.objectToSend.mobileNumber = this.mobile;
        this.objectToSend.otp = this.otp;
        let headers = this.objectToSend;
        this.loginUrlCall(vmObjectInstance, headers);
      }
    },
    clear() {
      this.$v.$reset();
      this.$router.go(); // reloads the page
    },
    loginUrlCall(vmObjectInstance, headers) {
      axios
        .post(this.endpoint, headers)
        .then(function(response) {
          if (response.data.responseCode === store.state.successCode) {
            vmObjectInstance.dialog = false;

            localStorage.setItem(
              store.state.setIsLoginAsVoterLocalStorageKey,
              true
            );
            localStorage.setItem(
              store.state.setTokenLocalStorageKey,
              response.data.data.id
            );

            localStorage.setItem(
              store.state.setMobileLocalStorageKey,
              vmObjectInstance.mobile
            );

            localStorage.setItem(
              store.state.setOTPLocalStorageKey,
              vmObjectInstance.otp
            );

            setTimeout(() => {
              vmObjectInstance.$router.push("Dashboard");
            }, store.state.redirectTimeout);
          } else {
            vmObjectInstance.showErrorIcon = true;
            vmObjectInstance.dialog = false;
            vmObjectInstance.dialogCallResponse = true;
          }
        })
        .catch(function(error) {
          console.error(error);
          vmObjectInstance.showErrorIcon = true;
          vmObjectInstance.dialog = false;
          vmObjectInstance.dialogCallResponse = true;
        });
    }
  }
};
</script>


<style scoped>
.dt-login--container {
  margin-top: -5%;
}

.dt-login__bg-section {
  background-image: url(../../public/assets/images/login-background.jpg) !important;
  background-color: #28a745 !important;
}

.dt-login__bg-section:before {
  background-image: url(../../public/assets/images/login-background.jpg) !important;
  background-color: #28a745 !important;
}
</style>

