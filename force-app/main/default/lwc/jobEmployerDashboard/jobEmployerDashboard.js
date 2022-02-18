import { LightningElement, track } from "lwc";
import jobImages from "@salesforce/resourceUrl/jobImages";
import getJobs from '@salesforce/apex/EmployerDashboardController.getJobPosting';
import getJobApplicantsDeveloper from '@salesforce/apex/EmployerDashboardController.getJobApplicantsDeveloper';
import getJobApplicantsSFDCTester from '@salesforce/apex/EmployerDashboardController.getJobApplicantsSFDCTester';
import changeStatus from '@salesforce/apex/EmployerDashboardController.changeStatus';

import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";

export default class JobEmployerDashboard extends LightningElement {
    @track window = jobImages + "/images/window_icon.svg";
    @track apple = jobImages + "/images/apple_icon.svg";
    @track be = jobImages + "/images/be_icon.svg";
    @track google = jobImages + "/images/google_icon.svg";
    @track jobIcon = jobImages + "/images/jobIcon.svg";
    @track jobPosted = jobImages + "/images/job_posted.png";
    @track activeJob = jobImages + "/images/active-jobs.png";
    @track inactiveJob = jobImages + "/images/inactive-jobs.png";
    @track totalJob = jobImages + "/images/total-job.png";

    open = false;
    @track customClass= 'blueColor';
    @track allJobs = [];
    @track jobsToShow=[];

    @track devApplicantsList =[
        {
            applicantId:'',
            applicantName:'',
            appliedDate:null,
            status:'',
            ranking:'',
            phone:'',
            resume:'',

        },
    ];
        @track testerApplicantsList =[
        {
            applicantId:'',
            applicantName:'',
            appliedDate:null,
            status:'',
            ranking:'',
            phone:'',
            resume:'',

        },
    ];
        

    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
        this.getJobsPosting();
        this.getDeveloperDetails();
        this.getTesterDetails();
    }

    getJobsPosting(){
        getJobs()
        .then(data=>{
            console.log(data);
            this.allJobs = JSON.parse(data);
            this.jobsToShow = this.allJobs.splice(0,6);
            console.log('Show all jobs ->>>', JSON.stringify(this.allJobs));
        })
        .catch(error=>{
            console.log(JSON.stringify(error));
        });
    }

    getDeveloperDetails()
    { 
        getJobApplicantsDeveloper()
        .then(data=>{

            var result = JSON.parse(data);
            result.forEach(row=>{
                row.showLinkedIn = row.linkedin ? true: false;
                
            });

         this.devApplicantsList = result;
         console.log('Dev Applicants>>' + JSON.stringify( this.devApplicantsList));
        })
        .catch(error=>{
            console.log(JSON.stringify(error));
        });
    }

    getTesterDetails()
    {
       
        getJobApplicantsSFDCTester()
        .then(data=>{
            var result = JSON.parse(data);
            result.forEach(row=>{
                row.showLinkedIn = row.linkedin ? true: false;

            });
        this.testerApplicantsList = result;
        })
        .catch(error=>{
            console.log(JSON.stringify(error));
        });
    }

    @track table1Data = [
        {
            Id: 1,
            name: 'Robert Smith',
            Ranking:1,
            AppliedDate: '2022-05-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/5f000006NJdu/a/5f000000sb17/Xt5puBCLhxx.oV155U5mGvyYv5DhIUq2ta1LaGgE8vI", 
            Phone : 9087654321,

        },
        {
            Id: 2,
            name: 'Eric Michael',
            Ranking:1,
            AppliedDate: '2022-11-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/#5f000006NJdu/a/5f000000sb21/XGFu4eNVgDcnceAoD46pf_xQMXwyUI.0ol_PaLsa2_8",
            Phone : 6767576567,
            
        },
        {
            Id: 3,
            name: 'Wendall kearney',
            Ranking:2,
            AppliedDate: '2022-06-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/#5f000006NJdu/a/5f000000sb2B/BpT3D0rWfftJqWLd9BTQttTsAstCWTN1QpVJvsK0MqM",
            Phone : 9879870987,
            
        },
        {
            Id: 4,
            name: 'Gerald Geraldo',
            Ranking:3,
            AppliedDate: '2022-11-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/5f000006NJdu/a/5f000000sb1w/FHU5bBG_mMa7ZDsgLanL6W6.urCbOxGps6efKO7NCSI",
            Phone : 9494394943,
            
        },
        {
            Id: 5,
            name: 'Luke Grimes',
            Ranking:3,
            AppliedDate: '2022-07-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/#5f000006NJdu/a/5f000000sb26/zcqvwyTPweMDV7Nk3iUQbU9S_H969dEys4qTabVZA6I", 
            Phone : 9821298212,
            
        }
    ];

    @track table2Data = [
        {
            Id: 11,
            name: 'John Doe',
            Ranking:1,
            AppliedDate: '2022-05-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/#5f000006NJdu/a/5f000000sb1v/PpUEqHYgljSrjaIZp8VTrsQ_SMlT0sHW0Wqh4dMhbcQ",
            Phone : 9087654321,

        },
        {
            Id: 12,
            name: 'Kevin Michael',
            Ranking:1,
            AppliedDate: '2022-11-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/#5f000006NJdu/a/5f000000sb25/Lab72Qh6TlwFTZBPbwa8TUO6URlJ4rRlJA7yWN5.Xqk",
            Phone : 6767576567,
            
        },
        {
            Id: 13,
            name: 'Andrew Edward',
            Ranking:2,
            AppliedDate: '2022-06-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/#5f000006NJdu/a/5f000000sb2A/9ltUjfQLJwNYsnjX1d62IG8opW6EmK4usPaiqyrO3D4",
            Phone : 9879870987,
            
        },
        {
            Id: 14,
            name: 'Dwight Kavanagh',
            Ranking:3,
            AppliedDate: '2022-11-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/#5f000006NJdu/a/5f000000sb2F/liPADMs20ZsEipP4M3LFzvk5LID3jKSIwuNvekBJl6I",
            Phone : 9494394943,
            
        },
        {
            Id: 15,
            name: 'Boris Alexander',
            Ranking:3,
            AppliedDate: '2022-07-01',
            Status : 'Applied',
            resume : "https://mtxwfmdemo.my.salesforce.com/sfc/p/#5f000006NJdu/a/5f000000sb1x/5tsvXCvyd6TnAoojOj_qs7IXwSXOW.79FgJX_HFHrLQ",
            Phone : 9821298212,
            
        }
    ];

    handleClickAccept(event){
      let dataId = event.target.value;
      
     this.devApplicantsList.forEach( objValue => {
         if(objValue.applicantId == dataId){
            objValue.status = 'Moved To Next Round';
            this.colorChangeGreen();
            this.changeApplicantStatus(dataId, 'Moved To Next Round');
         }
      })

      this.testerApplicantsList.forEach( objValue => {
        if(objValue.applicantId == dataId){
           objValue.status = 'Moved To Next Round';
           this.colorChangeGreen();
           this.changeApplicantStatus(dataId, 'Moved To Next Round');
        }
     })
    }

    handleClickReject(event){
        let dataId = event.target.value;
  
       this.devApplicantsList.forEach( objValue => {
           if(objValue.applicantId == dataId){
              objValue.status = 'Rejected';
              this.colorChangeRed();
              this.changeApplicantStatus(dataId, 'Rejected');
           }
        })

        this.testerApplicantsList.forEach( objValue => {
            if(objValue.applicantId == dataId){
               objValue.status = 'Rejected';
               this.colorChangeRed();
               this.changeApplicantStatus(dataId, 'Rejected');
            }
         })
      }
      colorChangeGreen()
      {
        this.customClass = 'greenColor';
      }

      colorChangeRed()
      {
        this.customClass = 'redColor';
      }
      
      changeApplicantStatus(dataId, status)
      {
        changeStatus({
            applicantId: dataId,
            status: status,
        })
      }

}