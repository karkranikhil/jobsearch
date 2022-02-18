import { LightningElement, track } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import changePassword from "@salesforce/apex/CustomChangePasswordController.changeNewPassword";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import globalCss from "@salesforce/resourceUrl/globalCss";

export default class EmployerChangePassword extends LightningElement {
  @track showSpinner = false;
  @track newPassword;
  @track verifyNewPassword;
  @track oldpassword;

  connectedCallback() {
    Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    this.showSpinner = true;

  }
  handleChange(event) {
    var name = event.target.name;
    if (name == 'newPassword') {
      this.newPassword = event.target.value;
    }
    else if (name == 'confirmNewPassword') {
      this.verifyNewPassword = event.target.value;
    }
    else {
      this.oldpassword = event.target.value;
    }
  }
  handleSubmitClick() {
    
    changePassword({
      newPassword: this.newPassword,
      verifyNewPassword: this.verifyNewPassword,
      oldpassword: this.oldpassword
    })
      .then((result) => {
        this.showToast("Success", "Password Updated successfully", "success");
        window.open('/eportal/s/employer-manage-account', '_self');
      })
      .catch((error) => {
        this.showToast("Error", error.body.message, "error");
      });
  }
  handleCancelClick() {
    window.open('/eportal/s','_self');
  }
  //tost
  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
    });
    this.dispatchEvent(evt);
  }

}