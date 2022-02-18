import { LightningElement, track } from 'lwc';
import TestFilesController from "@salesforce/apex/TestFilesController.testFile";
import  PDFJS from '@salesforce/resourceUrl/PDFJS_Folder';
// import PDFWORKER from '@salesforce/resourceUrl/PDFWorker';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';


export default class HttpFormBuilder extends LightningElement {

    @track testValue;
    @track datass = '';
    @track DataArr = [];
    @track pdf;
    @track pdfWorker;
    @track pdfArray=[];


    handleFile(event){

        TestFilesController()
        .then((data) =>
        {
       // console.log('Inside method');
            this.testValue = data;
            //console.log('TestValue>>' +this.testValue);
            var raw = window.atob(this.testValue);
            var rawLength = raw.length;
            this.pdfArray = new Uint8Array(new ArrayBuffer(rawLength));

            for (var i = 0; i < rawLength; i++) {
                this.pdfArray[i] = raw.charCodeAt(i);
            }
            //console.log('PDF as array' +this.pdfArray);
        this.pdfAsArray(this.pdfArray);
       })
    }
    connectedCallback(){
        Promise.all([loadScript(this, PDFJS + '/PDFJS/pdf.js'), loadScript(this, PDFJS + '/PDFJS/pdf.worker.js')]).then(()=>{
            console.log('PDF JS loaded');
            this.pdf = PDFJS + '/PDFJS/pdf.js';
            this.pdfWorker = PDFJS + '/PDFJS/pdf.worker.js';
            // PDFJS.workerSrc = '';
            //PDFJS.workerSrc = this.pdfWorker;
            pdfjsLib.GlobalWorkerOptions.workerSrc = this.pdfWorker;
            
        }).catch((error)=>{
            console.log(' Error loading scripts '+ error);
        })
    }


     pdfAsArray(pdfArray) {
         //console.log('pdfArray' +pdfArray);
       pdfjsLib.getDocument(pdfArray).then(function (pdf) {
            var pdfDocument = pdf;
            var pagesPromises = [];
            for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
                (function (pageNumber) {     
                    pagesPromises.push(this.getPageText(pageNumber, pdfDocument));
                })(i + 1);
            }
            // Execute all the promises
            Promise.all(pagesPromises).then(function (pagesText) {
                console.log(pagesText); // representing every single page of PDF Document by array indexing
                console.log(pagesText.length);
                var outputStr = "";
                for (var pageNum = 0; pageNum < pagesText.length; pageNum++) {
                    console.log(pagesText[pageNum]);
                    outputStr = "";
                    outputStr = "<br/><br/>Page " + (pageNum + 1) + " contents <br/> <br/>";
                    var div = document.getElementById('output');
                    div.innerHTML += (outputStr + pagesText[pageNum]);
                }
            });

        }, function (reason) {   
            console.error(reason);
        });         
    }

     getPageText(pageNum, PDFDocumentInstance) {
       
        return new Promise(function (resolve, reject) {
            PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
                pdfPage.getTextContent().then(function (textContent) {
                    var textItems = textContent.items;
                    var finalString = "";
                    for (var i = 0; i < textItems.length; i++) {
                        var item = textItems[i];
                        finalString += item.str + " ";
                    } 
                    resolve(finalString);
                });
            });
        });
    }
   
}