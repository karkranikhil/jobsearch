import { LightningElement, track } from "lwc";
import Profile_Pic_Test from "@salesforce/resourceUrl/Profile_Pic_Test";
import getContactInfo from "@salesforce/apex/MyFeedController.getContactInfo";
import fetchUserDetail from "@salesforce/apex/ManageAccountController.fetchUserDetail";

export default class WfMyFeed extends LightningElement {
    progressBarDescription =
        "Sample Description of Persoanl Information Progress bar";
    @track contactData;
    @track profileUrl;
    @track rangeValue = 0;
    @track rangeValue2 = 0;
    @track showProgramReferalError;
    // handleChange(event){
    //   this.rangeValue = event.target.value;
    // }
    connectedCallback() {
        this.getContactData();
        this.getProfilePicture();
    }
    getContactData() {
        getContactInfo()
            .then((result) => {
                this.contactData = JSON.parse(JSON.stringify(result));
                console.log(
                    "this.contactData :>> ",
                    JSON.stringify(this.contactData)
                );
                if (this.contactData.Age != "") this.rangeValue += 33;
                if (this.contactData.Email != "") this.rangeValue += 33;
                if (this.contactData.MobNumber != "") this.rangeValue += 33;
                if (
                    this.contactData.Age != "" &&
                    this.contactData.Email != "" &&
                    this.contactData.MobNumber != ""
                )
                    this.rangeValue = 100;
                if (this.contactData.RequiredWages != "")
                    this.rangeValue2 = 100;
                if (this.contactData.programReferals) {
                    this.showProgramReferalError = false;
                } else {
                    this.showProgramReferalError = true;
                }
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }
    get showSpinner() {
        if (this.contactData != null) return false;
        return true;
    }
    getProfilePicture() {
        // this.showSpinner = true;
        fetchUserDetail()
            .then((result) => {
                // console.log('result :>> ', result.FullPhotoUrl);
                this.profileUrl = result.FullPhotoUrl;
                //this.showSpinner = false;
            })
            .catch((error) => {
                console.log("Error", error);
                //this.showSpinner = false;
            });
    }
    directToSearch() {
        window.open(
            "/s/job-search?title=" +
                this.contactData.DesiredOccupation +
                "&regionName=" +
                this.contactData.PreferredLocation +
                "&regionType=" +
                this.contactData.regionType +
                "&regionCode=" +
                this.contactData.regionCode,
            "_self"
        );
    }
}