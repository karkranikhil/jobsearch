import { LightningElement, track, wire, api } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import COMMUNICATION_FIELD from "@salesforce/schema/Contact.Preferred_Method_Of_Communication__c";
import COUNTRY_FIELD from "@salesforce/schema/Contact.Country__c";
import STATE_FIELD from "@salesforce/schema/Contact.State__c";
import WAGES_FIELD from "@salesforce/schema/Contact.Required_Wages__c";
import saveContact from "@salesforce/apex/Job_RegisterProfileController.updateContactDetails";
import getContactDetails from "@salesforce/apex/Job_RegisterProfileController.getContactCmpDetails";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import fetchJobTitle from "@salesforce/apex/JobsEQController.getOnetData";

const DELAY = 300;

export default class JobContactInformation extends LightningElement {
    value = "inProgress";
    @track name;
    @track communication;
    @track mobile;
    @track email;
    @track country;
    @track state;
    @track zipcode;
    @track city;
    @track street;
    @track pCountry;
    @track pState;
    @track pZipcode;
    @track pCity;
    @track pStreet;
    @track currentIsPermanent = true;
    @track permanentAddressOld;
    @track preferredLocation;
    @track desiredOccupation;
    @track requiredWages;
    @track showSpinner = false;
    @track showTitles = false;
    @track selectedTitleName;
    @track titles = [];
    searchKey = "";

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: COMMUNICATION_FIELD,
    })
    communicationPicklist;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: COUNTRY_FIELD,
    })
    countryPicklist;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: STATE_FIELD,
    })
    statePicklist;

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
                this.communication =
                    result.Preferred_Method_Of_Communication__c;
                this.country = result.Country__c;
                this.state = result.State__c;
                this.mobile = result.MobilePhone;
                console.log('result mobile--'+result.MobilePhone);
                console.log('this.mobile--'+this.mobile);
                this.email = result.Email;
                this.zipcode = result.Zip_Code__c;
                this.city = result.City__c;
                this.street = result.Street__c;
                // this.currentAddress = result.Current_Address__c;
                // this.permanentAddress = result.Permanent_Address__c;
                this.pCity = result.Permanent_Add_City__c;
                this.pCountry = result.Permanent_Add_Country__c;
                this.pState = result.Permanent_Add_State__c;
                this.pStreet = result.Permanent_Add_Street__c;
                this.pZipcode = result.Permanent_Add_Zip_Code__c;
                if (
                    this.pZipcode == this.zipcode &&
                    this.pCity == this.city &&
                    this.pCountry == this.country &&
                    this.pState == this.state &&
                    this.pStreet == this.street
                ) {
                    this.currentIsPermanent = true;
                }
                this.preferredLocation = result.Region__c;
                this.desiredOccupation = result.Desired_Occupation__c;
                this.requiredWages = result.Required_Wages__c;
                this.showSpinner = false;
            })
            .catch((error) => {});
    }

    handlePhoneInputMask(event) {
        const x = event.target.value
            .replace(/\D+/g, "")
            .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            this.mobile = !x[2]
            ? x[1]
            : `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : ``);
        console.log('7777--'+event.target.name);
        // if (event.target.name == "mobile") {
        //     this.mobile = event.detail.value;
        // }
    }
    handleChange(event) {
        let changeName = event.target.name;
        if (changeName == "name") {
            this.name = event.detail.value;
        } else if (changeName == "communication") {
            this.communication = event.detail.value;
        } else if (changeName == "mobile") {
            //this.mobile = event.detail.value;
        } else if (changeName == "email") {
            this.email = event.detail.value;
        } else if (changeName == "Country") {
            this.country = event.detail.value;
        } else if (changeName == "City") {
            this.city = event.detail.value;
        } else if (changeName == "zip") {
            this.zipcode = event.detail.value;
        } else if (changeName == "preferredLocation") {
            this.preferredLocation = event.detail.value[0];
        } else if (changeName == "desiredOccupation") {
            this.desiredOccupation = event.detail.value;
        } else if (changeName == "requiredWages") {
            this.requiredWages = event.detail.value;
        } else if (changeName == "currentAddress") {
            this.currentAddress = event.detail.value;
        } else if (changeName == "permanentAddress") {
            this.permanentAddress = event.detail.value;
        } else if (changeName == "handleMailingCheckboxChange") {
            if (event.target.checked) {
                this.currentIsPermanent = true;
                this.pCity = this.city;
                this.pCountry = this.country;
                this.pState = this.state;
                this.pStreet = this.street;
                this.pZipcode = this.zipcode;
            } else {
                this.currentIsPermanent = false;
            }
        }
    }
    handleAddressChange(event) {
        let addressDetails = event.detail;
        this.country = addressDetails.country;
        this.state = addressDetails.province;
        this.zipcode = addressDetails.postalCode;
        this.city = addressDetails.city;
        this.street = addressDetails.street;
        if (this.currentIsPermanent == true) {
            this.pCity = this.city;
            this.pCountry = this.country;
            this.pState = this.state;
            this.pStreet = this.street;
            this.pZipcode = this.zipcode;
        }
    }
    handlePAddressChange(event) {
        if (this.currentIsPermanent == true) {
            let addressDetails = event.detail;
            this.pCity = addressDetails.city;
            this.pCountry = addressDetails.country;
            this.pState = addressDetails.province;
            this.pStreet = addressDetails.street;
            this.pZipcode = addressDetails.postalCode;
            this.country = addressDetails.country;
            this.state = addressDetails.province;
            this.zipcode = addressDetails.postalCode;
            this.city = addressDetails.city;
            this.street = addressDetails.street;
        } else {
            let addressDetails = event.detail;
            this.pCity = addressDetails.city;
            this.pCountry = addressDetails.country;
            this.pState = addressDetails.province;
            this.pStreet = addressDetails.street;
            this.pZipcode = addressDetails.postalCode;
        }
    }

    handleSave() {
        this.saveContactInfo("save");
    }

    handleNext() {
        this.saveContactInfo("next");
    }
    handleBack() {
        const event = new CustomEvent("child", {
            detail: { stageNo: "1", prevStageNo: "2" },
        });
        this.dispatchEvent(event);
    }

    saveContactInfo(button) {
        this.showSpinner = true;
        console.log('mobile$$$$'+this.mobile);
        saveContact({
            name: this.name,
            email: this.email,
            communication: this.communication,
            mobile: this.mobile,
            country: this.country,
            state: this.state,
            city: this.city,
            street: this.street,
            zipcode: this.zipcode,
            pCity: this.pCity,
            pCountry: this.pCountry,
            pState: this.pState,
            pStreet: this.pStreet,
            pZipcode: this.pZipcode,
            // desiredOccupation: this.selectedTitleName,
            preferredLocation: this.preferredLocation,
            requiredWages: this.requiredWages,
        })
            .then((data) => {
                if (button == "save") {
                    const event = new ShowToastEvent({
                        title: "Success!",
                        message: "Details Updated!!",
                        variant: "success",
                    });
                    this.dispatchEvent(event);
                } else {
                    const event1 = new CustomEvent("child", {
                        detail: { stageNo: "3", prevStageNo: "2" },
                    });
                    this.dispatchEvent(event1);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.showSpinner = false;
            });
    }

    get showCombobox() {
        if (
            this.communicationPicklist.data != null &&
            this.communicationPicklist.data.values != null &&
            this.countryPicklist.data != null &&
            this.countryPicklist.data.values != null &&
            this.statePicklist.data != null &&
            this.statePicklist.data.values != null &&
            this.wagesPicklist.data != null &&
            this.wagesPicklist.data.values != null
        )
            return true;
        return false;
    }
    // Search add
    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
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
}