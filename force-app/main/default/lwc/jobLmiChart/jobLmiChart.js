import { LightningElement,track,wire } from 'lwc';
import chartResource from "@salesforce/resourceUrl/ChartJs";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";


export default class JobLmiChart extends LightningElement {
    connectedCallback() {
        this.loadChartResource();
    }
    loadChartResource() {
        loadScript(this, chartResource)
            .then(() => {
                //this.callBarChart();
                this.callBarChart();
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    }
    callBarChart() {

        const DATA_COUNT = 7;
        //const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

        //const labels = Utils.months({count: 7});
        const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
            label: 'Dataset 1',
            data: [1,2,3,4,5,6,7]
            },
            {
            label: 'Dataset 2',
            data: [8,9,10,11]
            }
        ]
        };
        
        const config = {
            type: "bar",
            data: 
                data,
            options: {
                responsive: true,
                indexAxes: 'y',
                elements: {
                    bar: {
                      borderWidth: 2,
                    }
                  },
                legend: {
                    display: false,
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
            },
        };
        this.insertToDOM("div.barChart", config);
    }
    insertToDOM(divclass, config) {
        const canvas = document.createElement("canvas");
        const chartNode = this.template.querySelector(divclass);
        chartNode.innerHTML = "";
        chartNode.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        this.chart = new window.Chart(ctx, config);
    }

}