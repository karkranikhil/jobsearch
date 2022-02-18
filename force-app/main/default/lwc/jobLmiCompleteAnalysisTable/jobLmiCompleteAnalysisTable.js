import { LightningElement, api, track } from "lwc";
const DELAY = 300;
import { loadScript } from "lightning/platformResourceLoader";
import workbook from "@salesforce/resourceUrl/writeExcel";

export default class JobLmiCompleteAnalysisTable extends LightningElement {
    @api showTable = false;
    @api records;
    @api recordsperpage;
    @api columns;
    librariesLoaded = false;

    @track recordsToDisplay;

    totalRecords;
    pageNo;
    totalPages;
    startRecord;
    endRecord;
    end = false;
    pagelinks = [];
    isLoading = false;
    defaultSortDirection = "asc";
    sortDirection = "asc";
    ortedBy;
    connectedCallback() {
        this.isLoading = true;
        this.setRecordsToDisplay();
    }

    renderedCallback() {
        console.log("renderedCallback table ", JSON.stringify(this.records));
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
    setRecordsToDisplay() {
        this.totalRecords = this.records.length;
        this.pageNo = 1;
        this.totalPages = Math.ceil(this.totalRecords / this.recordsperpage);
        this.preparePaginationList();

        for (let i = 1; i <= this.totalPages; i++) {
            this.pagelinks.push(i);
        }
        this.isLoading = false;
    }
    handleClick(event) {
        let label = event.target.title;
        if (label === "First") {
            this.handleFirst();
        } else if (label === "Previous") {
            this.handlePrevious();
        } else if (label === "Next") {
            this.handleNext();
        } else if (label === "Last") {
            this.handleLast();
        }
    }
    handleNext() {
        this.pageNo += 1;
        this.preparePaginationList();
    }

    handlePrevious() {
        this.pageNo -= 1;
        this.preparePaginationList();
    }

    handleFirst() {
        this.pageNo = 1;
        this.preparePaginationList();
    }

    handleLast() {
        this.pageNo = this.totalPages;
        this.preparePaginationList();
    }
    preparePaginationList() {
        this.isLoading = true;
        let begin = (this.pageNo - 1) * parseInt(this.recordsperpage);
        let end = parseInt(begin) + parseInt(this.recordsperpage);
        this.recordsToDisplay = this.records.slice(begin, end);

        this.startRecord = begin + parseInt(1);
        this.endRecord = end > this.totalRecords ? this.totalRecords : end;
        this.end = end > this.totalRecords ? true : false;

        // const event = new CustomEvent('pagination', {
        //     detail: {
        //         records: this.recordsToDisplay
        //     }
        // });
        // this.dispatchEvent(event);

        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.disableEnableActions();
        }, DELAY);
        this.isLoading = false;
    }
    disableEnableActions() {
        let buttons = this.template.querySelectorAll("lightning-button");

        buttons.forEach((bun) => {
            if (bun.title === this.pageNo) {
                bun.disabled = true;
            } else {
                bun.disabled = false;
            }

            if (bun.title === "First") {
                bun.disabled = this.pageNo === 1 ? true : false;
            } else if (bun.title === "Previous") {
                bun.disabled = this.pageNo === 1 ? true : false;
            } else if (bun.title === "Next") {
                bun.disabled = this.pageNo === this.totalPages ? true : false;
            } else if (bun.title === "Last") {
                bun.disabled = this.pageNo === this.totalPages ? true : false;
            }
        });
    }
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
    }

    handlePage(button) {
        this.pageNo = button.target.title;
        this.preparePaginationList();
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

    async download() {
        let _self = this;
        // When passing `objects` and `schema`.
        await writeXlsxFile(_self.records, {
            schema: _self.schemaObj,
            fileName: "LMIData.xlsx",
        });
    }
}