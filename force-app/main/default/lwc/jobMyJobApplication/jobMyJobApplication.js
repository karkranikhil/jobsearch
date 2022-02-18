import { LightningElement, track } from 'lwc';
import jobImages from '@salesforce/resourceUrl/jobImages';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import getJobApplication from "@salesforce/apex/JobsDetailController.getJobApplication";

export default class JobMyJobApplication extends LightningElement {

  @track googleIcon = jobImages + "/images/google_icon.svg";
  @track jobIcon = jobImages + "/images/jobIcon.svg";
  @track showSpinner = true;
  @track savedData;
  @track appliedData;

  connectedCallback() {
    Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    this.savedData = [];
    this.appliedData = [];
    this.getJobData();
  }
  getJobData() {
    getJobApplication()
      .then((result) => {
        console.log("Data ", result);
        result.forEach(element => {
          if (element.Status__c == 'Applied') {
            this.appliedData.push(element);
          }
          else {
            this.savedData.push(element);
          }
        });
        this.showSpinner = false;
      })
      .catch((error) => {
        console.log("Error", error);
        this.showSpinner = false;
      });
  }
}