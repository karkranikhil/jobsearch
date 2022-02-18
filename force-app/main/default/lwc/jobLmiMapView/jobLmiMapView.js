import { LightningElement, track } from "lwc";
import chartImages from "@salesforce/resourceUrl/Chart_Img";
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";

export default class JobLmiMapView extends LightningElement {
    chartImagesUrl = chartImages;

    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    }
    handleBack() {
        const event = new CustomEvent("back", {
            detail: {},
        });
        this.dispatchEvent(event);
    }
}