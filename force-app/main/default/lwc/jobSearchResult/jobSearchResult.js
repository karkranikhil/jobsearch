import { LightningElement, track, wire } from "lwc";
import jobImages from "@salesforce/resourceUrl/jobImages";
import NoDataFound from "@salesforce/resourceUrl/No_Data";
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import getJobSearchData from "@salesforce/apex/JobsEQController.getJobSearchData";
import getJobPosting from "@salesforce/apex/JobsEQController.getJobPosting";

export default class JobSearchResult extends LightningElement {
    NoDataFound = NoDataFound;
    @track logo = jobImages + "/images/coljobs.png";
    @track trendingSearches = jobImages + "/images/trendingSearch_Icon.svg";
    @track window = jobImages + "/images/window_icon.svg";
    @track apple = jobImages + "/images/apple_icon.svg";
    @track be = jobImages + "/images/be_icon.svg";
    @track google = jobImages + "/images/google_icon.svg";

    @track facebook = jobImages + "/images/followus_facebook_icon.svg";
    @track googleIcons = jobImages + "/images/followUs_google_icon.svg";
    @track linkedin = jobImages + "/images/followus_linkedin_icon.svg";

    @track uploadcbBG = jobImages + "/images/uploadcbBG.png";
    @track uploadcbCV = jobImages + "/images/uploadCV_icon.svg";

    @track howitwork = jobImages + "/images/howitwork.png";
    @track pointer = jobImages + "/images/pointer_icon.svg";
    @track rectangleImage = jobImages + "/images/rectangle_icon.png";
    @track isLoading = false;

    @track repos;
    @track jobs = [];
    @track jobsAll = [];
    @track totalJobsfound = 0;
    @track currentIndex = 0;

    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    }
    handleSearch(event) {
        this.isLoading = true;
        console.log("HandleSearch: ", JSON.stringify(event.detail));
        let searchData = event.detail;
        this.jobsAll = [];
        this.jobs = [];
        this.currentIndex = 0;
        //Add recent job posted.

        getJobPosting({
            jobTitle: searchData.selectedTitleName,
            region: searchData.selectedRegionName,
        })
        .then ((result) => {
               console.log("getJobPosting Result: ", result);
                result.forEach((element) => {
                    this.jobsAll.push(element);
                });
            })
            .catch((error) => {
                console.log("getJobPosting Error: ", error);
                this.isLoading = false;
            });
        getJobSearchData({
            regionType: searchData.regionType,
            regionCode: searchData.regionCode,
            key: searchData.key,
        })
            .then((result) => {
                console.log("getJobSearchData Result: ", result);
                JSON.parse(result).data.forEach((element) => {
                    if (element.active == true) this.jobsAll.push(element);
                });
                this.totalJobsfound = this.jobsAll.length;
                for (
                    let i = this.currentIndex;
                    i < this.currentIndex + 6;
                    i++
                ) {
                    if (i < this.jobsAll.length)
                        this.jobs.push(this.jobsAll[i]);
                }
                this.currentIndex += 6;
                this.isLoading = false;
            })
            .catch((error) => {
                console.log("getJobSearchData Error: ", error);
                this.isLoading = false;
            });
    }
    viewMore() {
        for (let i = this.currentIndex; i < this.currentIndex + 4; i++) {
            if (i < this.jobsAll.length) this.jobs.push(this.jobsAll[i]);
        }
        this.currentIndex += 4;
    }

    get showNoData() {
        if (this.jobs.length > 0) return false;
        return true;
    }
}