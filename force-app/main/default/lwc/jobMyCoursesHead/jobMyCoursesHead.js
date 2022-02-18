import { LightningElement,track,wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";

export default class JobMyCoursesHead extends NavigationMixin(LightningElement) {

    activeTab;
    @track tabData = 'My Courses';

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
        
        if (currentPageReference.state) {
            this.activeTab = currentPageReference.state['tabset-daab7'];
            if (this.activeTab == undefined) {
                this.tabData = 'My Courses';
            }
            else if (this.activeTab == 2) {
                this.tabData = 'My Calendar';
            }
            else{
                this.tabData = 'Recommended Course';
            }
        }
    }
}