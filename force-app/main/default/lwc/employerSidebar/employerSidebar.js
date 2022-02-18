import { LightningElement,api } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
export default class EmployerSidebar extends LightningElement {

  
    @api stageNum;

    connectedCallback() {
        console.log("stageNum SideBar: ", this.stageNum);
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    }

    handleUserClicks(event) {
        let selected = event.target.value;

        const eventX = new CustomEvent("child", {
            detail: { stageNo: selected, prevStageNo: this.stageNum },
        });
        this.dispatchEvent(eventX);
    }

      get isActive1() {
        if (this.stageNum == "1") return 'active';
        return '';
      }
      get isActive2() {
        if (this.stageNum == "2") return 'active';
        return '';
      }
     
}