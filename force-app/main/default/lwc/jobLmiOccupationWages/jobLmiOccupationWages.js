import { api, LightningElement, track } from "lwc";
import globalCss from "@salesforce/resourceUrl/globalCss";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import getOccupationWages from "@salesforce/apex/JobsEQController.getOccupationWages";
import workbook from "@salesforce/resourceUrl/writeExcel";

export default class JobLmiOccupationWages extends LightningElement {
    @api jobDetails;
    @track columns = [];
    @track data = [];
    librariesLoaded = false;
    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    }
    @api refreshOccupationWages() {
        this.columns = [];
        this.data = [];
        getOccupationWages({
            regionCode: this.jobDetails.regionCode,
            regionType: this.jobDetails.regionType,
            occupationCode: this.jobDetails.occupationCode,
        })
            .then((result) => {
                console.log("getOccupationWages Result: ", result);
                let temp = JSON.parse(result);
                temp.table.columns.forEach((element) => {
                    if (element.name != null) {
                        let col = {
                            label: element.name,
                            fieldName: element.name,
                            hideDefaultActions: true,
                        };
                        this.columns.push(col);
                    }
                });
                let jsonObjectColumns = this.columns.map(JSON.stringify); //to remove duplicate columns
                let uniqueSetColumns = new Set(jsonObjectColumns);
                let uniqueArrayColumns = Array.from(uniqueSetColumns).map(
                    JSON.parse
                );
                this.columns = uniqueArrayColumns;
                temp.table.rows.forEach((element) => {
                    let dataVal = {
                        [this.columns[0].fieldName]: element[3].displayText,
                        [this.columns[1].fieldName]: element[4],
                        [this.columns[2].fieldName]: element[5],
                        [this.columns[3].fieldName]: element[6],
                        [this.columns[4].fieldName]: element[7],
                        [this.columns[5].fieldName]: element[8],
                        [this.columns[6].fieldName]: element[9],
                        [this.columns[7].fieldName]: element[10],
                        [this.columns[8].fieldName]: element[11],
                        [this.columns[9].fieldName]: element[12],
                    };
                    this.data.push(dataVal);
                });
                console.log("Columns: ", JSON.stringify(this.columns));
                console.log("tableData: ", JSON.stringify(this.data));
            })
            .catch((error) => {
                console.log("getOccupationWages Error: ", error);
            });
    }
    handleBack() {
        const event = new CustomEvent("back", {
            detail: {},
        });
        this.dispatchEvent(event);
    }
    schemaObj = [
        // Column #1
        {
            column: "Occupation",
            type: String,
            value: (data) => data.name,
        },
        // Column #2
        {
            column: "Mean",
            type: Number,
            value: (data) => data.mean,
        },
        // Column #3
        {
            column: "Entry Level",
            type: Number,
            // format: '#,##0',
            value: (data) => data.entryLevel,
        },
        // Column #4
        {
            column: "Experienced",
            type: Number,
            // format: '#,##0',
            value: (data) => data.experienced,
        },
        // Column #5
        {
            column: "10%",
            type: Number,
            // format: '#,##0',
            value: (data) => data.tenPer,
        },
        // Column #6
        {
            column: "25%",
            type: Number,
            // format: '#,##0',
            value: (data) => data.twentyFivePer,
        },

        // Column #8
        {
            column: "50% (Median)",
            type: Number,
            // format: '#,##0',
            value: (data) => data.median,
        },
        // Column #9
        {
            column: "75%",
            type: Number,
            // format: '#,##0',
            value: (data) => data.seventyFivePer,
        }, // Column #7
        {
            column: "90%",
            type: Number,
            // format: '#,##0',
            value: (data) => data.ninetyPer,
        },
    ];

    renderedCallback() {
        console.log("renderedCallback xlsx");
        if (this.librariesLoaded) return;
        this.librariesLoaded = true;
        loadScript(this, workbook)
            .then(async (data) => {
                console.log("writeExcel success------>>>", data);
            })
            .catch((error) => {
                console.log("writeExcel failure-------->>>>", error);
            });
    }

    async handleExport() {
        //alert('Boom');
        let _self = this;
        // When passing `objects` and `schema`.
        await writeXlsxFile(_self.data, {
            schema: _self.schemaObj,
            fileName: "OccupationWagesData.xlsx",
        });
    }

    get isDataNotNull() {
        return this.data.length > 0;
    }
}