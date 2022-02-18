import { LightningElement,track } from 'lwc';
import selectionimage from '@salesforce/resourceUrl/selectionpage';
import { NavigationMixin } from 'lightning/navigation';

export default class PortalSelectionComp extends NavigationMixin(LightningElement) {

    @track BackgroundImage = 'background-image: url('+selectionimage + '/image.png)';
    @track employerimg = selectionimage + '/image1.png';
    @track jobimage = selectionimage + '/image2.png';

    handleJobLogin(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://mtxwfm.force.com/s/'
            }
        } 
      );
    }

    handleEmployeeLogin(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://mtxwfm.force.com/eportal/s/'
            }
        }
      );
    }
}