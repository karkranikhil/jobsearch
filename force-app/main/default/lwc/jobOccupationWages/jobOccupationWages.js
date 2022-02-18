import { LightningElement,track } from 'lwc';

import jobImages from "@salesforce/resourceUrl/jobImages";
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";

import getOccupationWages from "@salesforce/apex/JobsEQController.getOccupationWages";

export default class JobOccupationWages extends LightningElement {


    @track columns = [];
    @track data = [];
    @track currentIndex = 0;
    @track currentData = [];
    @track totalPages = 0;
    @track currentPage = 0;
    @track showSpinner = false;
    @track showOccupation;
    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);

        getOccupationWages()
            .then((result) => {
                console.log("getOccupationWages Result: ", result);
                let temp = JSON.parse(result);
                temp.table.columns.forEach((element) => {
                    if (
                        element.name != null &&
                        this.columns.indexOf(element.name) == -1
                    ) {
                        this.columns.push(element.name);
                    }
                });
                temp.table.rows.forEach((element) => {
                    let dataVal = {};
                    dataVal.name = element[3].displayText;
                    dataVal.mean = element[4];
                    dataVal.entryLevel = element[5];
                    dataVal.experienced = element[6];
                    dataVal.tenPer = element[7];
                    dataVal.twentyFivePer = element[8];
                    dataVal.median = element[9];
                    dataVal.seventyFivePer = element[10];
                    dataVal.ninetyPer = element[11];
                    dataVal.usa = element[12];
                    this.data.push(dataVal);
                });
                this.totalPages = Math.ceil(this.data.length / 10);
                for (let i = this.currentIndex; i < 10; i++) {
                    if (this.data.length - 1 > i)
                        this.currentData.push(this.data[i]);
                }
                this.currentData.push(this.data[this.data.length - 1]);
                this.currentIndex = 10;
                this.currentPage = 1;
                console.log(
                    "Columns: ",
                    JSON.stringify(this.columns),
                    this.data.length
                );
                console.log("Data: ", JSON.stringify(this.data));
            })
            .catch((error) => {
                console.log("getOccupationWages Error: ", error);
            });
            this.showOccupation = false;
    }
    handleBack() {
        const event = new CustomEvent("back", {
            detail: {},
        });
        this.dispatchEvent(event);
    }
    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentData = [];
            for (
                let i = this.currentIndex - 10;
                i > this.currentIndex - 20;
                i--
            ) {
                this.currentData.push(this.data[i]);
            }
            this.currentData.push(this.data[this.data.length - 1]);
            this.currentIndex = this.currentIndex - 10;
            this.currentPage--;
        }
    }
    handleNext() {
        if (this.currentPage + 1 <= this.totalPages) {
            this.currentData = [];
            for (let i = this.currentIndex; i < this.currentIndex + 10; i++) {
                if (this.data.length - 1 > i)
                    this.currentData.push(this.data[i]);
            }
            this.currentData.push(this.data[this.data.length - 1]);
            this.currentIndex = this.currentIndex + 10;
            this.currentPage++;
        }
    }

    regions = [];
    @track showTable = false;
    handleSearch(event) {
        console.log("HandleSearch: ", JSON.stringify(event.detail));
        let searchDetails = event.detail;
        this.isLoading = true;
        getJobsEQData({
            regionType: searchDetails.regionType,
            regionCode: searchDetails.regionCode,
            occupationCode: searchDetails.occupationCode,
        })
            .then((result) => {
                let temp = JSON.parse(result);
                console.log("getJobsEQData result: ", result);
                if (Array.isArray(temp.data)) {
                    temp.data.forEach((row) => {
                        row.socCode = row.soc.code;
                    });
                    this.dataTable = temp.data;
                    this.showTable = true;
                } else {
                    console.log("No Data Found");
                    this.showTable = false;
                }

                //console.log("Data: ", JSON.stringify(this.dataTable));
                this.isLoading = false;
            })
            .catch((error) => {
                console.log("getJobsEQData error: ", error);
                this.isLoading = false;
            });
    }
    handleShowOccupation(event) {
        this.showLMI = false;
        this.showOccupation = true;
    }
    handleBackFromOccupation(event) {
        this.showLMI = true;
        this.showOccupation = false;
    }
 

}