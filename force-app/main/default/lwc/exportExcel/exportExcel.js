import { LightningElement } from 'lwc';
import { loadScript } from "lightning/platformResourceLoader";
import workbook from "@salesforce/resourceUrl/writeExcel";

export default class ExportExcel extends LightningElement {

    librariesLoaded = false;
    objectsData = [
        // Object #1
        {
            name: 'John Smith',
            dateOfBirth: new Date(),
            cost: 1800,
            paid: true
        },
        // Object #2
        {
            name: 'Alice Brown Alice Brown Alice Brown Alice Brown Alice Brown Alice Brown',
            dateOfBirth: new Date(),
            cost: 2600,
            paid: false
        }
    ]
    schemaObj = [
        // Column #1
        {
            column: 'Name',
            type: String,
            wrap: 'true',
            color: '#ccaaaa',
            value: student => student.name
        },
        // Column #2
        {
            column: 'Date of Birth',
            type: Date,
            format: 'mm/dd/yyyy',
            value: student => student.dateOfBirth
        },
        // Column #3
        {
            column: 'Cost',
            type: Number,
            format: '#,##0.00',
            value: student => student.cost
        },
        // Column #4
        {
            column: 'Paid',
            type: Boolean,
            value: student => student.paid
        }
    ]
    renderedCallback() {
        console.log("renderedCallback xlsx");
        if (this.librariesLoaded) return;
        this.librariesLoaded = true;
        loadScript(this, workbook)
            .then(async (data) => {
                console.log("success------>>>", data);
            })
            .catch(error => {
                console.log("failure-------->>>>", error);
            });
    }
    // calling the download function from xlsxMain.js
    async download() {
        let _self = this;
        // When passing `objects` and `schema`.
        await writeXlsxFile(_self.objectsData, {
            schema: _self.schemaObj,
            fileName: 'file.xlsx'
        })
    }

}