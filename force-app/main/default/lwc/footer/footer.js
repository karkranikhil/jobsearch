import { LightningElement, track } from 'lwc';
import jobImages from '@salesforce/resourceUrl/jobImages';
export default class Footer extends LightningElement {
    @track logo = jobImages + '/images/coljobs.png';
    @track facebook = jobImages + '/images/followus_facebook_icon.svg';
    @track googleIcons = jobImages + '/images/followUs_google_icon.svg';
    @track linkedin = jobImages + '/images/followus_linkedin_icon.svg';

    handlechange(event){
        window.open('/s/job-search?title=' + event.target.dataset.name , '_self');
    }
    handleContact(){
        window.open('/s/job-contact-us', '_self');

    }
}