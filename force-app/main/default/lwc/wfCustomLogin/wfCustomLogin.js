import { LightningElement, track } from "lwc";
import doLogin from "@salesforce/apex/userLoginController.doLogin";
export default class WfCustomLogin extends LightningElement {
  username;
  password;

  handleUserNameChange(event) {
    this.username = event.target.value;
  }

  handlePasswordChange(event) {
    this.password = event.target.value;
  }
  handleLogin(event) {
    if (this.username && this.password) {
      event.preventDefault();

      doLogin({ username: this.username, password: this.password })
        .then((result) => {
          window.location.href = result;
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });
    }
  }
}