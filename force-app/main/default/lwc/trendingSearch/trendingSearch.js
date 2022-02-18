import { LightningElement, track } from 'lwc';
import jobImages from '@salesforce/resourceUrl/jobImages';

export default class TrendingSearch extends LightningElement {

    @track trendingSearches = jobImages + '/images/trendingSearch_Icon.svg';
    handlechange(event){
        window.open('/s/job-search?title=' + event.target.dataset.name , '_self');
    }
}