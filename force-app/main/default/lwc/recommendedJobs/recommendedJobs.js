import { LightningElement, track, api } from "lwc";
import jobImages from "@salesforce/resourceUrl/jobImages";
import Search_Job from "@salesforce/resourceUrl/Search_Job";

export default class RecommendedJobs extends LightningElement {
    @api jobs = [
        {
            id: "61fe860a779254086c125e9c",
            title: "Computer Programmers",
            company: "Radancy",
            url: "https://jobseq.eqsuite.com/JobPost/View/61fe860a779254086c125e9c/digital-strategist?lic=1674",
            dateEnd: null,
            socCode: "15-1251.00",
            socLabel: "Search Marketing Strategists",
            location: "California Hot Springs CDP, CA",
            dateStart: "2022-02-05T00:00:00",
            active: true,
            wage: null,
        },
        {
            id: "61fef67b779254086c12ac24",
            title: "Computer Systems Engineers/Architects",
            company: "Best Western Plus",
            url: "https://jobseq.eqsuite.com/JobPost/View/61fef67b779254086c12ac24/general-manager?lic=1674",
            dateEnd: null,
            socCode: "15-1299.08",
            socLabel: "General and Operations Managers",
            location: "California Junction CDP, IA",
            dateStart: "2022-02-05T00:00:00",
            active: true,
            wage: null,
        },
        {
            id: "61fecd9e7318e901dc2259c1",
            title: "Database Architects",
            company: "Marriott Vacations Worldwide",
            url: "https://jobseq.eqsuite.com/JobPost/View/61fecd9e7318e901dc2259c1/sales-front-desk-specialist?lic=1674",
            dateEnd: null,
            socCode: "15-1243.00",
            socLabel: "Hotel, Motel, and Resort Desk Clerks",
            location: "California-Lexington Park, MD MSA",
            dateStart: "2022-02-05T00:00:00",
            active: true,
            wage: null,
        },
        {
            id: "61fef0e77318e901dc225efb",
            title: "Web Developers",
            company: "Dignity Health System Office",
            url: "https://jobseq.eqsuite.com/JobPost/View/61fef0e77318e901dc225efb/physician-engagement-specialist?lic=1674",
            dateEnd: null,
            socCode: "15-1254.00",
            socLabel: "Physician Assistants",
            location: "San Bernardino, California",
            dateStart: "2022-02-05T00:00:00",
            active: true,
            wage: null,
        },
    ];
    @api totalJobs;

    @track window = jobImages + "/images/window_icon.svg";
    @track apple = jobImages + "/images/apple_icon.svg";
    @track be = jobImages + "/images/be_icon.svg";
    @track google = jobImages + "/images/google_icon.svg";
    @track jobIcon = Search_Job;

    handleApply(event) {
        const i = event.target.dataset.index;
        console.log("Index: ", i);
        let socCode = this.jobs[i].socCode;
        let location = this.jobs[i].location;
        let wage = this.jobs[i].wage;
        let title = this.jobs[i].title;
        let urlId = this.jobs[i].url.split("/")[5];
        let company = this.jobs[i].company;
        //console.log(socCode, location, wage);
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
        //console.log(url);
        window.open(url, "_self");
    }
    handleViewMore() {
        const event = new CustomEvent("viewmore", {
            detail: {},
        });
        this.dispatchEvent(event);
    }
    get showViewMore() {
        if (this.totalJobs == 0 || this.totalJobs == this.jobs.length)
            return false;
        return true;
    }
}