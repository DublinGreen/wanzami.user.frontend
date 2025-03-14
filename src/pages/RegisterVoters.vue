<template>
  <div class="create-vendor container">
    <NavMain />
    <section class="breadCrumbsBox">
      <v-breadcrumbs :items="breadCrumbsData" large></v-breadcrumbs>
    </section>
    <div style="clear:both;"></div>
    <h1>Register Voters</h1>
    <div class="clearfix"></div>

    <form>
      <v-row justify="center">
        <v-dialog v-model="dialogCallResponse" persistent max-width="290">
          <v-card>
            <v-alert v-show="showSuccessIcon" dense text type="success">
              {{responseMessage}}
              <strong>Success</strong>
            </v-alert>
            <sweetalert-icon icon="success" v-show="showSuccessIcon" />
            <v-alert v-show="showErrorIcon" dense text type="error">
              Error While Creating voter
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
      <sweetalert-icon icon="loading" v-show="showLoadingIcon" />
      <sweetalert-icon icon="success" v-show="showSuccessIcon" />
      <v-alert v-show="showSuccessIcon" dense text type="success">
        {{responseMessage}}
        <strong>Success</strong>
      </v-alert>
      <sweetalert-icon icon="error" v-show="showErrorIcon" />
      <v-alert v-show="showErrorIcon" dense text type="error">
        Error with voter registration (Finger print is required)
        <!-- <strong>Failed</strong> -->
      </v-alert>

      <v-container class="grey lighten-5">
        <v-row justify="center">
          <v-dialog v-model="dialogCallResponse" persistent max-width="290">
            <v-card>
              <v-alert v-show="showErrorIcon" dense text type="warning">
                Error(s) with voters signup :
                <strong>{{serverReturnedErrors}}</strong>
              </v-alert>
              <sweetalert-icon icon="warning" v-show="showErrorIcon" />
            </v-card>

            <v-card>
              <v-alert v-show="showSuccessIcon" dense text type="success">
                {{responseMessage}}
                <!-- <strong>({{email}})</strong> -->
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

        <v-row>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
              <v-text-field
                v-model="firstName"
                :error-messages="firstNameErrors"
                :counter="100"
                label="First Name"
                required
                @input="$v.firstName.$touch()"
                @blur="$v.firstName.$touch()"
              ></v-text-field>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
              <v-text-field v-model="middleName" :counter="100" label="Middle Name"></v-text-field>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
              <v-text-field
                v-model="lastName"
                :error-messages="lastNameErrors"
                :counter="100"
                label="Last Name"
                required
                @input="$v.lastName.$touch()"
                @blur="$v.lastName.$touch()"
              ></v-text-field>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
              <v-select v-model="sex" :items="sexOptions" :error-messages="sexErrors" label="Sex"></v-select>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
              <v-text-field
                v-model="age"
                :error-messages="ageErrors"
                :counter="100"
                label="Age"
                required
                @input="$v.age.$touch()"
                @blur="$v.age.$touch()"
              ></v-text-field>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
              <v-text-field
                v-model="mobile"
                :error-messages="mobileErrors"
                :counter="100"
                label="Mobile Number"
                required
                @input="$v.mobile.$touch()"
                @blur="$v.mobile.$touch()"
              ></v-text-field>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
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
                <v-date-picker v-model="dateOfBirth" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(dateOfBirth)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
              <v-text-field
                v-model="state"
                :error-messages="stateErrors"
                :counter="100"
                label="State"
                required
                @input="$v.state.$touch()"
                @blur="$v.state.$touch()"
              ></v-text-field>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-card class="pa-2" outlined tile>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                :counter="250"
                label="Email"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>
            </v-card>
          </v-col>
          <v-col cols="6"></v-col>
        </v-row>

        <p class="text-muted">Right index finger</p>
        <img
          class="img img-responsive dt-brand__logo-img"
          :src="scannedFingerSrc"
          v-bind:alt="appName"
          height="300"
          width="310"
          style="width: 180px;border-radius: 10px;box-shadow: 3px 3px 3px #333333;"
        />

        <p class="text-center">
          <v-badge :color="scanColor" :content="scanQuality">Scan Quality</v-badge>
        </p>

        <v-btn color="green" class="mr-4" style="margin-left: 20px;" @click="captureFP">
          <i class="fa fa-user"></i>&nbsp;
          Scan
        </v-btn>

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
      </v-container>
      <div style="clear:both;"></div>
      <br />

      <v-btn color="green" style="color: #ffffff" class="mr-4" @click="submit">
        <i class="fa fa-folder"></i>&nbsp; Submit
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </form>

    <Footer />
  </div>
</template>

<script>
import store from "../store";
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
import { appMixin } from "../mixins/appMixin.js";
import NavMain from "../components/Navs/NavMain.vue";
import Footer from "../components/Footers/Footer.vue";

export default {
  name: "RegisterVoters",
  components: {
    NavMain,
    Footer
  },
  created: function() {
    this.isLoggedIn();
  },
  mixins: [validationMixin, appMixin],
  validations: {
    firstName: { required, maxLength: maxLength(50) },
    lastName: { required, maxLength: maxLength(50) },
    email: { required, email, maxLength: maxLength(250) },
    sex: { required, maxLength: maxLength(50) },
    age: { required, maxLength: maxLength(50) },
    state: { required, maxLength: maxLength(50) },
    mobile: { required, maxLength: maxLength(50) },
    dateOfBirth: { required, maxLength: maxLength(50) },
    termsAndConditions: { required }
  },
  data: () => ({
    responseMessage: "",
    breadCrumbsData: [
      {
        text: "Register Voter",
        disabled: false,
        href: "#/ManageVotersCrud"
      },
      {
        text: "Manage Voters",
        disabled: true,
        href: "#/"
      }
    ],
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
    email: "",
    state: "",
    age: "",
    mobile: "",
    dateOfBirth: "",
    scanColor: "",
    scanQuality: 0,
    appName: store.state.appName,
    dateOfBirthMenu: false,
    showErrorIcon: false,
    showSuccessIcon: false,
    dialog: false,
    dialogCallResponse: false,
    sexOptions: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" }
    ],
    endpoint:
      store.state.urlStore.baseUrl + store.state.urlStore.voterRegistrationUrl,
    scanFingerUrl: store.state.urlStore.scanFingerUrl,
    scannedFingerData: null,
    scannedFingerSrc: "/assets/images/PlaceFinger.bmp",
    scanQualityMinimum: 60,
    termsAndConditions: null,
    serverReturnedErrors: null,
    showLoadingIcon: false,
    objectToSend: {
      firstName: null,
      middleName: null,
      email: null,
      surname: null,
      mobileNumber: null,
      gender: null,
      age: 0,
      dateOfBirth: null,
      state: null,
      fingerPrint: null
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
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.maxLength &&
        errors.push("Email must be no more than 250 characters long");
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("Email is required");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      // !this.$v.lastName.maxLength &&
      //   errors.push("Last Name must be no more than 100 characters long");
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
    mobileErrors() {
      const errors = [];
      if (!this.$v.mobile.$dirty) return errors;
      !this.$v.mobile.required && errors.push("Mobile is required");
      return errors;
    },
    stateErrors() {
      const errors = [];
      if (!this.$v.state.$dirty) return errors;
      !this.$v.state.required && errors.push("State is required");
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

      if (this.scannedFingerData === null) {
        this.showErrorIcon = true;
        this.serverReturnedErrors = `Not finger print`;
      } else {
        this.showErrorIcon = false;
      }

      if (!this.$v.$invalid) {
        const [year, month, day] = this.dateOfBirth.split("-");
        this.dateOfBirth = `${day}-${month}-${year}`;

        this.dialog = true;
        let vmObjectInstance = this;
        this.objectToSend.firstName = this.firstName;
        this.objectToSend.middleName = this.middleName;
        this.objectToSend.surname = this.lastName;
        this.objectToSend.gender = this.sex;
        this.objectToSend.email = this.email;
        this.objectToSend.age = this.age;
        this.objectToSend.dateOfBirth = this.dateOfBirth;
        this.objectToSend.mobileNumber = this.mobile;
        this.objectToSend.state = this.state;
        this.objectToSend.fingerPrint = this.scannedFingerData.TemplateBase64;
        let headers = this.objectToSend;
        console.log("headers >>> ", headers);

        this.dialogCallResponse = false;
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

          if (response.data.responseCode === store.state.successCode) {
            vmObjectInstance.responseMessage = response.data.responseMessage;
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

            // vmObjectInstance.serverReturnedErrors = `${response.data.errors.email}  ${response.data.errors.name}`;
          }
        })
        .catch(function(error) {
          console.error(error);
          vmObjectInstance.dialog = false;
          vmObjectInstance.dialogCallResponse = true;
          vmObjectInstance.showErrorIcon = false;
          vmObjectInstance.showSuccessIcon = false;
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
          this.scanQuality = this.scannedFingerData.ImageQuality;
          if (this.scanQuality >= this.scanQualityMinimum) {
            this.scanColor = "green";
          } else {
            this.scanColor = "red";
          }
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
</style>
