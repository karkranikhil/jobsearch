import { LightningElement, track, wire } from "lwc";
import fetchJobTitle from "@salesforce/apex/SearchController.getOnetData";
import fetchRegions from "@salesforce/apex/SearchController.fetchRegions";
import jobImages from "@salesforce/resourceUrl/jobImages";
const DELAY = 300;

export default class FindingJobsBanner extends LightningElement {
    @track bannerBg = jobImages + "/images/bannerBg.jpg";
    @track showTitles = false;
    @track selectedTitleName = "";
    @track titles = [];
    searchKey = "";
    @track preferredLocation;
    regions = [];
    @track selectedRegion = {};
    @track selectedTitle = {};
    @track selectedRegionName = "";

    connectedCallback() {
        this.preferredLocation = "";
    }
    onButtonClick() {
        window.open("/s/job-lmi", "_self");
    }
    onSearch() {
        window.open(
            "/s/job-search?title=" +
                this.selectedTitleName +
                "&regionName=" +
                this.selectedRegion.Name +
                "&regionType=" +
                this.selectedRegion.Type__c +
                "&regionCode=" +
                this.selectedRegion.Code__c,
            "_self"
        );
    }
    //Region search
    handleSelectRegion(event) {
        this.selectedRegion = event.detail;
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
    //Title search
    handleKeyChange(event) {
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
        this.selectedTitleName = this.selectedTitle.Name;
        this.showTitles = false;
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
            console.log("fetchJobTitle Result: " + JSON.stringify(data));
        } else if (error) {
            console.log("fetJobTitle Error: " + JSON.stringify(error));
            this.error = error;
            this.titles = undefined;
        }
    }
    directToCourses() {
        window.open("/s/my-courses?tabset-daab7=baba6", "_self");
    }
}