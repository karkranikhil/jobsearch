import { LightningElement,track,api } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
export default class EmployerDashboardHome extends LightningElement {


   @track stageNo = 1;
  @api prevStageNo = 1;
  @track showSpinner = false;
  @track stageValuefromURL;


  handleStageChange(event) {
    console.log(event.detail.stageNo);
    console.log(event.detail.prevStageNo);
    this.stageNo = event.detail.stageNo;
    console.log(this.stageNo);
    this.prevStageNo = event.detail.prevStageNo;
    window.scrollTo(0, 0);

  }

  connectedCallback() {
    Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);

    var url_string = window.location.href;

        var url = new URL(url_string);
        this.stageValuefromURL = url.searchParams.get("stageNo");
        
        if(this.stageValuefromURL == 2)
        {
          this.stageNo = 2;
        }
  }

  get isStage1() {
    if (this.stageNo == "1") return true;
    return false;
  }
  get isStage2() {
    if (this.stageNo == "2") return true;
    return false;
  }
  
}