import { api, LightningElement, track } from "lwc";

export default class JobLmiTable extends LightningElement {
    @api columns;
    @api tableData;
    @api hideCheckbox;
    @track currentData = [];
    @track currentIndex = 0;
    @track currentPage = 0;
    @track totalPages = 0;

    connectedCallback() {
        this.currentData = [];
        this.currentIndex = 0;
        this.currentPage = 0;
        this.totalPages = 0;
        if (this.tableData.length > 0) {
            this.totalPages = Math.ceil(this.tableData.length / 10);
            for (let i = this.currentIndex; i < 10; i++) {
                if (this.tableData.length - 1 > i)
                    this.currentData.push(this.tableData[i]);
            }
            this.currentData.push(this.tableData[this.tableData.length - 1]);
            this.currentIndex = 10;
            this.currentPage = 1;
        }
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentData = [];
            for (
                let i = this.currentIndex - 10;
                i > this.currentIndex - 20;
                i--
            ) {
                this.currentData.push(this.tableData[i]);
            }
            this.currentData.push(this.data[this.tableData.length - 1]);
            this.currentIndex = this.currentIndex - 10;
            this.currentPage--;
        }
    }
    handleNext() {
        if (this.currentPage + 1 <= this.totalPages) {
            this.currentData = [];
            for (let i = this.currentIndex; i < this.currentIndex + 10; i++) {
                if (this.data.length - 1 > i)
                    this.currentData.push(this.tableData[i]);
            }
            this.currentData.push(this.tableData[this.tableData.length - 1]);
            this.currentIndex = this.currentIndex + 10;
            this.currentPage++;
        }
    }
}