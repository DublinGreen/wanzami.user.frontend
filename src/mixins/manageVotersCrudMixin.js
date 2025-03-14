import axios from "axios";
import store from "../store";

export const manageVotersCrudMixin = {
  data() {
    return {
      showLoadingIcon: false,
      showSuccessAlert: false,
      showErrorAlert: false,
      search: "",
      dataRecords: null,
      recordsToDisplay: [],
      singleRecord: null,
      dialog: false,
      userData: null,
      headers: [
        {
          text: "First Name",
          align: "start",
          sortable: true,
          value: "firstName"
        },
        {
          text: "Middle Name",
          sortable: true,
          value: "middleName"
        },
        {
          text: "Last Name",
          sortable: true,
          value: "surname"
        },
        {
          text: "Mobile Number",
          sortable: true,
          value: "mobileNumber"
        },
        {
          text: "Gender",
          sortable: true,
          value: "gender"
        },
        {
          text: "Date Of Birth",
          sortable: true,
          value: "dateOfBirth"
        },
        {
          text: "State",
          sortable: true,
          value: "state"
        },
        {
          text: "Finger Print",
          sortable: true,
          value: "fingerPrint"
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false
        }
      ],
      editedIndex: -1,
      editedItem: {
        name: "",
        score: 0
      }
    };
  },
  computed: {
    formTitle() {
      return "Validate User";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.recordsToDisplay.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      // let vmObjectInstance = this;
      this.showLoadingIcon = true;
      // console.log(this.scannedFingerData);
      // console.log(this.editedItem);

      if (this.scannedFingerData !== null) {
        this.template_1 = this.editedItem.fingerPrint;
        this.template_2 = this.scannedFingerData.TemplateBase64;
        this.matchScore(this.succMatch, this.failureFunc);
      } else {
        this.showLoadingIcon = false;
      }
    },
    validateVoter() {
      let vmObjectInstance = this;

      if (
        this.fingersMatch &&
        this.returnMatchScore >= this.minimumMatchScore
      ) {
        let dataToSend = {
          mobileNumber: this.editedItem.mobileNumber,
          imageQuality: this.returnMatchScore
        };

        axios
          .post(this.endpointValidateVoter, dataToSend)
          .then(function(response) {
            console.log(response.data);
            if (response.data.responseCode === store.state.successCode) {
              vmObjectInstance.showLoadingIcon = false;
              vmObjectInstance.showSuccessAlert = true;

              setTimeout(() => {
                vmObjectInstance.showSuccessAlert = false;
              }, store.state.alertTimeout);
            }
          })
          .catch(function(error) {
            console.error(error);
            vmObjectInstance.showLoadingIcon = false;
            vmObjectInstance.showErrorAlert = true;

            setTimeout(() => {
              vmObjectInstance.showErrorAlert = false;
            }, store.state.alertTimeout);
          });

        if (this.editedIndex > -1) {
          Object.assign(
            this.recordsToDisplay[this.editedIndex],
            this.editedItem
          );
        } else {
          this.recordsToDisplay.push(this.editedItem);
        }
      }

      this.close();
    },
    matchScore(succFunction, failFunction) {
      if (this.template_1 == "" || this.template_2 == "") {
        // alert("Please scan two fingers to verify!!");
        alert("No finger prints to compare.");
        return;
      }
      var uri = this.scanFingerBase + "SGIMatchScore";

      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          let fpobject = JSON.parse(xmlhttp.responseText);
          succFunction(fpobject);
        } else if (xmlhttp.status == 404) {
          failFunction(xmlhttp.status);
        }
      };

      xmlhttp.onerror = function() {
        failFunction(xmlhttp.status);
      };

      // alert(this.template_1);
      var params = "template1=" + encodeURIComponent(this.template_1);
      params += "&template2=" + encodeURIComponent(this.template_2);
      // params += "&licstr=" + encodeURIComponent(secugen_lic);
      params += "&templateFormat=" + "ISO";
      xmlhttp.open("POST", uri, false);
      xmlhttp.send(params);
    },
    succMatch(result) {
      if (result.ErrorCode == 0) {
        if (result.MatchingScore >= this.minimumMatchScore) {
          this.fingersMatch = true;
          this.returnMatchScore = result.MatchingScore;

          // alert("MATCHED ! (" + result.MatchingScore + ")");
          this.validateVoter();
        } else {
          // alert("NOT MATCHED ! (" + result.MatchingScore + ")");
          this.fingersMatch = false;
          this.returnMatchScore = result.MatchingScore;
        }
      } else {
        alert("Error Scanning Fingerprint ErrorCode = " + result.ErrorCode);
      }
    },
    failureFunc(error) {
      alert("On Match Process, failure has been called : " + error);
    }
  }
};
