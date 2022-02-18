import { LightningElement, track } from "lwc";
import jobImages from "@salesforce/resourceUrl/jobImages";
import getJobs from '@salesforce/apex/EmployerDashboardController.getJobPosting';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";

export default class EDashboardDummy extends LightningElement {
    @track window = jobImages + "/images/window_icon.svg";
    @track apple = jobImages + "/images/apple_icon.svg";
    @track be = jobImages + "/images/be_icon.svg";
    @track google = jobImages + "/images/google_icon.svg";

    open = false;


    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    }

    //data = data;
    // columns = columns;
    @track allJobs = [];
    @track jobsToShow = [];

    connectedCallback() {
        this.getJobsPosting();
    }

    getJobsPosting() {
        getJobs()
            .then(data => {
                this.allJobs = JSON.parse(data);
                let i = 1;
                this.allJobs.forEach(row => {
                    if (i <= 4) {
                        i = i + 1;
                        this.jobsToShow.push(row);
                    }
                })
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }



    @track table1Data = [
        {
            Id: 1,
            name: 'Robert Smith',
            Ranking: 1,
            AppliedDate: '2022-05-01',
            Status: 'Applied',
            resume: "https://mtxwfmdemo.my.salesforce.com/sfc/p/5f000006NJdu/a/5f000000sb17/Xt5puBCLhxx.oV155U5mGvyYv5DhIUq2ta1LaGgE8vI",
            Phone: 9087654321,

        },
        {
            Id: 2,
            name: 'Kelsey Denesik',
            Ranking: 1,
            AppliedDate: '2022-11-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 6767576567,

        },
        {
            Id: 3,
            name: 'Kyle Ruecker',
            Ranking: 2,
            AppliedDate: '2022-06-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 9879870987,

        },
        {
            Id: 4,
            name: 'Mark Anthony',
            Ranking: 3,
            AppliedDate: '2022-11-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 9494394943,

        },
        {
            Id: 5,
            name: 'Adam Joel',
            Ranking: 3,
            AppliedDate: '2022-07-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 9821298212,

        }
    ];

    @track table2Data = [
        {
            Id: 11,
            name: 'Isabel Debora',
            Ranking: 1,
            AppliedDate: '2022-05-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 9087654321,

        },
        {
            Id: 12,
            name: 'Rose Hughes',
            Ranking: 1,
            AppliedDate: '2022-11-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 6767576567,

        },
        {
            Id: 13,
            name: 'Paul Bryant',
            Ranking: 2,
            AppliedDate: '2022-06-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 9879870987,

        },
        {
            Id: 14,
            name: 'Jhonny Tucker',
            Ranking: 3,
            AppliedDate: '2022-11-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 9494394943,

        },
        {
            Id: 15,
            name: 'Farncesa Martin',
            Ranking: 3,
            AppliedDate: '2022-07-01',
            Status: 'Applied',
            resume: 'test', // Link if Content Document
            Phone: 9821298212,

        }
    ];

    handleClickAccept(event) {
        let dataId = event.target.value;

        this.table1Data.forEach(objValue => {
            if (objValue.Id == dataId) {
                objValue.Status = 'Accepted';
            }
        })

        this.table2Data.forEach(objValue => {
            if (objValue.Id == dataId) {
                objValue.Status = 'Accepted';
            }
        })
    }

    handleClickReject(event) {
        let dataId = event.target.value;

        this.table1Data.forEach(objValue => {
            if (objValue.Id == dataId) {
                objValue.Status = 'Rejected';
            }
        })

        this.table2Data.forEach(objValue => {
            if (objValue.Id == dataId) {
                objValue.Status = 'Rejected';
            }
        })


    }
}