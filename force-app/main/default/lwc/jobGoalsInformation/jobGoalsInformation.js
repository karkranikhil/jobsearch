import { LightningElement, track, wire, api } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import COMMUNICATION_FIELD from "@salesforce/schema/Contact.Preferred_Method_Of_Communication__c";
import COUNTRY_FIELD from "@salesforce/schema/Contact.Country__c";
import STATE_FIELD from "@salesforce/schema/Contact.State__c";
import WAGES_FIELD from "@salesforce/schema/Contact.Required_Wages__c";
import saveContactGoals from "@salesforce/apex/Job_RegisterProfileController.updateContactGoals";
import getContactDetails from "@salesforce/apex/Job_RegisterProfileController.getContactCmpDetails";
import fetchJobTitle from "@salesforce/apex/JobsEQController.getOnetData";
import fetchRegions from "@salesforce/apex/JobsEQController.fetchRegions";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const DELAY = 300;

export default class JobGoalsInformation extends LightningElement {
    value = "inProgress";
    @track preferredLocation;
    @track desiredOccupation;
    @track requiredWages;
    @track showSpinner = false;
    @track showTitles = false;
    @track selectedTitleName;
    @track titles = [];
    searchKey = "";
    @track selectedRegionName;
    regions = [];

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: WAGES_FIELD,
    })
    wagesPicklist;

    get options() {
        return [
            { label: "New", value: "new" },
            { label: "In Progress", value: "inProgress" },
            { label: "Finished", value: "finished" },
        ];
    }

    connectedCallback() {
        this.showSpinner = true;
        getContactDetails()
            .then((data) => {
                var result = JSON.parse(data);
                this.selectedRegion = result.Region__r;
                this.selectedRegionName = result.Region__r.Name;
                this.selectedTitleName = result.Desired_Occupation__c;
                this.selectedTitle = {
                    Name: result.Desired_Occupation__c,
                    value: result.Occupation_Code__c,
                };
                this.requiredWages = result.Required_Wages__c;
                this.showSpinner = false;
            })
            .catch((error) => {
                this.showSpinner = false;
            });
    }

    handleChange(event) {
        let changeName = event.target.name;
        if (changeName == "preferredLocation") {
            this.preferredLocation = event.detail.value[0];
        } else if (changeName == "desiredOccupation") {
            this.desiredOccupation = event.detail.value;
        } else if (changeName == "requiredWages") {
            this.requiredWages = event.detail.value;
        }
    }

    handleBack() {
        const event = new CustomEvent("child", {
            detail: { stageNo: "4", prevStageNo: "5" },
        });
        this.dispatchEvent(event);
    }

    handleSubmit(event) {
        console.log("wages -- " + this.requiredWages);
        console.log("desireOccupation -- ", this.selectedTitle.Name);
        console.log("occupationCode: ", this.selectedTitle.value);
        if (this.selectedTitle) {
            this.showSpinner = true;
            saveContactGoals({
                desiredOccupation: this.selectedTitle.Name,
                preferredLocation: this.selectedRegion.Id,
                requiredWages: this.requiredWages,
                OccupationCode: this.selectedTitle.value,
            })
                .then((result) => {
                    console.log("result: ", result);
                    this.showSpinner = false;
                    this.showToast(
                        "Success",
                        "Data submitted successfully",
                        "success"
                    );
                    window.open("/s/my-feed", "_self");
                })
                .catch((error) => {
                    console.log("error: ", error);
                    this.showSpinner = false;
                    this.showToast("Error", error, "error");
                });
        } else {
            window.open("/s/my-feed", "_self");
        }
    }
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    get showCombobox() {
        if (
            this.wagesPicklist.data != null &&
            this.wagesPicklist.data.values != null
        )
            return true;
        return false;
    }
    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        let searchKey = event.target.value;
        searchKey = searchKey.split(" ").join("");
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
        this.showTitles = true;
    }
    setShowTitles() {
        this.showTitles = !this.showTitles;
    }
    handleSelectTitle(event) {
        this.selectedTitle = event.detail;
        console.log(
            "Job Title: ",
            this.selectedTitle.Name,
            "Title Code: ",
            this.selectedTitle.value
        );
        this.selectedTitleName = this.selectedTitle.Name;
        this.titles = [];
    }
    @wire(fetchJobTitle, { keyword: "$searchKey" })
    wiredContacts({ error, data }) {
        if (data) {
            var tempTitle = [];
            var response = JSON.parse(data);
            response.occupation.forEach((temp) => {
                tempTitle = [
                    ...tempTitle,
                    { Name: temp.title, value: temp.code },
                ];
            });
            this.titles = tempTitle;
            this.error = undefined;
            console.log("data##" + JSON.stringify(this.titles));
        } else if (error) {
            console.log("error##" + JSON.stringify(error));
            this.error = error;
            this.titles = undefined;
        }
    }
    // region search
    handleSelectRegion(event) {
        this.selectedRegion = event.detail;
        console.log(
            "Regions Name: ",
            this.selectedRegion.Name,
            "Region Type: ",
            this.selectedRegion.Type__c,
            "Region Code: ",
            this.selectedRegion.Code__c,
            "Region ID: ",
            this.selectedRegion.Id
        );
        this.selectedRegionName = this.selectedRegion.Name;
        this.regions = [];
    }
    handleSearch(event) {
        const searchKey = event.detail.value;
        console.log("SeachKey: ", searchKey);
        if (searchKey.length > 1) {
            fetchRegions({
                searchKey: searchKey,
            })
                .then((result) => {
                    console.log("fetchRegions Result: ", result);
                    this.regions = JSON.parse(result);
                })
                .catch((error) => {
                    console.log("fetchRegions Error: ", error);
                });
        } else {
            this.regions = [];
        }
    }
}