import { LightningElement, track } from "lwc";
import { loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import globalCss from "@salesforce/resourceUrl/globalCss";
import getJobSkills from "@salesforce/apex/JobsDetailController.getJobSkills";
import getJobResponsibilites from "@salesforce/apex/JobsDetailController.getJobResponsibilites";
import getJobDescription from "@salesforce/apex/JobsDetailController.getJobDescription";
import getJobRelatedExperience from "@salesforce/apex/JobsDetailController.getJobRelatedExperience";
import setJobApplication from "@salesforce/apex/JobsDetailController.setJobApplication";
import getJobApplyUrl from "@salesforce/apex/JobsDetailController.getJobApplyUrl";
import getJobApplication from "@salesforce/apex/JobsDetailController.getJobApplication";
import sendEmail from "@salesforce/apex/JobsDetailController.sendEmailForRefer";
import isGuest from "@salesforce/user/isGuest";
import Search_Job from "@salesforce/resourceUrl/Search_Job";

export default class JobDetailPage extends LightningElement {
    @track jobIcon = Search_Job;
    @track skills = [];
    @track responsibilites = [];
    @track description = "";
    @track relatedExperience = "";
    @track onSet;
    @track title;
    @track code;
    @track location;
    @track wage;
    @track company;
    @track urlId;
    @track jobApplyList = [];
    @track showSpinner;
    @track data;
    @track isModalOpen = false;
    @track candidateName;
    @track candidateEmail;
    @track isGusetUser = isGuest;

    get jobType() {
        if (this.jobApplyList[0] != "") {
            return this.jobApplyList[0];
        }
        return "NA";
    }

    connectedCallback() {
        this.showSpinner = true;
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);

        //get url params
        var url_string = window.location.href;
        var url = new URL(url_string);
        this.code = url.searchParams.get("soc");
        this.location = url.searchParams.get("location") != null ? url.searchParams.get("location") : "Not Available";
        this.wage = url.searchParams.get("wage") != "null" ? url.searchParams.get("wage") : "NA";
        this.title = url.searchParams.get("title");
        this.urlId = url.searchParams.get("urlId");
        this.company = url.searchParams.get("company") != null ? url.searchParams.get("company") : "Not Available";

        getJobSkills({ code: this.code })
            .then((result) => {
                this.skills = JSON.parse(result).element;
            })
            .catch((error) => {
                console.log("getJobSkills Error: ", error);
            });
        getJobResponsibilites({ code: this.code })
            .then((result) => {
                this.responsibilites = JSON.parse(result).element;
            })
            .catch((error) => {
                console.log("getJobResponsibilites Error: ", error);
            });
        getJobDescription({ code: this.code })
            .then((result) => {
                this.description = JSON.parse(result).description;
            })
            .catch((error) => {
                console.log("getJobDescription Error: ", error);
            });
        getJobRelatedExperience({ code: this.code })
            .then((result) => {
                this.relatedExperience = JSON.parse(result).related_experience;
            })
            .catch((error) => {
                console.log("getJobRelatedExperience Error: ", error);
            });
        getJobApplyUrl({ urlId: this.urlId })
            .then((result) => {
                this.jobApplyList = result;
            })
            .catch((error) => {
                console.log("result job applu url  Error: ", error);
            });
        this.data = [];
        this.checkSavelater();
    }

    checkSavelater() {
        this.onSet = false;
        getJobApplication()
            .then((result) => {
                this.data = JSON.parse(JSON.stringify(result));
                this.data.forEach((element) => {
                    if (element.urlId__c == this.urlId) {
                        this.onSet = true;
                    }
                });
                this.showSpinner = false;
            })
            .catch((error) => {
                console.log("Error", error);
                this.showSpinner = false;
            });
    }

    applyNow() {
        window.open(this.jobApplyList[1], "_blank");
    }
    
    handleSaveClick() {
        if (isGuest == true) window.open("/s/register-page", "_self");
        else {
            this.showSpinner = true;

            setJobApplication({
                title: this.title,
                location: this.location,
                wage: this.wage,
                company: this.company,
                jobType: this.jobType,
                urlId: this.urlId,
            })
                .then((result) => {
                    console.log("result save", result);
                    const evt = new ShowToastEvent({
                        title: "Success",
                        message: "Saved for later!",
                        variant: "success",
                    });
                    this.dispatchEvent(evt);
                    this.onSet = true;
                    this.showSpinner = false;
                })
                .catch((error) => {
                    console.log("error save", error);
                    this.onSet = true;
                    this.showSpinner = false;
                });
        }
    }
    handleBack() {
        window.history.back();
    }

    handleRefer() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleNameChange(event) {
        this.candidateName = event.detail.value;
    }

    handleEmailChange(event) {
        this.candidateEmail = event.detail.value;
    }

    submitDetails() {
        this.showSpinner = true;
        var url_string = window.location.href;
        sendEmail({
            candidateName: this.candidateName,
            candidateEmail: this.candidateEmail,
            jobName: this.title,
            jobUrl: url_string
        })
            .then(data => {
                if (data == '') {
                    const event = new ShowToastEvent({
                        title: 'Error !!',
                        variant: 'error',
                        message: data,
                    });
                    this.dispatchEvent(event);
                } else {
                    const event = new ShowToastEvent({
                        title: 'Success',
                        variant: 'success',
                        message: 'Referral Submitted Successfully',
                    });
                    this.dispatchEvent(event);
                }
            })
            .catch(error => {
                console.log(JSON.stringify(error));
                const event = new ShowToastEvent({
                    title: 'Error!!',
                    variant: 'error',
                    message: error.body.message,
                });
                this.dispatchEvent(event);
            })
            .finally(() => {
                this.isModalOpen = false;
                this.showSpinner = false;
            })
    }
}