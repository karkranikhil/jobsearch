import { api, LightningElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import chartJs from "@salesforce/resourceUrl/ChartJs";

export default class DivergingHorizontalBarChart extends LightningElement {
    @api chartClass = "divergingBarChart1";
    @api values;
    @api colors;
    @api labels;

    connectedCallback() {
        loadScript(this, chartJs)
            .then(() => {
                console.log("ChartJs is loaded");
                this.createDivergingHorizontalBarChart();
            })
            .catch((error) => {
                console.log("ChartJs error: ", error);
            });
    }
    insertToDOM(divclass, config) {
        const canvas = document.createElement("canvas");
        const chartNode = this.template.querySelector(divclass);
        chartNode.innerHTML = "";
        chartNode.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        this.chart = new window.Chart(ctx, config);
    }
    createDivergingHorizontalBarChart() {
        const config = {
            type: "horizontalBar",
            data: {
                datasets: [
                    {
                        data: this.values,
                        backgroundColor: this.colors,
                        borderWidth: 1,
                    },
                ],
                labels: this.labels,
            },
            options: {
                indexAxis: "y",
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    bar: {
                        borderWidth: 1,
                    },
                },
                responsive: true,
                legend: {
                    display: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: "Chart.js Horizontal Bar Chart",
                    },
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                drawOnChartArea: false,
                            },
                        },
                    ],
                },
            },
        };
        this.insertToDOM("div." + this.chartClass, config);
    }
}