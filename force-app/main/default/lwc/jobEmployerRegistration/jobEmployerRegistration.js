import { LightningElement, track } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import createUser from '@salesforce/apex/UserRegistrationController.createPortalUser';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class JobEmployerRegistration extends NavigationMixin(LightningElement) {

  connectedCallback() {
    Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
  }

  @track contact = {};
  @track showSpinner = false;


  handleChange(event) {
    let label = event.target.name;
    if (label == 'firstName') {
      this.contact.userFirstName = event.detail.value;
    } else if (label == 'lastName') {
      this.contact.userLastName = event.detail.value;
    } else if (label == 'Designation') {
      this.contact.designation = event.detail.value;
    } else if (label == 'Company_Name') {
      this.contact.companyName = event.detail.value;
    } else if (label == 'phone') {
      this.contact.userPhone = event.detail.value;
    } else if (label == 'email') {
      this.contact.userEmail = event.detail.value;
    }
  }

  handleClick() {
    this.showSpinner = true;
    createUser({
      input: JSON.stringify(this.contact)
    })
      .then(data => {
        if (data != '') {
          const event = new ShowToastEvent({
            title: 'Error !!',
            variant: 'error',
            message: data,
          });
          this.dispatchEvent(event);
        } else {
          const event = new ShowToastEvent({
            title: 'Success',
            variant: 'success',
            message: 'User Successfully Created in the system.',
          });
          this.dispatchEvent(event);
          this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
              url: '/eportal/s/login'
            }
          });
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        const event = new ShowToastEvent({
          title: 'Error!!',
          variant: 'error',
          message: error.body.message,
        });
        this.dispatchEvent(event);
      })
      .finally(() => {
        this.showSpinner = false;
      })
  }



}