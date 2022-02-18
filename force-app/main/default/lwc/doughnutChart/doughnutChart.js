import { api, LightningElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import chartJs from "@salesforce/resourceUrl/ChartJs";

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
export default class DoughnutChart extends LightningElement {
    @api chartClass = "doughnutChart1";
    @api values;
    @api labels;

    connectedCallback() {
        loadScript(this, chartJs)
            .then(() => {
                console.log("ChartJs is loaded");
                this.createDoughnutChart();
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
    createDoughnutChart() {
        const config = {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: this.values,
                        backgroundColor: colors,
                        label: "",
                        hoverBackgroundColor: colors,
                    },
                ],
                labels: this.labels,
            },
            options: {
                responsive: true,
                cutoutPercentage: 70,
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return (
                                data["labels"][tooltipItem["index"]] +
                                ": " +
                                data["datasets"][0]["data"][
                                    tooltipItem["index"]
                                ] +
                                "%"
                            );
                        },
                    },
                },
                legend: {
                    display: true,
                    position: "right",
                    align: "center",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 10,
                        borderWidth: 0,
                    },
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
            },
        };
        this.insertToDOM("div." + this.chartClass, config);
    }
}