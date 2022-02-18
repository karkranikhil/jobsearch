import { LightningElement, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
//fetching Picklist Values:
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import DEGREE from "@salesforce/schema/Education_Details__c.Degree__c";
import EDUCATION_TYPE from "@salesforce/schema/Education_Details__c.Education_Type__c";
import SCHOOL_COLLEGE_UNIVERSITY from "@salesforce/schema/Education_Details__c.School_College_University__c";
import LEVEL_OF_EDUCATION from "@salesforce/schema/Education_Details__c.Level_Of_Education__c";
//Fetching and Updating data:
import updateEducationDetails from "@salesforce/apex/EducationDetailsController.updateEducationDetails";
import fetchEducationDetails from "@salesforce/apex/EducationDetailsController.fetchEducationDetails";

export default class JobEducationDetails extends NavigationMixin(
    LightningElement
) {
    @track showSpinner = true;
    @track keyIndex = 1;
    @track educationList = [];
    @track deleteList = [];
    @track deleteFileList = [];

    @track education = {
        Id: "",
        levelOfEducation: "",
        currentlyPursuing: false,
        degree: "",
        educationType: "",
        startDate: null,
        endDate: null,
        schoolCollegeUniversity: "",
        description: "",
        certificatonUploadData: {
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        },
        key: 0,
    };

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: DEGREE,
    })
    degreeOptions;
    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: EDUCATION_TYPE,
    })
    educationTypeOptions;
    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: SCHOOL_COLLEGE_UNIVERSITY,
    })
    schoolOptions;
    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: LEVEL_OF_EDUCATION,
    })
    levelOptions;

    get acceptedFormats() {
        return [".pdf", ".png", ".jpeg"];
    }

    connectedCallback() {
        this.fetcher();
    }

    fetcher() {
        fetchEducationDetails()
            .then((result) => {
                console.log("FetchEducationDetails Result: ", result);
                this.educationList = JSON.parse(result);
                if (this.educationList.length < 1) {
                    this.educationList.push(this.education);
                    this.educationList[0].key = 1;
                    this.keyIndex++;
                } else {
                    this.keyIndex = this.educationList.length;
                }
                this.showSpinner = false;
            })
            .catch((error) => {
                console.log("FetchEducationDetails error: ", error);
                this.showSpinner = false;
            });
    }

    addRow() {
        this.keyIndex++;
        this.education.key = this.keyIndex;

        this.educationList.push(JSON.parse(JSON.stringify(this.education)));
    }
    removeRow(event) {
        let key = event.target.dataset.id;
        console.log(key);
        if (this.educationList.length > 1) {
            if (this.educationList[key - 1].Id != "")
                this.deleteList.push(this.educationList[key - 1].Id);
            this.educationList.splice(key - 1, 1);
            this.keyIndex--;
        }
        this.educationList.forEach((item, index) => {
            item.key = index + 1;
        });
    }
    handleOnChange(event) {
        let key = event.target.dataset.id;
        let val = event.target.value;
        let name = event.target.name;
        if (name == "currentlyPursuing") {
            if (event.target.checked) {
                this.educationList[key - 1][name] = true;
                this.educationList[key - 1]["endDate"] = null;
            } else {
                this.educationList[key - 1][name] = false;
            }
        } else {
            this.educationList[key - 1][name] = val;
        }
    }
    handleFileUpload(event) {
        let key = event.target.dataset.id;
        let name = event.target.name;
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            let base64 = reader.result.split(",")[1];
            this.educationList[key - 1].certificatonUploadData.fileName =
                file.name;
            this.educationList[key - 1].certificatonUploadData.base64 = base64;
            this.educationList[key - 1].certificatonUploadData.showFiles = true;
            //console.log(JSON.stringify(this.educationList[key - 1][name]));
        };
        reader.readAsDataURL(file);
    }
    handlePreviewFile(event) {
        let key = event.target.dataset.id;
        let baseURL = "https://" + location.host + "/";
        console.log(baseURL);
        let fileURL =
            baseURL +
            "sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
            this.educationList[key - 1].certificatonUploadData.ContentVerId;
        console.log("FileURL: ", fileURL);
        window.open(fileURL, "_blank");
    }
    handleDeleteFile(event) {
        let key = event.target.dataset.id;
        const temp = {
            fileName: "",
            base64: "",
            ContentDocId: "",
            ContentVerId: "",
            showFiles: false,
        };
        if (
            this.educationList[key - 1].certificatonUploadData.ContentDocId !=
            ""
        )
            this.deleteFileList.push(
                this.educationList[key - 1].certificatonUploadData.ContentDocId
            );
        this.educationList[key - 1].certificatonUploadData = temp;
    }

    handleNext() {
        const event = new CustomEvent("child", {
            detail: { stageNo: "4", prevStageNo: "3" },
        });
        this.dispatchEvent(event);
    }
    handleBack() {
        const event = new CustomEvent("child", {
            detail: { stageNo: "2", prevStageNo: "3" },
        });
        this.dispatchEvent(event);
    }
    handleSave() {
        console.log(
            "EducationList: ",
            JSON.stringify(this.educationList),
            "\nDeleteList: ",
            JSON.stringify(this.deleteList),
            "\nDeleteFileList: ",
            JSON.stringify(this.deleteFileList)
        );
        this.showSpinner = true;
        updateEducationDetails({
            educationList: JSON.stringify(this.educationList),
            deleteList: this.deleteList,
            deleteFileList: this.deleteFileList,
        })
            .then((result) => {
                this.educationList = [];
                this.deleteList = [];
                console.log("saveEducationDetails result: ", result);
                this.fetcher();
                this.showToast("Success", "Data saved successfully", "success");
            })
            .catch((error) => {
                this.showSpinner = false;
                console.log("saveEducationDetails error: ", error);
                this.showToast("Error", error, "error");
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    get showDelete() {
        if (this.educationList.length > 1) return true;
        return false;
    }

    get showCombobox() {
        if (
            this.degreeOptions.data != null &&
            this.degreeOptions.data.values != null &&
            this.levelOptions.data != null &&
            this.levelOptions.data.values != null &&
            this.schoolOptions.data != null &&
            this.schoolOptions.data.values != null &&
            this.educationTypeOptions.data != null &&
            this.educationTypeOptions.data.values != null
        )
            return true;
        return false;
    }
}

//author: Abel David Solomon
//Date: 29th Dec, 2021