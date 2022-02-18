import { LightningElement, track } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";

export default class JobMyFeed extends LightningElement {
    stageNo = 1;
   // @api prevStageNo = 1;
    @track showSpinner = false;
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
}