import { LightningElement, track, wire, api } from 'lwc';
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import BIRTHCITY_FIELD from "@salesforce/schema/User.Birth_City__c";
import EMPLOYMENTSTATUS_FIELD from "@salesforce/schema/User.Employment_Status__c";
import ETHNICITY_FIELD from "@salesforce/schema/User.Ethnicity__c";
import RACE_FIELD from "@salesforce/schema/User.Race__c";
import LANGUAGE_FIELD from "@salesforce/schema/User.LanguageLocaleKey";
import SELECTIVESERVICE_FIELD from "@salesforce/schema/User.Selective_Service_Males_Certain_Age__c";
import VETERAN_FIELD from "@salesforce/schema/User.Veteran__c";
import GENDER_FIELD from "@salesforce/schema/User.Gender__c";
import HIGH_EDUCATION from "@salesforce/schema/User.Highest_level_of_Education_Achieved__c";
import updateUserDetails from '@salesforce/apex/JobPersonalDetailsController.updateUserDetails';
import getUserInformation from '@salesforce/apex/JobPersonalDetailsController.getUserInformation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class JobPersonalDetails extends LightningElement {

  @track showSpinner = true;
  
  @track userList =
    {
      name: "",
      fname: "",
      mname: "",
      lname: "",
      userNameOrUniqueId: "",
      dob: null,
      gender: "",
      ssNumber: "",
      email: "",
      highestEducation: "",
      workAuthentication: false,
      employmentStatus: "",
      veteranEligibleSpouse: "",
      veteranEligibleSpouseBool:false,
      disablilityAccomodations: false,
      DiscloseDisability: false,
        DifficultyHearing: false,
        DifficultySeeing: false,
        PhysicalOrMental: false,
      primaryLanguage: "",
      birthCity: "",
      firstNameAlias: "",
      race: "",
      ethnicity: "",
      informedConsentQuestions: "",
      currentSchoolStatus: false,
      selfEmployment: false,
      PublicAssistanceInTheLast6Months: false,
      DoYouHaveALowIncome: false,
      Noticeperiod: false,
      Areyouhomemaker: false,
      Areyouunderemployed: false,
      selectiveService: "",
      resumeFile: {
        fileName: "",
        base64: "",
        ContentDocId: "",
        ContentVerId: "",
        showFiles: false,
      },
      licenseFile: {
        fileName: "",
        base64: "",
        ContentDocId: "",
        ContentVerId: "",
        showFiles: false,
      }
    }
    @track deleteFileList = [];

    get employed(){
      return this.userList.employmentStatus == 'Active';
    }
  connectedCallback()
  {
    this.fetcher();
  }

  fetcher() {
    
    getUserInformation()
      .then((result) => {
        this.userList = result;
        console.log('userList :>> ', JSON.stringify(this.userList));
        this.userList.veteranEligibleSpouseBool= this.userList.veteranEligibleSpouse == 'Yes'? true: false;
        
        this.showSpinner = false;
      })
      .catch((error) => {
        console.log("error: ", error);
        this.showSpinner = false;
      });
  }

  handleSSNChange(event){
    const x = event.target.value
         .replace(/\D+/g, '')
         .match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
    event.target.value = x[1] + '-' + x[2] + '-' + x[3];
    if (event.target.name == "ssNumber") {
      this.userList.ssNumber = event.target.value;
    }
  }

  handleChange(event) {
    let value = event.target.value;
    let name = event.target.name;
    if(value == 'true'){
      this.userList[name] = true;
    }
    else if(value == 'false'){
      this.userList[name] = false;
    }
    else
    this.userList[name] = value;
    console.log('userList>>>' + JSON.stringify(this.userList));
  }
  get radioOptionsCheckboxes() {
    return [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ];
  }
  get radioOptionsCheckboxes2() {
    return [
      { label: "Yes", value: 'Yes' },
      { label: "No", value: 'No' },
    ];
  }
  get radioOptions2() {
    return [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "other" },
    ];
  }
  get acceptedFormats() {
    return [".pdf", ".png", ".jpeg"];
  }

  get showCombobox() {
    if (
      this.birthCityPicklist.data != undefined &&
      this.birthCityPicklist.data.values != undefined &&
      this.employmentStatusPicklist.data != undefined &&
      this.employmentStatusPicklist.data.values != undefined &&
      this.ethnicityPicklist.data != undefined &&
      this.ethnicityPicklist.data.values != undefined &&
      this.racePicklist.data != undefined &&
      this.racePicklist.data.values != undefined &&
      this.selectiveServicePicklist.data != undefined &&
      this.selectiveServicePicklist.data.values != undefined &&
      this.veteranPicklist.data != undefined &&
      this.veteranPicklist.data.values != undefined &&
      this.genderPicklist.data != undefined &&
      this.genderPicklist.data.values != undefined &&
      this.nativeLanguagePicklist.data != undefined &&
      this.nativeLanguagePicklist.data.values != undefined &&
      this.highEducationPicklist.data != undefined &&
      this.highEducationPicklist.data.values != undefined &&
      this.gendervalues.data != undefined &&
      this.gendervalues.data.values != undefined 
    )
      return true;
    return false;
  }

  handleSave() {
    this.saveUserDetails('save');
  }

  handleNext() {
    this.saveUserDetails('next');
  }

  saveUserDetails(button) {
    this.showSpinner = true;
    updateUserDetails({
      userList: JSON.stringify(this.userList),
      deleteFileList: this.deleteFileList,
    })
      .then(result => {
        this.userList=[];
        this.fetcher();
        
        if (button == 'save') {
          this.showToast("Success", "Data saved successfully", "success");
        }
        else {
          const event = new CustomEvent("child", {
            detail: { stageNo: "2", prevStageNo: "1" },
          });
          this.dispatchEvent(event);
        }
      })
      .catch(error => {
        this.showSpinner = false;
        this.showToast("Error", error, "error");
        console.log("saveUserDetails error: ", JSON.stringify(error));
      });

  }
  handleUploadFinished(event) {
    let uploadName = event.target.name;
    
    if (uploadName == "resumeUpload") {
      const rFile = event.target.files[0]
      var reader = new FileReader()
      reader.onload = () => {
        var base64 = reader.result.split(',')[1]
        this.userList.resumeFile = {
          'fileName': 'R_' +rFile.name,
          'base64': base64,
          'showFiles' : true,
        }
        
      }
      reader.readAsDataURL(rFile)
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: GENDER_FIELD,
  })
  gendervalues;
  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: HIGH_EDUCATION,
  })
  highEducationPicklist;
  
  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: BIRTHCITY_FIELD
  }) 
  birthCityPicklist;

  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: EMPLOYMENTSTATUS_FIELD
  })
  employmentStatusPicklist;

  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: ETHNICITY_FIELD
  })
  ethnicityPicklist;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: RACE_FIELD
  })
  racePicklist;
  
  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: SELECTIVESERVICE_FIELD
  })
  selectiveServicePicklist;
  
  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: LANGUAGE_FIELD
  })
  nativeLanguagePicklist;
  
  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: VETERAN_FIELD
  })
  veteranPicklist;
  
  handlePreviewFile(event) {
    let eventName = event.target.name;
    if(eventName == 'previewResume'){
    let baseURL = "https://" + location.host + "/";
   
    let fileURL =
        baseURL +
        "sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
        this.userList.resumeFile.ContentVerId;
    
    window.open(fileURL, "_blank");
    } 
}
handleDeleteFile(event) {
let eventName = event.target.name;

    const temp = {
        fileName: "",
        base64: "",
        ContentDocId: "",
        ContentVerId: "",
        showFiles: false,
    };
    if ((this.userList.resumeFile.ContentDocId !="") && (eventName == 'deleteResume')){
      
        this.deleteFileList.push(
          this.userList.resumeFile.ContentDocId
        );
        this.userList.resumeFile = temp;
    }
}

showToast(title, message, variant) {
  const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
  });
  this.dispatchEvent(evt);
}
}