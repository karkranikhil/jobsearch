import { api, LightningElement, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import jobImages from "@salesforce/resourceUrl/jobImages";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import workbook from "@salesforce/resourceUrl/writeExcel";

import getJobsEQData from "@salesforce/apex/JobsEQController.getJobsEQData";
import getOccupationGapData from "@salesforce/apex/JobsEQController.getOccupationGapData";
import getSkillGapData from "@salesforce/apex/JobsEQController.getSkillGapData";
import getOccupationalDiversityData from "@salesforce/apex/JobsEQController.getOccupationalDiversityData";

const DELAY = 300;

const columnAnalysis = [
    { label: "SOC", fieldName: "socCode", hideDefaultActions: true },
    { label: "Occupation", fieldName: "title", hideDefaultActions: true },
    { label: "Employment", fieldName: "employment", hideDefaultActions: true },
    {
        label: "Average Ann Wages",
        fieldName: "avgWages",
        hideDefaultActions: true,
    },
    {
        label: "Total Demands",
        fieldName: "forecastTotalDemand",
        hideDefaultActions: true,
    },
    {
        label: "Sepration Exits",
        fieldName: "separationExits",
        hideDefaultActions: true,
    },
    {
        label: "Separation Transfers",
        fieldName: "separationTransfers",
        hideDefaultActions: true,
    },
    { label: "Ann%", fieldName: "forecastPctGrowth", hideDefaultActions: true },
    { label: "Trend", fieldName: "trend", hideDefaultActions: true },
    {
        label: "Amount Growth",
        fieldName: "forecastGrowth",
        hideDefaultActions: true,
    },
];
const columnTalent = [
    { label: "Zip", fieldName: "zip" },
    { label: "Name", fieldName: "name" },
    { label: "2020 Employment", fieldName: "2020employment" },
];
const jobChart = [
    { label: "% of Job", fieldName: "percentageOfJob" },
    { label: "Jobs", fieldName: "jobs" },
];
const colors = [
    "rgb(244 63 94)",
    "rgb(251 191 36)",
    "rgb(55 135 255)",
    "rgb(250 116 0)",
    "rgb(124 0 182)",
    "rgb(0 205 156)",
    "rgb(211 190 0)",
    "rgb(244 138 138)",
    "rgb(142 205 197)",
    "rgb(104 113 114)",
    "rgb(80 117 181)",
    "rgb(150 171 211)",
    "rgb(248 138 60)",
    "rgb(253 199 99)",
    "rgb(66 173 158)",
    "rgb(142 205 197)",
    "rgb(104 113 114)",
];
export default class JobLmiPage extends LightningElement {
    @track rectangleImage = jobImages + "/images/rectangle_icon.png";

    columnAnalysis = columnAnalysis;
    columnTalent = columnTalent;
    jobChart = jobChart;
    data = [];
    @track ageBreakDownValues = [];
    @track ageBreakDownLabels = [];
    @track genderBreakDownValues = [];
    @track genderBreakDownLabels = [];
    @track raceBreakDownValues = [];
    @track raceBreakDownLabels = [];
    @track educationalAttainmentBreakDownValues = [];
    @track educationalAttainmentBreakDownLabels = [];
    @track occupationalGapLabels = [];
    @track occupationalGapValues = [];
    @track occupationalGapColors = [];
    @track skillGapLabels = [];
    @track skillGapValues = [];
    @track skillGapColors = [];
    @track showDoughnutChart;
    @track showSkillGapChart;
    @track showOccupationGapChart;
    @track showLMI;
    @track showOccupation;
    @track showMapView;
    @track searchDetails;
    // @api searchRegionType;
    // @api searchRegionCode;

    @track dataTable = [];
    isLoading = false;

    /*Chart Js Code Start */
    connectedCallback() {
        console.log("Im connected callback");
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
        loadScript(this, workbook)
            .then(async (data) => {
                console.log("writeExcel success------>>>", data);
            })
            .catch((error) => {
                console.log("writeExcel failure-------->>>>", error);
            });

        this.showLMI = "display: block";
        this.showOccupation = "display: none";
        this.showMapView = false;
    }

    /*Chart Js Code end */

    dataAnalysis = [
        {
            industry: "UI/UX Designing",
            empl: "21,229,98",
            wages: "$200,999",
            ann: "1.0%",
            trend: "",
            amountgrowth: "1.0%",
        },
        {
            industry: "UI/UX Designing",
            empl: "21,229,98",
            wages: "$200,999",
            ann: "1.0%",
            trend: "",
            amountgrowth: "1.0%",
        },
        {
            industry: "UI/UX Designing",
            empl: "21,229,98",
            wages: "$200,999",
            ann: "1.0%",
            trend: "",
            amountgrowth: "1.0%",
        },
        {
            industry: "UI/UX Designing",
            empl: "21,229,98",
            wages: "$200,999",
            ann: "1.0%",
            trend: "",
            amountgrowth: "1.0%",
        },
        {
            industry: "UI/UX Designing",
            empl: "21,229,98",
            wages: "$200,999",
            ann: "1.0%",
            trend: "",
            amountgrowth: "1.0%",
        },
    ];

    dataTalent = [
        {
            zip: "76104",
            name: "Fort Worth, TX (in Tarrant county) … ",
            "2020employment": "291",
        },
        {
            zip: "76102",
            name: "Fort Worth, TX (in Tarrant county) … ",
            "2020employment": "234",
        },
        {
            zip: "76092",
            name: "Fort Worth, TX (in Tarrant county) … ",
            "2020employment": "166",
        },
        {
            zip: "76051",
            name: "Fort Worth, TX (in Tarrant county) … ",
            "2020employment": "143",
        },
        {
            zip: "76132",
            name: "Fort Worth, TX (in Tarrant county) … ",
            "2020employment": "128",
        },
    ];
    jobChartValues = [
        {
            percentageOfJob: "0.2%",
            jobs: 7,
        },
        {
            percentageOfJob: "5.8%",
            jobs: 187,
        },
        {
            percentageOfJob: "23.4%",
            jobs: 757,
        },
        {
            percentageOfJob: "26.7%",
            jobs: 865,
        },
    ];

    //Abel's Code below this:
    regions = [];
    @track showTable = false;
    handleSearch(event) {
        console.log("HandleSearch: ", JSON.stringify(event.detail));
        this.searchDetails = event.detail;
        this.isLoading = true;
        this.template.querySelector("c-job-lmi-occupation-wages").jobDetails =
            this.searchDetails;
        this.template
            .querySelector("c-job-lmi-occupation-wages")
            .refreshOccupationWages();
        getJobsEQData({
            regionType: this.searchDetails.regionType,
            regionCode: this.searchDetails.regionCode,
            occupationCode: this.searchDetails.occupationCode,
        })
            .then((result) => {
                console.log("getJobsEQData Result: ", result);
                let temp = JSON.parse(result);
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
                this.isLoading = false;
            })
            .catch((error) => {
                console.log("getJobsEQData error: ", error);
                this.isLoading = false;
            });

        this.ageBreakDownLabels = [];
        this.ageBreakDownValues = [];
        this.genderBreakDownValues = [];
        this.genderBreakDownLabels = [];
        this.raceBreakDownLabels = [];
        this.raceBreakDownValues = [];
        this.educationalAttainmentBreakDownLabels = [];
        this.educationalAttainmentBreakDownValues = [];
        this.occupationalGapLabels = [];
        this.occupationalGapValues = [];
        this.occupationalGapColors = [];
        this.skillGapValues = [];
        this.skillGapLabels = [];
        this.skillGapColors = [];

        this.showDoughnutChart = false;
        this.showOccupationGapChart = false;
        this.showSkillGapChart = false;
        this.refreshGraphs();
    }
    refreshGraphs() {
        getOccupationGapData({
            regionCode: this.searchDetails.regionCode,
            regionType: this.searchDetails.regionType,
            occupationCode: this.searchDetails.occupationCode,
        })
            .then((result) => {
                console.log("getOccupationGapData Result: ", result);
                let series = JSON.parse(result).chart.series;
                let categories = JSON.parse(result).chart.categories;
                series[0].data.forEach((element) => {
                    const value = element.value.displayText;
                    const color = element.color;
                    this.occupationalGapColors.push(color);
                    this.occupationalGapValues.push(value);
                });
                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    this.occupationalGapLabels.push(category);
                }
                if (this.occupationalGapLabels.length > 0)
                    this.showOccupationGapChart = true;
            })
            .catch((error) => {
                console.log("getOccupationGapData Error: ", error);
            });

        getSkillGapData({
            regionCode: this.searchDetails.regionCode,
            regionType: this.searchDetails.regionType,
            occupationCode: this.searchDetails.occupationCode,
        })
            .then((result) => {
                console.log("getSkillGapData Result: ", result);
                let series = JSON.parse(result).chart.series;
                let categories = JSON.parse(result).chart.categories;
                series[0].data.forEach((element) => {
                    let value = element.value;
                    const color = element.color;
                    value = +value.toFixed(2);
                    this.skillGapColors.push(color);
                    this.skillGapValues.push(value);
                });
                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    this.skillGapLabels.push(category);
                }
                if (this.skillGapValues.length > 0)
                    this.showSkillGapChart = true;
            })
            .catch((error) => {
                console.log("getSkillGapData Error: ", error);
            });

        getOccupationalDiversityData({
            regionCode: this.searchDetails.regionCode,
            regionType: this.searchDetails.regionType,
            occupationCode: this.searchDetails.occupationCode,
        })
            .then((result) => {
                console.log("getOccupationalDiversityData Result: ", result);
                this.ageBreakDownLabels =
                    JSON.parse(result).charts[0].categories;
                this.educationalAttainmentBreakDownLabels =
                    JSON.parse(result).charts[1].categories;
                this.raceBreakDownLabels =
                    JSON.parse(result).charts[2].categories;
                this.genderBreakDownLabels =
                    JSON.parse(result).charts[4].categories;
                let temp = JSON.parse(result).charts[4].series[0].data;
                temp.forEach((element) => {
                    this.genderBreakDownValues.push(element.displayText);
                });
                temp = JSON.parse(result).charts[2].series[0].data;
                temp.forEach((element) => {
                    this.raceBreakDownValues.push(element.displayText);
                });
                temp = JSON.parse(result).charts[1].series[0].data;
                temp.forEach((element) => {
                    this.educationalAttainmentBreakDownValues.push(
                        element.displayText
                    );
                });
                temp = JSON.parse(result).charts[0].series[0].data;
                temp.forEach((element) => {
                    this.ageBreakDownValues.push(element.displayText);
                });
                this.convertToPercent();
                this.showDoughnutChart = true;
            })
            .catch((error) => {
                console.log("getOccupationalDiversityData Error: ", error);
            });
    }
    handleShowOccupation(event) {
        this.showLMI = "display: none";
        this.showOccupation = "display: block";
        this.showMapView = false;
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
    handleShowMapView(event) {
        this.showLMI = "display: none";
        this.showOccupation = "display: none";
        this.showMapView = true;
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
    handleBackFromOccupation(event) {
        this.showLMI = "display: block";
        this.showOccupation = "display: none";
    }
    handleBackFromMapView(event) {
        this.showLMI = "display: block";
        this.showMapView = false;
    }

    convertToPercent() {
        let sum = 0;
        this.ageBreakDownValues.forEach((element) => {
            sum += element;
        });
        for (let i = 0; i < this.ageBreakDownValues.length; i++) {
            this.ageBreakDownValues[i] = Math.round(
                (this.ageBreakDownValues[i] / sum) * 100
            );
        }
        sum = 0;
        this.raceBreakDownValues.forEach((element) => {
            sum += element;
        });
        for (let i = 0; i < this.raceBreakDownValues.length; i++) {
            this.raceBreakDownValues[i] = Math.round(
                (this.raceBreakDownValues[i] / sum) * 100
            );
        }
        sum = 0;
        this.genderBreakDownValues.forEach((element) => {
            sum += element;
        });
        for (let i = 0; i < this.genderBreakDownValues.length; i++) {
            this.genderBreakDownValues[i] = Math.round(
                (this.genderBreakDownValues[i] / sum) * 100
            );
        }
        sum = 0;
        this.educationalAttainmentBreakDownValues.forEach((element) => {
            sum += element;
        });
        for (
            let i = 0;
            i < this.educationalAttainmentBreakDownValues.length;
            i++
        ) {
            this.educationalAttainmentBreakDownValues[i] = Math.round(
                (this.educationalAttainmentBreakDownValues[i] / sum) * 100
            );
        }
    }
    schemaObj = [
        // Column #1
        {
            column: "SOC",
            type: String,
            value: (records) => records.socCode,
        },
        // Column #2
        {
            column: "Occupation",
            type: String,
            value: (records) => records.title,
        },
        // Column #3
        {
            column: "Employment",
            type: Number,
            // format: '#,##0',
            value: (records) => records.employment,
        },
        // Column #4
        {
            column: "Average Ann Wages",
            type: Number,
            // format: '#,##0',
            value: (records) => records.avgWages,
        },
        // Column #5
        {
            column: "Total Demands",
            type: Number,
            // format: '#,##0',
            value: (records) => records.forecastTotalDemand,
        },
        // Column #6
        {
            column: "Sepration Exits",
            type: Number,
            // format: '#,##0',
            value: (records) => records.separationExits,
        },

        // Column #8
        {
            column: "Separation Transfers",
            type: Number,
            // format: '#,##0',
            value: (records) => records.separationTransfers,
        },
        // Column #9
        {
            column: "Ann%",
            type: Number,
            // format: '#,##0',
            value: (records) => records.forecastPctGrowth,
        }, // Column #7
        {
            column: "Amount Growth",
            type: Number,
            // format: '#,##0',
            value: (records) => records.forecastGrowth,
        },
    ];
    async handleExport() {
        let _self = this;
        await writeXlsxFile(_self.dataTable, {
            schema: _self.schemaObj,
            fileName: "LMIData.xlsx",
        });
    }
    get totalRecords() {
        return this.dataTable.length;
    }
}