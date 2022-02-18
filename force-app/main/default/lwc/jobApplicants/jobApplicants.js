import { LightningElement,api } from 'lwc';

export default class JobApplicants extends LightningElement {
    @api open = false;
    @api columns;
    @api values;
    @api title;

    get summaryClass() {
        return this.open ? 'slds-summary-detail slds-is-open' : 'slds-summary-detail';
    }

    get summaryIcon() {
        return this.open ? 'utility:chevrondown' : 'utility:chevronright';
    }

    toggleState(event) {
        this.open = !this.open;
        
    }
}