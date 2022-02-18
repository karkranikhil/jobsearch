import { LightningElement, wire, track } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import Congratulations from "@salesforce/resourceUrl/Congratulations";
import fetchDetails from "@salesforce/apex/SchedulingController.fetchDetails";
import updateDetails from "@salesforce/apex/SchedulingController.updateDetails";
const normalButtonClass =
    "slds-button slds-button_neutral slds-var-p-around_xx-small";
const activeButtonClass =
    "slds-button slds-button_brand slds-var-p-around_xx-small";
export default class JobAvailabilityScheduling extends LightningElement {
    @track applicantInfo = {};
    congratImage = Congratulations;
    @track showModal = false;
    @track scheduledDate = null;
    @track scheduledTime;
    @track showModalSuccess = false;
    @track resultDateTime;
    @track currentClass9 = normalButtonClass;
    @track currentClass10 = normalButtonClass;
    @track currentClass11 = normalButtonClass;
    @track currentClass12 = normalButtonClass;
    @track currentClass1 = normalButtonClass;
    @track currentClass2 = normalButtonClass;
    @track currentClass3 = normalButtonClass;
    @track currentClass4 = normalButtonClass;
    @track currentClass5 = normalButtonClass;
    @track currentClass6 = normalButtonClass;

    @wire(CurrentPageReference)
    getDetailsFromURL(currentPageReference) {
        if (currentPageReference) {
            console.log(
                "Applicant Id: ",
                currentPageReference.state.applicantId
            );
            this.applicantInfo.Id = currentPageReference.state.applicantId;
        }
    }
    connectedCallback() {
        fetchDetails({
            applicantId: this.applicantInfo.Id,
        }).then((result) => {
            console.log("fetchDetails result: ", result);
            let data = JSON.parse(result);
            this.applicantInfo.Name = data.Job_Applicant_Name__c;
            this.applicantInfo.JobTitle = data.Applied_For__c;
        });
    }
    openModal() {
        this.showModal = !this.showModal;
    }
    closeModal() {
        this.showModal = !this.showModal;
    }
    handleDateChange(event) {
        this.scheduledDate = event.target.value;
    }
    handleSave() {
        updateDetails({
            applicantId: this.applicantInfo.Id,
            scheduledDate: this.scheduledDate,
            scheduledTime: this.scheduledTime,
        })
            .then((result) => {
                console.log("updateDetails Result: ", result);
                this.resultDateTime = result;
                this.showModalSuccess = !this.showModalSuccess;
            })
            .catch((error) => {
                console.log("updateDetails Error: ", error);
            });
        this.showModal = !this.showModal;
    }
    closeModalSuccess() {
        this.showModalSuccess = !this.showModalSuccess;
    }
    schedule(event) {
        let name = event.target.name;
        this.scheduledTime = name;
        this.currentClass9 = normalButtonClass;
        this.currentClass10 = normalButtonClass;
        this.currentClass11 = normalButtonClass;
        this.currentClass12 = normalButtonClass;
        this.currentClass1 = normalButtonClass;
        this.currentClass2 = normalButtonClass;
        this.currentClass3 = normalButtonClass;
        this.currentClass4 = normalButtonClass;
        this.currentClass5 = normalButtonClass;
        this.currentClass6 = normalButtonClass;
        if (name == "9") {
            this.currentClass9 = activeButtonClass;
        } else if (name == "10") {
            this.currentClass10 = activeButtonClass;
        } else if (name == "11") {
            this.currentClass11 = activeButtonClass;
        } else if (name == "12") {
            this.currentClass12 = activeButtonClass;
        } else if (name == "1") {
            this.currentClass1 = activeButtonClass;
        } else if (name == "2") {
            this.currentClass2 = activeButtonClass;
        } else if (name == "3") {
            this.currentClass3 = activeButtonClass;
        } else if (name == "4") {
            this.currentClass4 = activeButtonClass;
        } else if (name == "5") {
            this.currentClass5 = activeButtonClass;
        } else if (name == "6") {
            this.currentClass6 = activeButtonClass;
        }
    }
}