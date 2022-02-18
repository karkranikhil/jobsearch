import { LightningElement, track } from "lwc";
import myCourse from "@salesforce/resourceUrl/myCourse";
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import getAllCourses from "@salesforce/apex/LMS_Controller.getAllCourses";
import createUser from "@salesforce/apex/LMS_Controller.createUser";

export default class JobMyCourses extends LightningElement {
    @track cardData = [
        {
            id: "1",
            body: "This course is dedicated to programmers who are already familiar with the world of programming and are looking to become acquainted with the Java programming language",
            owner: "JAVA for programmers",
            ownerImg: myCourse + "/java.png",
            banner: "1",
            location: "HCMC",
            birthday: "Dec 2021",
            view: "8/10",
            isCheck: false,
        },
        {
            id: "2",
            body: "This is an all-in-one class that covers everything in Angular v2 12. You can develop web applications, understand more about Angular fundamentals, develop your knowledge of the Angular application",
            owner: "Angular — The Complete Guide",
            ownerImg: myCourse + "/angularJs.png",
            banner: "1",
            location: "HCMC",
            birthday: "Jan 2022",
            view: "9/10",
            isCheck: true,
        },
        {
            id: "3",
            body: "DevOps skills are in demand! DevOps skills are expected to be one of the fastest-growing skills in the workforce. This course can be a first step in obtaining those skills.",
            owner: "Introduction to DevOps",
            ownerImg: myCourse + "/devOps.png",
            banner: "1",
            location: "HCMC",
            birthday: "Nov 2021",
            view: "7/10",
            isCheck: true,
        },
    ];

    @track allCourses = [];
    @track myCourses = [];
    @track userExistInLMS;
    @track showMyCourses = true;
    @track showAllCourses = false;
    @track cardImage = myCourse + "/devOps.png";
    @track showSpinner = false;
    connectedCallback() {
        this.showSpinner = true;
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
        // console.log('data :>> ', JSON.stringify(this.cardData));
        getAllCourses()
            .then((result) => {
                console.log("getAllCourses Result: ", result);
                let temp = result.substring(1);
                temp = temp.slice(0, -1);
                let xy = temp.replaceAll('\\"', '"');
                xy = xy.replaceAll('\\"', '"');
                console.log("Temp unparsed: ", xy);
                let temp2 = JSON.parse(xy);
                console.log("temp parsed: ", temp2);
                this.allCourses = temp2.ccw;
                this.myCourses = temp2.userEnrollments;
                if (this.allCourses[0].errorMessage == "No User Found") {
                    this.userExistInLMS = false;
                } else {
                    this.userExistInLMS = true;
                }

                this.showSpinner = false;
            })
            .catch((error) => {
                console.log("getAllCourses Error: ", error);
                this.showSpinner = false;
            });
    }

    handleFilterChange(event) {
        console.log(event.target.value);
        if (event.target.value == "myCourses") {
            this.showMyCourses = true;
            this.showAllCourses = false;
        } else {
            this.showMyCourses = false;
            this.showAllCourses = true;
        }
    }

    registerOnLMS() {
        // this.showSpinner = true;
        // this.template.querySelector(".registerLMS").innerHTML =
        //     "<p>Please Check you Email for a Reset Passoword mail. After Resetting you Password, Refresh this page to View Courses and Enroll Yourself.</p>";

        createUser()
            .then((result) => {
                console.log("createUser Result: ", result);
                this.template.querySelector(".registerLMS").innerHTML =
                "<p>Please Check you Email for a Reset Passoword mail. After Resetting you Password, Refresh this page to View Courses and Enroll Yourself.</p>";    
                this.showSpinner = false;
            })
            .catch((error) => {
                console.log("createUser Error: ", error);
                this.showSpinner = false;
            });
    }
}