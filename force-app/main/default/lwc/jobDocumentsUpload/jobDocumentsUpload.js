import { LightningElement, track } from 'lwc';
import uploadDocuments from "@salesforce/apex/DocumentsUploadController.uploadDocuments";
import getDocuments from "@salesforce/apex/DocumentsUploadController.getDocuments";
import hitMavQAndGetResponse from "@salesforce/apex/DocumentsUploadController.hitMavQAndGetResponse";
import globalCss from "@salesforce/resourceUrl/globalCss";
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class JobDocumentsUpload extends LightningElement {
    @track documentData = [
        {
            key: "1",
            keyName: "socialSecurity",
            title: "Social Security Card",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "2",
            keyName: "stateIssuedID",
            title: "State Issued ID",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "3",
            keyName: "employmentAuthorization",
            title: "Employment Authorization Document",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "4",
            keyName: "visaDocuments",
            title: "Visa Documents",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "5",
            keyName: "workPermits",
            title: "Work Permits for people under 18",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "6",
            keyName: "backgroundChecks",
            title: "Background Checks",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "7",
            keyName: "acceptedFormats",
            title: "W-2 Forms for Tax Purposes",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "8",
            keyName: "previousEmployerReferrals",
            title: "Previous Employer Referrals",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "9",
            keyName: "previousEmployerReviews",
            title: "Previous Employer Awards/Performance Reviews",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "10",
            keyName: "layoff",
            title: "Lay-off Letter",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        {
            key: "11",
            keyName: "supportingDocuments",
            title: "Any supporting Documents",
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        }
    ];
    @track deleteFileList = [];
    @track showSpinner;

    get acceptedFormats() {
        return [".pdf", ".png", ".jpg", ".jpeg"];
    }
    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
        this.showSpinner = true;
        getDocuments()
            .then((result) => {
                for (let index = 0; index < this.documentData.length; index++) {
                    result.forEach(value => {
                        if (this.documentData[index].keyName == value.keyName) {
                            this.documentData[index] = { ...this.documentData[index], ...value };
                        }
                    });
                }
                this.showSpinner = false;

            })
            .catch((error) => {
                console.log("getUploadData Error: ", error);
                this.showSpinner = false;
            });
    }
    handleFileUpload(event) {
        this.showSpinner = true;
        let key = event.target.dataset.id;
        let name = event.target.name;
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            //         this.showToast("Warning", "User name dosen't match with name on certificate!", "warning");
            let base64 = reader.result.split(",")[1];
            hitMavQAndGetResponse({
                base64Value: base64
            })
                .then((result) => {
                    this.showSpinner = false;
                    var temp = JSON.parse(result);
                    console.log("getapiData result: ", JSON.stringify(temp));
                    console.log('Date :>> ', temp['DATE']);
                    if (temp['DATE'] != undefined) {
                        for (let index = 0; index < temp['DATE'].length; index++) {
                            var expDate = temp['DATE'][index]['value'];
                            var todaysDate = new Date().toISOString().slice(0, 10);
                            var formatedExpDate = new Date(expDate).toISOString().slice(0, 10);
                            // Change the logic below
                            if (formatedExpDate < todaysDate) {
                                this.documentData[key - 1].keyName = name;
                                this.documentData[key - 1].fileName = file.name;
                                this.documentData[key - 1].base64 = base64;
                                this.documentData[key - 1].showFiles = true;
                                break;
                            }
                            else {
                                this.showToast("Warning", "Certificate is expired!", "warning");
                            }
                        }
                    }
                })
                .catch((error) => {
                    this.showSpinner = false;
                    this.showToast("Warning", "Invalid File " + error, "warning");
                });
        };
        reader.readAsDataURL(file);
    }
    // preview button click operation
    handlePreviewFile(event) {
        let keyVale = event.target.dataset.id;
        let baseURL = "https://" + location.host + "/";
        var docId;
        docId = this.documentData[keyVale - 1].ContentVerId;
        if (!docId) {
            this.showToast("Warning", "Please submit file before preview!", "warning");
        }
        else {
            let fileURL =
                baseURL +
                "sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
                docId;
            window.open(fileURL, "_blank");
        }
    }
    //delete button click operation
    handleDeleteFile(event) {
        let keyValue = event.target.dataset.id;
        const temp = {
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        };
        if (this.documentData[keyValue - 1].ContentDocId) {
            this.deleteFileList.push(this.documentData[keyValue - 1].ContentDocId);
        }
        for (const index in temp) {
            this.documentData[keyValue - 1][index] = temp[index];
        }
    }
    //sumbit button click operation
    handleSubmit() {
        uploadDocuments({
            dataList: JSON.stringify(this.documentData),
            deleteList: this.deleteFileList
        })
            .then((result) => {
                console.log('result :>> ', result);
                // this.showToast("Success", "Data Uploaded successfully", "success");
                this.showSpinner = false;
                location.reload();
            })
            .catch((error) => {
                console.log("Error: ", error);
                this.showToast("Error", "Error on upload " + error, "error");

                this.showSpinner = false;
            });
    }
    //show toast method
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}