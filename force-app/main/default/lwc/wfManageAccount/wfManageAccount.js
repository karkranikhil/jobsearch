import { LightningElement, track } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import updateManageAccountDetails from '@salesforce/apex/ManageAccountController.updateManageAccountDetails';
import getManageAccountDetails from '@salesforce/apex/ManageAccountController.getManageAccountDetails';
import fetchUserDetail from '@salesforce/apex/ManageAccountController.fetchUserDetail';
import uploadProilePhoto from '@salesforce/apex/ManageAccountController.uploadProilePhoto';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class WfManageAccount extends LightningElement {
  stageNo = 1;
  @track showSpinner;
  @track firstName;
  @track lastName;
  @track emailAddress;
  @track phoneNo;
  @track age;
  @track experience;
  @track profileUrl;

  get acceptedFormats() {
    return [".jpg", ".png", ".jpeg"];
  }
  handleChange(event) {
    let changeName = event.target.name;
    if (changeName == "firstName") {
      this.firstName = event.target.value;
    } else if (changeName == "lastName") {
      this.lastName = event.target.value;
    } else if (changeName == "emailAddress") {
      this.emailAddress = event.target.value;
    } else if (changeName == "phoneNo") {
      this.phoneNo = event.target.value;
    } else if (changeName == "age") {
      this.age = event.target.value;
    } else if (changeName == "experience") {
      this.experience = event.target.value;
    }

  }
  connectedCallback() {
    Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    this.showSpinner = true;
    this.getManageAccounData();
    this.getProfilePicture();
  }
  getManageAccounData() {
    getManageAccountDetails().then(data => {
      var result = JSON.parse(data);
      this.firstName = result.FirstName;
      this.lastName = result.LastName;
      this.emailAddress = result.Email;
      this.phoneNo = result.MobilePhone;

      this.showSpinner = false;
    })
      .catch(error => {
        this.showSpinner = false;
      });
  }
  passwordClick() {
    window.open('/s/change-password', '_self');
  }
  //Profile picture upload
  getProfilePicture() {
    fetchUserDetail().then(result => {
      this.profileUrl = result.FullPhotoUrl;
      this.showSpinner = false;
    }).catch(
      error => {
        console.log("Error", error);
        this.showSpinner = false;
      }
    );
  }

  handleFileUpload(event) {
    const uploadedFiles = event.detail.files;
    uploadProilePhoto({
      documentId: uploadedFiles[0].documentId
    });
    location.reload();
  }

  handleClearClick() {
    this.template.querySelectorAll('lightning-input').forEach(element => {
      if (element.type === 'checkbox' || element.type === 'checkbox-button') {
        element.checked = false;
      } else {
        element.value = null;
      }
    });
  }
  handleSave() {
    this.showSpinner = true;
    updateManageAccountDetails({
      FirstName: this.firstName,
      LastName: this.lastName,
      MobilePhone: this.phoneNo,
      Email: this.emailAddress
    }).then(data => {
      this.showToast("Success", "Details updated successfully", "success");
      this.getManageAccounData();
      this.showSpinner = false;
      location.reload();

    })
      .catch(error => {
        console.log('error :>> ', error);
        this.showToast("Error", error, "error");
        this.showSpinner = false;
      });
  }
  // show toast
  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
    });
    this.dispatchEvent(evt);
  }
}