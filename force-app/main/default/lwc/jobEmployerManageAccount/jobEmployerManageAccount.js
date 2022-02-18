import { LightningElement, track } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import getManageAccountEmployerDetails from '@salesforce/apex/ManageAccountController.getManageAccountEmployerDetails';
import updateManageAccountEmployer from '@salesforce/apex/ManageAccountController.updateManageAccountEmployer';
import fetchUserDetail from '@salesforce/apex/ManageAccountController.fetchUserDetail';
import uploadProilePhoto from '@salesforce/apex/ManageAccountController.uploadProilePhoto';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class JobEmployerManageAccount extends LightningElement {
    @track showSpinner;
    @track getData = {
        Name: "",
        Type: "",
        Website: "",
        Company_Type: "",
        Company_Size: "",
        Email: ""
    };
    @track profileUrl;

    // geter varibles
    get acceptedFormats() {
        return [".jpg", ".png", ".jpeg"];
    }

    handleChange(event) {
        let changeName = event.target.name;
        let changeValue = event.target.value;
        this.getData[changeName] = changeValue;
    }
    connectedCallback() {
        this.showSpinner = true;
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
        this.getEmployerData();
        this.getProfilePicture();
    }
    getEmployerData() {
        getManageAccountEmployerDetails().then(data => {
            var result = JSON.parse(data);
            this.getData = result;
            console.log('result :>> ', JSON.stringify(this.getData));
            this.showSpinner = false;
        })
            .catch(error => {
                console.log('error :>> ', error);
                this.showSpinner = false;
            });
    }

    passwordClick() {
        window.open('/eportal/s/change-password', '_self');
    }

    getProfilePicture() {
        fetchUserDetail().then(result => {
            this.profileUrl = result.FullPhotoUrl;
            this.showSpinner = false;
        }).catch(
            error => {
                console.log("Error", error);
                this.showSpinner = false;
            }
        );
    }

    handleFileUpload(event) {
        const uploadedFiles = event.detail.files;
        uploadProilePhoto({
            documentId: uploadedFiles[0].documentId
        });
        location.reload();
    }

    handleClearClick() {
        this.template.querySelectorAll('lightning-input').forEach(element => {
            if (element.type === 'checkbox' || element.type === 'checkbox-button') {
                element.checked = false;
            } else {
                element.value = null;
            }
        });
    }

    handleSave() {
        console.log('getData :>> ', JSON.stringify(this.getData));
        this.showSpinner = true;

        updateManageAccountEmployer({
            manageAccData: JSON.stringify(this.getData)
        }).then(data => {
            console.log('object :>> ', data);
            this.showToast("Success", "Details updated successfully", "success");
            this.getEmployerData();
            this.showSpinner = false;
        })
            .catch(error => {
                console.log('error :>> ', error);
                this.showSpinner = false;
            });
    }
    
    // show toast
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}