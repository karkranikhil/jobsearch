import { LightningElement, track } from "lwc";
import jobImages from "@salesforce/resourceUrl/jobImages";
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import getContactDetails from "@salesforce/apex/JobsDetailController.getContactDetails";
import getJobSearchData from "@salesforce/apex/JobsEQController.getJobSearchData";
import isGuest from "@salesforce/user/isGuest";
import Code__c from "@salesforce/schema/Region__ChangeEvent.Code__c";

const rcJobs = [
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

export default class JobLandingPage extends LightningElement {
    // @track logo = jobImages + '/images/mtxLogo.svg';
    // @track trendingSearches = jobImages + '/images/trendingSearch_Icon.svg';
    // @track window = jobImages + '/images/window_icon.svg';
    // @track apple = jobImages + '/images/apple_icon.svg';
    // @track be = jobImages + '/images/be_icon.svg';
    // @track google = jobImages + '/images/google_icon.svg';

    // @track facebook = jobImages + '/images/followus_facebook_icon.svg';
    // @track googleIcons = jobImages + '/images/followUs_google_icon.svg';
    // @track linkedin = jobImages + '/images/followus_linkedin_icon.svg';

    // @track uploadcbBG = jobImages + '/images/uploadcbBG.png';
    // @track uploadcbCV = jobImages + '/images/uploadCV_icon.svg';

    // @track howitwork = jobImages + '/images/howitwork.png';
    // @track pointer = jobImages + '/images/pointer_icon.svg';
    @track jobs = [];
    @track jobsAll = [];
    @track recommendedJobs = rcJobs;
    @track totalJobsfound = 0;
    // @track currentIndex = 0;
    @track isLoading;
    @track selectedRegion;
    @track selectedTitle;

    connectedCallback() {
        this.isLoading = true;
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
        //this.isLoading = false;
        if (isGuest == true) {
            this.selectedRegion = {
                Type__c: "4",
                Code__c: "6",
            };
            this.selectedTitle = {
                Name: "Bill and Account Collectors",
            };
            this.initiateSearch();
        } else {
            getContactDetails()
                .then((result) => {
                    console.log("getContactDetails Result: ", result);
                    let temp = JSON.parse(result);
                    this.selectedRegionName = temp.Region__r.Name;
                    this.selectedTitleName = temp.Desired_Occupation__c;
                    this.selectedRegion = {
                        Name: temp.Region__r.Name,
                        Type__c: temp.Region__r.Type__c,
                        Code__c: temp.Region__r.Code__c,
                    };
                    this.selectedTitle = {
                        Name: temp.Desired_Occupation__c,
                        value: temp.Occupation_Code__c,
                    };
                    this.initiateSearch();
                })
                .catch((error) => {
                    console.log("getContactDetails Error: ", error);
                    this.isLoading = false;
                });
        }
    }
    initiateSearch(event) {
        getJobSearchData({
            regionType: this.selectedRegion.Type__c,
            regionCode: this.selectedRegion.Code__c,
            key: this.selectedTitle.Name,
        })
            .then((result) => {
                console.log("getSearchData Result: ", JSON.stringify(result));
                JSON.parse(result).data.forEach((element) => {
                    if (element.active == true) this.jobsAll.push(element);
                });
                // this.totalJobsfound = this.jobsAll.length;
                for (let i = 0; i < 4; i++) {
                    if (i < this.jobsAll.length)
                        this.jobs.push(this.jobsAll[i]);
                }
                // this.currentIndex += 4;
                this.isLoading = false;
            })
            .catch((error) => {
                console.log("getJobSearchData Error: ", error);
                this.isLoading = false;
            });
    }
    viewMore() {
        window.open("/s/job-search", "_self");
    }
}