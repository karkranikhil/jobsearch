import { LightningElement, track, api } from "lwc";
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";

export default class JobProfileRegister extends LightningElement {
  stageNo = 1;
  @api prevStageNo = 1;
  @track showSpinner = false;
  // @track stepObj = {};

//   @track showPersonalDetails = true;
//   @track showContactInformation = false;
//   @track showEducationDetails = false;
//   @track showJobInformation = false;

//   validatePageData(event) {
//     let selected = event.currentTarget.dataset.page;
//     this.showPersonalDetails = false;
//     this.showContactInformation = false;
//     this.showEducationDetails = false;
//     this.showJobInformation = false;
//     if (selected == "Personal_Information") {
//       this.showContactInformation = true;
//     }
//     if (selected == "Contact_Information") {
//       this.showEducationDetails = true;
//     }
//     if (selected == "Education_Details") {
//       this.showJobInformation = true;
//     }
//     if (selected == "Job_Information") {
//       this.showJobInformation = true;
//       window.open("/s/", "_self");
//     }
//     window.scrollTo(0, 0);
//   }
//   handleBack(event) {
//     let selected = event.currentTarget.dataset.page;
//     this.showPersonalDetails = false;
//     this.showContactInformation = false;
//     this.showEducationDetails = false;
//     this.showJobInformation = false;
//     if (selected == "Contact_Information") {
//       this.showPersonalDetails = true;
//     }
//     if (selected == "Education_Details") {
//       this.showContactInformation = true;
//     }
//     if (selected == "Job_Information") {
//       this.showEducationDetails = true;
//     }
//     window.scrollTo(0, 0);
//   }

  handleStageChange(event) {
    console.log(event.detail.stageNo);
    console.log(event.detail.prevStageNo);
    this.stageNo = event.detail.stageNo;
    console.log(this.stageNo);
    this.prevStageNo = event.detail.prevStageNo;
    window.scrollTo(0, 0);

  }

//   handleSidebarClick(event) {
//     console.log(" check:>> ", event.detail.step);
//     let selected = event.detail.step;
//     this.showPersonalDetails = false;
//     this.showContactInformation = false;
//     this.showEducationDetails = false;
//     this.showJobInformation = false;
//     if (selected == "1") {
//       this.showPersonalDetails = true;
//     }
//     if (selected == "2") {
//       this.showContactInformation = true;
//     }
//     if (selected == "3") {
//       this.showEducationDetails = true;
//     }
//     if (selected == "4") {
//       this.showJobInformation = true;
//     }
//     window.scrollTo(0, 0);
//   }
  connectedCallback() {
    Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
  }

  get isStage1() {
    if (this.stageNo == "1") return true;
    return false;
  }
  get isStage2() {
    if (this.stageNo == "2") return true;
    return false;
  }
  get isStage3() {
    if (this.stageNo == "3") return true;
    return false;
  }
  get isStage4() {
    if (this.stageNo == "4") return true;
    return false;
  }
  get isStage5(){
    if (this.stageNo == "5") return true;
    return false;
  }
}