import { LightningElement, track } from 'lwc';
 import jobImages from '@salesforce/resourceUrl/jobImages';

export default class UploadYourCv extends LightningElement {



    @track uploadcbBG = jobImages + '/images/uploadcbBG.png';
   @track uploadcbCV = jobImages + '/images/uploadCV_icon.svg';

}