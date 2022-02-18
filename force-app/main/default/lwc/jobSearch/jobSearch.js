import { LightningElement, track, wire } from "lwc";
import jobImages from "@salesforce/resourceUrl/jobImages";
import globalCss from "@salesforce/resourceUrl/globalCss";
import { CurrentPageReference } from "lightning/navigation";
import fetchRegions from "@salesforce/apex/SearchController.fetchRegions";
import fetchJobTitle from "@salesforce/apex/SearchController.getOnetData";
import getContactDetails from "@salesforce/apex/JobsDetailController.getContactDetails";
import isGuest from "@salesforce/user/isGuest";

const DELAY = 300;

export default class JobSearch extends LightningElement {
    @track rectangleImage = jobImages + "/images/rectangle_icon.png";

    //Job title search code
    searchKey = "";
    @track titles = [];
    error;

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

    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        let searchKey = event.target.value;
        searchKey = searchKey.split(" ").join("");
        console.log("SearchKey: ", searchKey);
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
        this.showTitles = true;
    }

    connectedCallback() {
        if (isGuest) {
            this.selectedRegion = {
                Name: "California",
                Type__c: "4",
                Code__c: "6",
            };
            this.selectedRegionName = this.selectedRegion.Name;
            this.selectedTitle = {
                Name: "Software Developers",
                value: "15-1252.00",
            };
            this.selectedTitleName = this.selectedTitle.Name;
            this.initiateSearch();
        } else {
            getContactDetails()
                .then((result) => {
                    console.log("getContactDetails Result: ", result);
                    let temp = JSON.parse(result);
                    if (this.selectedRegion == null) {
                        this.selectedRegionName = temp.Region__r.Name;
                        this.selectedRegion = {
                            Name: temp.Region__r.Name,
                            Type__c: temp.Region__r.Type__c,
                            Code__c: temp.Region__r.Code__c,
                        };
                    }
                    if (this.selectedTitle == null) {
                        this.selectedTitleName = temp.Desired_Occupation__c;
                        this.selectedTitle = {
                            Name: temp.Desired_Occupation__c,
                            value: temp.Occupation_Code__c,
                        };
                    }

                    this.initiateSearch();
                })
                .catch((error) => {
                    console.log("getContactDetails Error: ", error);
                });
        }
    }

    //Abel's Code below this:
    regions = [];
    @track showTable = false;
    @track showTitles = false;
    @track selectedRegion = null;
    @track selectedTitle = null;
    @track selectedTitleName = null;
    @track selectedRegionName = null;

    @wire(CurrentPageReference)
    getDetailsFromURL(currentPageReference) {
        if (currentPageReference) {
            console.log(
                "From URL Title regionType regionCode: ",
                currentPageReference.state.title,
                currentPageReference.state.regionType,
                currentPageReference.state.regionCode
            );
            if (
                currentPageReference.state.title &&
                currentPageReference.state.title != "undefined"
            ) {
                this.selectedTitle = {
                    Name: currentPageReference.state.title,
                    value: "",
                };
                this.selectedTitleName = currentPageReference.state.title;
            }
            if (
                currentPageReference.state.regionName &&
                currentPageReference.state.regionName != "undefined"
            ) {
                this.selectedRegion = {
                    Name: currentPageReference.state.regionName,
                    Type__c: currentPageReference.state.regionType,
                    Code__c: currentPageReference.state.regionCode,
                };
                this.selectedRegionName = currentPageReference.state.regionName;
            }
        }
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
    handleSelectRegion(event) {
        this.selectedRegion = event.detail; //this.selectedRegion.Name
        console.log(
            "Regions Name: ",
            this.selectedRegion.Name,
            "Region Type: ",
            this.selectedRegion.Type__c,
            "Region Code: ",
            this.selectedRegion.Code__c
        );
        this.selectedRegionName = this.selectedRegion.Name;
        if (this.selectedRegion != null && this.selectedTitle != null)
            this.initiateSearch();
        this.regions = [];
    }
    handleSelectTitle(event) {
        this.selectedTitle = event.detail; //this.selectedTitle.Name
        console.log(
            "Job Title: ",
            this.selectedTitle.Name,
            "Title Code: ",
            this.selectedTitle.value
        );
        this.selectedTitleName = this.selectedTitle.Name;
        if (this.selectedRegion != null && this.selectedTitle != null)
            this.initiateSearch();
        this.titles = [];
    }
    initiateSearch() {
        const event = new CustomEvent("child", {
            detail: {
                regionType: this.selectedRegion.Type__c,
                regionCode: this.selectedRegion.Code__c,
                key: this.selectedTitle.Name,
                occupationCode: this.selectedTitle.value,
                selectedTitleName: this.selectedTitle.Name,
                selectedRegionName: this.selectedRegion.Name,
            },
        });
        this.dispatchEvent(event);
    }
    setShowTitles() {
        this.showTitles = !this.showTitles;
    }
}