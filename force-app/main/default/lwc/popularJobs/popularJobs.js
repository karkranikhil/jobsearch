import { LightningElement, track, api } from "lwc";
import jobImages from "@salesforce/resourceUrl/jobImages";
import Search_Job from "@salesforce/resourceUrl/Search_Job";

export default class PopularJobs extends LightningElement {
    @api jobs = [];
    @api totalJobs;
    @api isRecommendedJobs;

    @track window = jobImages + "/images/window_icon.svg";
    @track apple = jobImages + "/images/apple_icon.svg";
    @track be = jobImages + "/images/be_icon.svg";
    @track google = jobImages + "/images/google_icon.svg";
    @track jobIcon = Search_Job;

    handleApply(event) {
        const i = event.target.dataset.index;
        let socCode = this.jobs[i].socCode;
        let location = this.jobs[i].location;
        let wage = this.jobs[i].wage;
        let title = this.jobs[i].title;
        let urlId = this.jobs[i].url.split("/")[5];
        let company = this.jobs[i].company;
        const url =
            window.location.origin +
            "/s/job-detail?soc=" +
            socCode +
            "&location=" +
            location +
            "&wage=" +
            wage +
            "&title=" +
            title +
            "&urlId=" +
            urlId +
            "&company=" +
            company;
        window.open(url, "_self");
    }
    handleViewMore() {
        const event = new CustomEvent("viewmore", {
            detail: {},
        });
        this.dispatchEvent(event);
    }
    get showViewMore() {
        if (
            this.totalJobs == 0 ||
            this.totalJobs == this.jobs.length ||
            this.isRecommendedJobs == true
        )
            return false;
        return true;
    }
}