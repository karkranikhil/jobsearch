import { LightningElement, api, track, wire } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import globalCss from "@salesforce/resourceUrl/globalCss";
const THUMBS = ['start', 'end'];

import { getPicklistValues } from "lightning/uiObjectInfoApi";
import JOB_STATUS_FIELD from "@salesforce/schema/Job_Post__c.Job_Status__c";
import INDUSTRY_TYPE_FIELD from "@salesforce/schema/Job_Post__c.Industry_Type__c";
import EMPLOYMENT_TYPE_FIELD from "@salesforce/schema/Job_Post__c.Employment_Type2__c";
import LOCATION_FIELD from "@salesforce/schema/Job_Post__c.Location__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import addJobPostInformation from '@salesforce/apex/EmployeePostJobController.employeePostJob';
import addJobPostEvent from '@salesforce/apex/EmployeePostJobController.addJobPostEvent';
import getAccountName from '@salesforce/apex/EmployeePostJobController.getAccountName';

export default class JobPostAJob extends LightningElement {


    @track showEvent = false;
    @track showSpinner = false;
    @track jobPostId;
    @track accountName;
    @track accountWebsite;
    @track inputVar='';
    @track pills=[];

    @track jobPostList = [
        {
            company: this.accountName,
            jobTitle: "",
            location: "",
            employmentType: "",
            industryType: "",
            jobStatus: "",
            jobResponsibilities: "",
            jobDescription: "",
            salaryRange: " 4600$ to 12000$",
        },
    ];

    @track addEventList = [
        {
            eventName: "",
            virtualLink: "",
            eventDate: null,
            startTime: null,
            endTime: null,
            eventDescription: "",
            eventFile: {
                fileName: "",
                base64: "",
            },

        },
    ];

    //Slider logic
    _max = 200000;
    _min = 0;
    _step = 1;
    _start = 46000;
    _end = 120000;
    _startValueInPixels;
    _endValueInPixels;

    // Elements
    slider;
    sliderRange;
    currentThumb;
    currentThumbName;   // selected Thumb name
    currentThumbPositionX; // shift x - selected thumb left position 
    maxRange = 300; // right edge of slider
    isMoving = false;
    rendered = false;


    handleChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.jobPostList[0][name] = value;
        this.jobPostList[0]['company'] = this.accountName;
        console.log('Joblist>>>' + JSON.stringify(this.jobPostList[0]));
    }

    handleEventChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.addEventList[0][name] = value;
    }

    connectedCallback() {
        Promise.all([loadStyle(this, globalCss + "/globalCss.css")]);

        getAccountName()
            .then((result) => {
                var data = JSON.parse(result);
                this.accountName = data.Account.Name != undefined ? data.Account.Name : 'Not Available';
                this.accountWebsite = data.Account.Website != undefined ? data.Account.Website : 'No Available';
            })
            .catch((error) => {
                console.log("Account Name error:", error);
            })

    }

    handleSave(event) {

        addJobPostInformation({
            jobPostList: JSON.stringify(this.jobPostList[0]),

        })
            .then((result) => {
                this.jobPostId = result;

                this.showToast("Success", "Job Posted Successfully", "success");
            })
            .catch((error) => {
                this.showSpinner = false;
                console.log("saveJobDetails error: ", error);
                this.showToast("Error", error, "error");
            });
        if (this.showEvent == true && this.jobPostList[0].eventDate != null) { 
        addJobPostEvent({
            addEventList: JSON.stringify(this.addEventList[0]),
            jobPostId: this.jobPostId,

        })
            .then((result) => {
                this.addEventList = [];

                this.showToast("Success", "Event Created Successfully", "success");
            })
            .catch((error) => {
                this.showSpinner = false;
                console.log("saveEventDetails error: ", error);
                this.showToast("Error", error, "error");
            });
        }
    }

    onAddressChange(event) {
        
    }
    get acceptedFormats() {
        return [".pdf", ".png", ".jpeg"];
    }

    handleUploadFinished(event) {

        const File = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.addEventList[0].eventFile = {
                'fileName': File.name,
                'base64': base64,
            }
        }
        reader.readAsDataURL(File)

    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: JOB_STATUS_FIELD,
    })
    jobStatusPicklist;
    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: EMPLOYMENT_TYPE_FIELD,
    })
    empTypePicklist;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: INDUSTRY_TYPE_FIELD,
    })
    industryTypePicklist;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: LOCATION_FIELD,
    })
    locationPicklist;

    get showCombobox() {
        if (
            this.locationPicklist.data != null &&
            this.locationPicklist.data.values != null &&
            this.industryTypePicklist.data != null &&
            this.industryTypePicklist.data.values != null &&
            this.jobStatusPicklist.data != null &&
            this.jobStatusPicklist.data.values != null &&
            this.empTypePicklist.data != null &&
            this.empTypePicklist.data.values != null
        )
            return true;
        return false;
    }
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    handleEventButton(event) {
        let name = event.target.name;
        if (name == 'yes') { this.showEvent = true }
        else if (name == 'no') { this.showEvent = false }
    }

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    handleSkillChange(event)
    {
        this.inputVar = event.target.value;
    }
    handleSkillsClick(event)
    {
        this.pills.push(this.inputVar);
        this.inputVar='';
    }
    handleRemovePills(event){
        this.pills.pop(event.target.value);
    }













































    @api
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = parseFloat(value);
    }
    @api
    get max() {
        return this._max;
    }
    set max(value) {
        this._max = parseFloat(value);
    }

    @api
    get step() {
        return this._step;
    }
    set step(value) {
        this._step = parseFloat(value);
    }

    @api
    get start() {
        return this._start;
    };
    set start(value) {
        this._start = this.setBoundries(value);
    }
    @api
    get end() {
        return this._end;
    };
    set end(value) {
        this._end = this.setBoundries(value);
    }

    get rangeValue() {
        return Math.abs(this.end - this.start);
    }

    renderedCallback() {
        if (!this.rendered) {
            this.initSlider();
            this.rendered = true;
        }
    }

    initSlider() {
        this.slider = this.template.querySelector('.slider');
        this.sliderRange = this.template.querySelector('.range');
        const thumb = this.template.querySelector('.thumb');
        if (this.slider && thumb) {
            this.maxRange = this.slider.offsetWidth - thumb.offsetWidth;
            // set initial thumbs
            this._startValueInPixels = this.convertValueToPixels(this.start);
            this._endValueInPixels = this.convertValueToPixels(this.end);
            this.setThumb('start', this._startValueInPixels);
            this.setThumb('end', this._endValueInPixels);
            this.setRange(this._startValueInPixels, this._endValueInPixels);
        }
    }

    setBoundries(value) {
        let _value = typeof value === 'number' ? value : parseFloat(value);
        _value = _value < 0 ? 0 : value; // MIN
        return _value > this.max ? this.max : _value; // MAX
    }

    convertValueToPixels(value) {
        return parseFloat(((value / this.max) * this.maxRange).toFixed(2));
    }

    convertPixelsToValue(value, step = 1) {
        let _value = parseFloat((value / this.maxRange) * this.max);
        // round to step value
        _value = step > 0 ? Math.round(_value / step) * step : _value;
        return parseFloat(_value.toFixed(2));
    }


    handleMouseDown(event) {
        const thumbId = event.target.dataset.name;
        // allow move
        if (THUMBS.includes(thumbId)) {
            this.currentThumbName = thumbId;
            this.currentThumb = event.target;
            const startX = event.clientX || event.touches[0].clientX;
            this.currentThumbPositionX = startX - this.currentThumb.getBoundingClientRect().left;
            this.toggleActiveThumb(true);
            this.isMoving = true;
        }
        else {
            event.preventDefault();
        }
    }


    onMouseMove(event) {
        // track mouse mouve only when toggle true
        if (this.isMoving) {
            const currentX = event.clientX || event.targetTouches[0].clientX;
            let moveX = currentX - this.currentThumbPositionX - this.slider.getBoundingClientRect().left;

            let moveValue = this.convertPixelsToValue(moveX, this.step);
            // lock the thumb within the bounaries
            moveValue = this.setBoundries(moveValue);
            moveX = this.convertValueToPixels(moveValue);

            switch (this.currentThumbName) {
                case 'start':
                    this._startValueInPixels = moveX;
                    this._start = moveValue;
                    break;
                case 'end':
                    this._endValueInPixels = moveX;
                    this._end = moveValue;
                    break;
            }
            this.setThumb(this.currentThumbName, moveX);
            this.setRange(this._endValueInPixels, this._startValueInPixels);
        }
        else {
            event.preventDefault();
        }
    }

    onMouseUp(event) {
        this.isMoving = false;
        this.toggleActiveThumb(false);
        // publish
        this.onChangeValue();
        event.preventDefault();
    }


    setThumb(thumbName, valueInPixels) {
        const thumbs = this.slider.querySelectorAll('.thumb');
        thumbs.forEach(thumb => {
            if (thumb.dataset.name === thumbName) {
                thumb.style.setProperty('--thumb-left-position', `${valueInPixels}px`);
            }
        });
    }

    toggleActiveThumb(toggle = true) {
        const color = toggle ? '#bb202d' : '#1b5297';
        this.currentThumb.style.setProperty('--thumb-active-color', color);
    }

    setRange(start, end) {
        const maxThumb = Math.max(start, end);
        const minThumb = Math.min(start, end);
        const width = Math.abs(maxThumb - minThumb);
        this.sliderRange.style.setProperty('--range-left-position', `${minThumb}px`);
        this.sliderRange.style.setProperty('--range-width', `${width}px`);
    }

    onChangeValue() {
        this.jobPostList[0]['salaryRange'] = this.start + '$ to ' + this.end + '$';

        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                start: this.start,
                end: this.end,
                range: this.rangeValue
            }
        }));

    }

}