import { LightningElement, api } from "lwc";

export default class RecordList extends LightningElement {
    @api record;
    @api fieldname;
    @api iconname;

    handleSelect(event) {
        event.preventDefault();
        const selectedRecord = new CustomEvent("select", {
            detail: this.record,
        });
        //console.log( this.record.Id);
        this.dispatchEvent(selectedRecord);
    }
}