<template>
  <v-row justify="center">
    <section class="dt-login--container" style="margin-top: 2%;">
      <br />
      <br />
      <section class="dt-login__content-wrapper">
        <section class="dt-login__bg-section">
          <section class="dt-login__bg-content">
            <a href="#/Login" style="float: left;margin-left: -40px;margin-top: -40px;color: #fff">
              <i class="fa fa-arrow-left"></i>
            </a>
            <h1 class="dt-login__title" style="margin-left: -15%;font-weight: 900">{{appName}}</h1>
            <p class="f-16">Signup for a {{appName}} Account.</p>
          </section>

          <section class="dt-login__logo">
            <!-- <a class="dt-brand__logo-link" href="#" style="background-color: #333; padding: 8%;border-radius: 5%;margin-left: -13%;opacity: 0.9">
                        <img class="img img-responsive dt-brand__logo-img" src="/assets/images/corporate-setup-logo.png" v-bind:alt="appName" style="width: 180px;border-radius: 10px;box-shadow: 3px 3px 3px #333333;">
            </a>-->
          </section>
        </section>

        <section class="dt-login__content">
          <section class="dt-login__content-inner">
            <form>
              <v-row justify="center">
                <v-dialog v-model="dialogCallResponse" persistent max-width="290">
                  <v-card>
                    <v-alert v-show="showErrorIcon" dense text type="warning">
                      Error(s) with signup :
                      <strong>{{serverReturnedErrors}}</strong>
                    </v-alert>
                    <sweetalert-icon icon="warning" v-show="showErrorIcon" />
                  </v-card>

                  <v-card>
                    <v-alert v-show="showSuccessIcon" dense text type="success">
                      An email verfication link has been sent to
                      <strong>({{email}})</strong>
                    </v-alert>
                    <sweetalert-icon icon="success" v-show="showSuccessIcon" />
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
                v-model="firstName"
                :error-messages="firstNameErrors"
                :counter="100"
                label="First Name"
                required
                @input="$v.firstName.$touch()"
                @blur="$v.firstName.$touch()"
              ></v-text-field>

              <v-text-field
                v-model="middleName"
                :error-messages="firstNameErrors"
                :counter="100"
                label="Middle Name"
                required
                @input="$v.firstName.$touch()"
                @blur="$v.firstName.$touch()"
              ></v-text-field>

              <v-text-field
                v-model="lastName"
                :error-messages="lastNameErrors"
                :counter="100"
                label="Last Name"
                required
                @input="$v.lastName.$touch()"
                @blur="$v.lastName.$touch()"
              ></v-text-field>

              <v-select v-model="sex" :items="sexOptions" :error-messages="sexErrors" label="Sex"></v-select>

              <v-text-field v-model="age" s :counter="100" label="Age" required></v-text-field>

              <v-text-field v-model="mobile" s :counter="50" label="Mobile Number" required></v-text-field>

              <v-menu
                ref="menu"
                v-model="dateOfBirthMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateOfBirth"
                    :error-messages="dateOfBirthErrors"
                    label="Date Of Birth"
                    prepend-icon
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateOfBirth" no-title :min="nowDate" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>

              <v-text-field v-model="state" :counter="150" label="State" required></v-text-field>

              <img
                class="img img-responsive dt-brand__logo-img"
                :src="scannedFingerSrc"
                v-bind:alt="appName"
                style="width: 180px;border-radius: 10px;box-shadow: 3px 3px 3px #333333;"
              />
              <br />
              <v-btn class="mr-4" style="margin-left: 20px;" @click="captureFP">Scan</v-btn>

              <br />
              <hr />

              <v-checkbox
                v-model="termsAndConditions"
                :error-messages="termsAndConditionsErrors"
                label="Do you agree to our terms and conditions?"
                required
                @change="$v.termsAndConditions.$touch()"
                @blur="$v.termsAndConditions.$touch()"
              ></v-checkbox>

              <v-btn class="mr-4" @click="submit">Signup</v-btn>
              <v-btn @click="clear">clear</v-btn>
            </form>
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
import { required, maxLength, email } from "vuelidate/lib/validators";

export default {
  name: "Login",
  created: function() {
    let tempToken = localStorage.getItem(store.state.setTokenLocalStorageKey);
    if (tempToken !== "") {
      // GOT TOKEN, SO USER HAS LOGIN BEFORE NOW
      this.$router.push("ManageUsersCrud");
    } else {
      // DON'T HAVE TOKEN
      localStorage.setItem(store.state.setIsLoginLocalStorageKey, false);
      localStorage.setItem(store.state.setTokenLocalStorageKey, "");
    }
  },
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(100) },
    email: { required, maxLength: maxLength(100), email },
    phone: { required, maxLength: maxLength(50) },
    password: { required, maxLength: maxLength(50) },
    confirmPassword: { required, maxLength: maxLength(50) },
    termsAndConditions: { required }
  },
  data: () => ({
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
    age: "",
    mobile: "",
    dateOfBirth: "",

    appName: store.state.appName,
    interviewDate: "",
    interviewTime: null,
    dateOfBirthMenu: false,
    showPassword: false,
    confirmShowPassword: false,
    showErrorIcon: false,
    showSuccessIcon: false,
    dialog: false,
    dialogCallResponse: false,
    sexOptions: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" }
    ],
    endpoint: store.state.urlStore.baseUrlAuth + store.state.urlStore.signupUrl,
    scanFingerUrl: store.state.urlStore.scanFingerUrl,
    scannedFingerData: null,
    scannedFingerSrc: "/assets/images/PlaceFinger.bmp",
    // name: "Cliquedom",
    // email: "greendublin007@gmail.com",
    // password: "1234567",
    // phone: "+2347032090809",
    // confirmPassword: "1234567",
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
    termsAndConditions: null,
    serverReturnedErrors: null,
    objectToSend: {
      name: null,
      email: null,
      password: null,
      phone: null
    }
  }),
  computed: {
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.maxLength &&
        errors.push("First Name must be no more than 100 characters long");
      !this.$v.firstName.required && errors.push("First Name is required");
      return errors;
    },
    middleNameErrors() {
      const errors = [];
      if (!this.$v.middleName.$dirty) return errors;
      !this.$v.middleName.maxLength &&
        errors.push("Middle Name must be no more than 100 characters long");
      !this.$v.middleName.required && errors.push("Middle Name is required");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.maxLength &&
        errors.push("Last Name must be no more than 100 characters long");
      !this.$v.lastName.required && errors.push("Last Name is required");
      return errors;
    },
    ageErrors() {
      const errors = [];
      if (!this.$v.age.$dirty) return errors;
      !this.$v.age.required && errors.push("Age is required");
      return errors;
    },
    sexErrors() {
      const errors = [];
      if (!this.$v.sex.$dirty) return errors;
      !this.$v.sex.required && errors.push("Sex is required");
      return errors;
    },
    dateOfBirthErrors() {
      const errors = [];
      if (!this.$v.dateOfBirth.$dirty) return errors;
      !this.$v.dateOfBirth.required && errors.push("Date Of Birth is required");
      return errors;
    },
    termsAndConditionsErrors() {
      const errors = [];
      if (!this.$v.termsAndConditions.$dirty) return errors;
      !this.$v.termsAndConditions.required &&
        errors.push("Must accept terms and conditions");
      return errors;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.dialog = true;
        let vmObjectInstance = this;
        this.objectToSend.name = this.name;
        this.objectToSend.password = this.password;
        this.objectToSend.email = this.email;
        this.objectToSend.phone = this.phone;
        let headers = this.objectToSend;

        this.dialogCallResponse = true;
        this.showErrorIcon = false;
        this.showSuccessIcon = false;
        this.signupUrlCall(vmObjectInstance, headers);
      }
    },
    clear() {
      this.$v.$reset();
      this.$router.go(); // reloads the page
    },
    signupUrlCall(vmObjectInstance, headers) {
      axios
        .post(this.endpoint, headers)
        .then(function(response) {
          vmObjectInstance.dialog = false;

          if (response.data.status) {
            vmObjectInstance.dialogCallResponse = true;
            vmObjectInstance.showSuccessIcon = true;
            vmObjectInstance.showErrorIcon = false;

            setTimeout(() => {
              this.$v.$reset();
            }, store.state.alertLongTimeout);
          } else {
            vmObjectInstance.dialogCallResponse = true;
            vmObjectInstance.showErrorIcon = true;
            vmObjectInstance.showSuccessIcon = false;

            vmObjectInstance.serverReturnedErrors = `${response.data.errors.email}  ${response.data.errors.name}`;
          }
        })
        .catch(function(error) {
          console.error(error);
          vmObjectInstance.dialog = false;
          vmObjectInstance.dialogCallResponse = true;
        });
    },
    captureFP() {
      this.CallSGIFPGetData(this.SuccessFunc, this.ErrorFunc);
    },
    SuccessFunc(result) {
      if (result.ErrorCode == 0) {
        /* 	Display BMP data in image tag
              BMP data is in base 64 format 
          */
        if (result != null && result.BMPBase64.length > 0) {
          this.scannedFingerData = result;
          this.scannedFingerSrc = "data:image/bmp;base64," + result.BMPBase64;
        }
        // var tbl = "<table border=1>";
        // tbl += "<tr>";
        // tbl += "<td> Serial Number of device </td>";
        // tbl += "<td> <b>" + result.SerialNumber + "</b> </td>";
        // tbl += "</tr>";
        // tbl += "<tr>";
        // tbl += "<td> Image Height</td>";
        // tbl += "<td> <b>" + result.ImageHeight + "</b> </td>";
        // tbl += "</tr>";
        // tbl += "<tr>";
        // tbl += "<td> Image Width</td>";
        // tbl += "<td> <b>" + result.ImageWidth + "</b> </td>";
        // tbl += "</tr>";
        // tbl += "<tr>";
        // tbl += "<td> Image Resolution</td>";
        // tbl += "<td> <b>" + result.ImageDPI + "</b> </td>";
        // tbl += "</tr>";
        // tbl += "<tr>";
        // tbl += "<td> Image Quality (1-100)</td>";
        // tbl += "<td> <b>" + result.ImageQuality + "</b> </td>";
        // tbl += "</tr>";
        // tbl += "<tr>";
        // tbl += "<td> NFIQ (1-5)</td>";
        // tbl += "<td> <b>" + result.NFIQ + "</b> </td>";
        // tbl += "</tr>";
        // tbl += "<tr>";
        // tbl += "<td> Template(base64)</td>";
        // tbl += "<td> <b> <textarea rows=8 cols=50>" + result.TemplateBase64 + "</textarea></b> </td>";
        // tbl += "</tr>";
        // tbl += "<tr>";
        // tbl += "<td> Image WSQ Size</td>";
        // tbl += "<td> <b>" + result.WSQImageSize + "</b> </td>";
        // tbl += "</tr>";
        // tbl += "<tr>";
        // tbl += "<td> EncodeWSQ(base64)</td>";
        // tbl += "<td> <b> <textarea rows=8 cols=50>" + result.WSQImage + "</textarea></b> </td>";
        // tbl += "</tr>";
        // tbl += "</table>";
        //document.getElementById('result').innerHTML = tbl;
      } else {
        //alert("Fingerprint Capture Error Code:  " + result.ErrorCode + ".\nDescription:  " + ErrorCodeToString(result.ErrorCode) + ".");
      }
    },
    ErrorFunc(status) {
      /* 	
            If you reach here, user is probabaly not running the 
            service. Redirect the user to a page where he can download the
            executable and install it. 
        */
      alert("Check if SGIBIOSRV is running; Status = " + status + ":");
    },
    CallSGIFPGetData(successCall, failCall) {
      // 8.16.2017 - At this time, only SSL client will be supported.
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          let fpobject = JSON.parse(xmlhttp.responseText);
          successCall(fpobject);
        } else if (xmlhttp.status == 404) {
          failCall(xmlhttp.status);
        }
      };
      var params = "Timeout=" + "10000";
      params += "&Quality=" + "50";
      // params += "&licstr=" + encodeURIComponent(secugen_lic);
      params += "&templateFormat=" + "ISO";
      params += "&imageWSQRate=" + "0.75";
      console.log;
      xmlhttp.open("POST", this.scanFingerUrl, true);
      xmlhttp.send(params);

      xmlhttp.onerror = function() {
        failCall(xmlhttp.statusText);
      };
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

