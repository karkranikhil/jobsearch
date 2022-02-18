import { LightningElement, track, wire, api } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import Employment_Type from "@salesforce/schema/Job_Information__c.Employment_Type__c";
import Required_Wages from "@salesforce/schema/Job_Information__c.Required_Wages__c";
import updateJobInformation from "@salesforce/apex/Job_RegisterProfileController.updateJobInformation";
import getJobInformation from "@salesforce/apex/Job_RegisterProfileController.getJobInformation";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class JobJobInformation extends NavigationMixin(
    LightningElement
) {
    // value = "inProgress";
    @track keyIndex = 1;
    @track jobList = [];
    @track hideEndDate = false;
    @track job = {
        jobId: "",
        key: 1,
        title: "",
        degree: "",
        empType: "",
        startDate: null,
        endDate: null,
        currentlyWorking: false,
        duties: "",
        skills: "",
        goal: "",
        desiredOccupation: "",
        location: "",
        requiredWages: "",
    };

    @track deleteList = [];
    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: Required_Wages,
    })
    requiredWagesOption;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: Employment_Type,
    })
    employmentTypeOption;

    connectedCallback() {
        this.keyIndex = this.jobList.length;
        this.getData();
    }

    getData() {
        getJobInformation()
            .then((result) => {
                this.jobList = JSON.parse(JSON.stringify(result));
                if (this.jobList.length < 1) {
                    this.jobList.push(this.job);
                    this.jobList[0].key = 1;
                    this.keyIndex++;
                    console.log(
                        "this.jobList :>> ",
                        JSON.stringify(this.jobList)
                    );
                } else {
                    this.keyIndex = this.jobList.length;
                }
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }

    handleCurrentlyWorking(event) {
        let key = event.target.dataset.id;
        this.jobList[key - 1][event.target.name] = event.detail.checked;
        this.jobList[key - 1]["endDate"] = null;

        // if(event.detail.checked == true){ this.hideEndDate = true}
        // else this.hideEndDate = false;
    }

    handleSave(event) {
        console.log("job delete :>> ", JSON.stringify(this.deleteList));
        console.log("job add :>> ", JSON.stringify(this.jobList));
        updateJobInformation({
            jobList: JSON.stringify(this.jobList),
            jobDeleteList: this.deleteList,
        })
            .then((result) => {
                this.jobList = [];
                this.deleteList = [];
                this.showToast("Success", "Data saved successfully", "success");
                console.log(
                    "updateJobInformation Result: ",
                    JSON.stringify(result)
                );
                this.keyIndex = this.jobList.length;
                getJobInformation()
                    .then((result) => {
                        this.jobList = JSON.parse(JSON.stringify(result));
                        if (this.jobList.length < 1) {
                            this.jobList.push(this.job);
                            this.jobList[0].key = 1;
                            this.keyIndex++;
                            console.log(
                                "this.jobList :>> ",
                                JSON.stringify(this.jobList)
                            );
                        } else {
                            this.keyIndex = this.jobList.length;
                        }
                    })
                    .catch((error) => {
                        console.log("error: ", error);
                    });
            })
            .catch((error) => {
                this.showSpinner = false;
                console.log("saveJobDetails error: ", error);
                this.showToast("Error", error, "error");
            });
    }

    handleAdd() {
        this.keyIndex++;
        this.job.key = this.keyIndex;
        this.jobList.push(JSON.parse(JSON.stringify(this.job)));
    }

    removeRow(event) {
        let key = event.target.dataset.id;
        if (this.jobList[key - 1].jobId != "") {
            this.deleteList.push(this.jobList[key - 1].jobId);
        }
        if (this.jobList.length > 1) {
            this.jobList.splice(key - 1, 1);
            this.keyIndex--;
        }
        this.jobList.forEach((item, index) => {
            item.key = index + 1;
        });
    }
    handleChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        let key = event.target.dataset.id;
        this.jobList[key - 1][name] = value;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    handleBack() {
        const event = new CustomEvent("child", {
            detail: { stageNo: "3", prevStageNo: "4" },
        });
        this.dispatchEvent(event);
    }

    handleNext() {
        const event = new CustomEvent("child", {
            detail: { stageNo: "5", prevStageNo: "4" },
        });
        this.dispatchEvent(event);
    }

    get showSpinner() {
        if (
            this.requiredWagesOption.data != null &&
            this.requiredWagesOption.data.values != null &&
            this.employmentTypeOption.data != null &&
            this.employmentTypeOption.data.values != null
        )
            return false;
        return true;
    }
    get showDelete() {
        if (this.jobList.length > 1) return true;
        return false;
    }
}