import { LightningElement, track } from 'lwc';
import myCourse from '@salesforce/resourceUrl/myCourse';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";

export default class JobRecommendedCourses extends LightningElement {
    @track window = myCourse + "/My Course/angularJs.png";

    @track fullCalenderShow = false;
   @track cardData = [
        {
            "id": "1",
            "body": "This course will help you to develop the unique skill needed to build API and web applications. This program will provide you good information on designing and building databases for software applications.",
            "owner": "Become a Full Stack Web Developer",
            "ownerImg": myCourse + "/fullStack.png",
            "banner": "1",
            "location": "HCMC",
            "birthday": "Jan 2022",
            "view": "9/10",
            "isCheck": false
        }
    ];

    @track showSpinner = false;
    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
        console.log('data :>> ', JSON.stringify(this.cardData));

    }
}