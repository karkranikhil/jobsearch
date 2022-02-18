import { LightningElement, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getShowProfile from "@salesforce/apex/Job_RegisterProfileController.getShowProfile";
import jobImages from "@salesforce/resourceUrl/jobImages";
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import isguest from "@salesforce/user/isGuest";
import USER_ID from "@salesforce/user/Id";
import { getRecord } from "lightning/uiRecordApi";
import NAME_FIELD from "@salesforce/schema/User.Name";
import isGuest from "@salesforce/user/isGuest";
import basePath from "@salesforce/community/basePath";
import fetchUserDetail from "@salesforce/apex/ManageAccountController.fetchUserDetail";

export default class MainHeader extends NavigationMixin(LightningElement) {
    @track logo = jobImages + "/images/coljobs.png";
    isGuestUser = isguest;
    @track contactData = [
        // {
        //     'Show_Profile__c':true
        // }
    ];
    @track checkProfile = false;
    @track profileUrl;
    @track showSpinner;
    connectedCallback() {
        this.showSpinner = true;
        this.getProfilePicture();
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    }
    handleNotification() {
        console.log("Navigate");
        window.open("/s/notifications", "_self");
    }
    menuActive() {
        var element = document.getElementsByClassName(".dropdown-content");
        alert(element);
        element.classList.add("mystyle");
    }
    renderedCallback() {
        if(this.isGuestUser == false){
            getShowProfile()
            .then((result) => {
                this.contactData = JSON.parse(JSON.stringify(result));
                this.checkProfile = this.contactData[0].Show_Profile__c;
            })
            .catch((error) => {
                console.log("error: ", error);
            });
        console.log("Hello :>> ");
        }
    }
    // connectedCallback() {
    //     console.log('Hello :>> ');
    // }
    get showProfile() {
        if (this.checkProfile) {
            return true;
        }
        return false;
    }
    @track name;

    @wire(getRecord, {
        recordId: USER_ID,
        fields: [NAME_FIELD],
    })
    wireuser({ error, data }) {
        if (error) {
        } else if (data) {
            this.name = data.fields.Name.value;
        }
    }

    navigateToHome() {
        window.open("/s", "_self");
    }
    // logout
    get isGuest() {
        return isGuest;
    }

    get logoutLink() {
        const sitePrefix = basePath.replace(/\/s$/i, ""); // site prefix is the site base path without the trailing "/s"
        return sitePrefix + "/secur/logout.jsp";
    }
    //get profile pic
    getProfilePicture() {
        // this.showSpinner = true;
        fetchUserDetail()
            .then((result) => {
                // console.log('result :>> ', result.FullPhotoUrl);
                this.profileUrl = result.FullPhotoUrl;
                this.showSpinner = false;
            })
            .catch((error) => {
                console.log("Error", error);
                this.showSpinner = false;
            });
    }
}