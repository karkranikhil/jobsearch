import { LightningElement,track } from 'lwc';
import jobImages from '@salesforce/resourceUrl/jobImages';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
import createUser from '@salesforce/apex/UserRegistrationController.createPortalUser';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class JobRegisterForm extends LightningElement {
    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);
    }
   
    @track googleIcon = jobImages + '/images/google_icon.svg';
   @track data = {
        userFirstName: "",
       userLastName: "",
       userEmail: ""
   }

   handleChange(event){
        if (event.target.name == 'firstName') {
            this.data.userFirstName = event.target.value;
        }
        if (event.target.name == 'lastName') {
            this.data.userLastName = event.target.value;
            
        }if (event.target.name == 'email') {
            this.data.userEmail = event.target.value;
            
        }
        // if (event.target.name == 'password') {
        //     this.data.password = event.target.value;  
        // }
   }
   handleRegister(){
        console.log('data :>> ',JSON.stringify(this.data));
        createUser({
            input : JSON.stringify(this.data)
        })
        .then(data => {
            if(data != ''){
                const event = new ShowToastEvent({
                    title: 'Error !!',
                    variant : 'error',
                    message: data,
                });
                this.dispatchEvent(event);
            } else{
                const event = new ShowToastEvent({
                    title: 'Success',
                    variant : 'success',
                    message: 'User Successfully Created in the system.',
                });
                this.dispatchEvent(event);
                window.open('/s/login','_self');
            }
        })
        .catch(error => {
            console.log(JSON.stringify(error));
            const event = new ShowToastEvent({
                title: 'Error!!',
                variant : 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
        })
   }
}