import { LightningElement, track } from 'lwc';
import jobImages from '@salesforce/resourceUrl/jobImages';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import Search_Job from "@salesforce/resourceUrl/Search_Job";

export default class JobNotificationPage extends LightningElement {
    
    @track googleIcon = Search_Job;
    @track showSpinner = false;
    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
      }

      handleCourse(event){
        window.open('/s/my-courses?tabset-daab7=baba6','_self');
      }

      handleClick(event){
        let str= event.currentTarget.dataset.name;
        //console.log('str=='+str);
        window.open(
          "/s/job-search?title=" +
              str,
          "_self"
      );
        //window.open('/s/my-courses?tabset-daab7=baba6','_self');
      }


}