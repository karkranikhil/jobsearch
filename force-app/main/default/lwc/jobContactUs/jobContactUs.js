import { LightningElement, track, wire } from 'lwc';
import IAM_FIELD from "@salesforce/schema/Contact_Us__c.I_am__c";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import saveContactUsInfo from '@salesforce/apex/Job_RegisterProfileController.saveContactUsInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";

export default class JobContactUs extends LightningElement {
  @track openModal = false;
  @track name;
  @track iAm;
  @track emailAddress;
  @track message;
  @track showSpinner = false;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: IAM_FIELD
  })
  iAmPicklist;

  handleChange(event) {
    let changeName = event.target.name;
    if (changeName == "name") {
      this.name = event.target.value;
    } 
    else if (changeName == "iAm") {
      this.iAm = event.target.value;
    } 
    else if (changeName == "emailAddress") {
      this.emailAddress = event.target.value;
    } 
    else if (changeName == "message") {
      this.message = event.target.value;
    }
  }

  connectedCallback() {
    Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
  }

  showModal() {
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  submitDetails() {
    this.openModal = false;
    this.showSpinner = true;
    if (this.name != undefined && this.iAm != undefined && this.emailAddress != undefined && this.message != undefined) {
      saveContactUsInfo({
        name: this.name,
        iAm: this.iAm,
        emailAddress: this.emailAddress,
        message: this.message,
      })
        .then((data) => {
          this.showSpinner = false;
          this.handleClear();
          this.showToast("Success", "Details Saved!!", "success");
          location.reload();
        })
        .catch((error) => {
          this.showSpinner = false;
          console.log(error);
        });
    }
    else {
      alert('Please fill all the fields');
      this.showSpinner = false;
    }
  }

  handleClear() {
    this.template.querySelectorAll('lightning-input,lightning-textarea,lightning-combobox').forEach(element => {
      element.value = '';
    });
  }

  get showCombobox() {
    if (this.iAmPicklist.data != null && this.iAmPicklist.data.values != null)
      return true;
    return false;
  }

  //toast method
  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
    });
    this.dispatchEvent(evt);
  }
}