import { LightningElement, track } from "lwc";
import jobImages from "@salesforce/resourceUrl/Employer";
import globalCss from "@salesforce/resourceUrl/globalCss";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";

export default class EmployerLandingPage extends LightningElement {
    @track empBanner = jobImages + "/employerImage/empBanner.jpg";
    @track empHow1 = jobImages + "/employerImage/empHow1.jpg";
    @track empHow2 = jobImages + "/employerImage/empHow2.jpg";
    @track empHow3 = jobImages + "/employerImage/empHow3.jpg";
    @track empWork1 = jobImages + "/employerImage/empWork1.png";
    @track empWork2 = jobImages + "/employerImage/empWork2.png";
    @track empWork3 = jobImages + "/employerImage/empWork3.png";
    @track jobseekers = jobImages + "/employerImage/jobseekers-img.png";
    @track registered = jobImages + "/employerImage/registered-img.png";
    @track newCompany = jobImages + "/employerImage/newCompany-img.png";
    

    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
        this.showSpinner = true;
    }
    PostJob() {
      window.open('/eportal/s/employer-dashboard?stageNo=2','_self');
    }
}