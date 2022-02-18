import { LightningElement } from "lwc";

export default class LmiExtraLinks extends LightningElement {
    handleOccupationWages() {
        const childEvent = new CustomEvent("showoccupationwages", {
            detail: {},
        });
        this.dispatchEvent(childEvent);
    }
    handleMapView() {
        const childEvent = new CustomEvent("showmapview", {
            detail: {},
        });
        this.dispatchEvent(childEvent);
    }
}