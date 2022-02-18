import { LightningElement, track } from "lwc";
import jobImages from "@salesforce/resourceUrl/jobImages";

export default class HowItWork extends LightningElement {
    @track howitwork = jobImages + "/images/howitwork.png";
    @track pointer = jobImages + "/images/pointer_icon.svg";
}