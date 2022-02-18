import { LightningElement, track, wire, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import { NavigationMixin } from 'lightning/navigation';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import MomentTimeZone from '@salesforce/resourceUrl/MomentTimezone';
import fetchEvents1 from '@salesforce/apex/FullCalendarService.fetchAllEvents';

const timeZone = TIME_ZONE;

export default class JobFullCalendar extends NavigationMixin(LightningElement) {
    fullCalendarJsInitialised = false;
    @track url_param = 'test';
    // @api isPopup = false;
    @track events = [];
    @track isModalOpen = false;
    @track sendDate;
    @track modalData = {};
    @track taskIdURL;
    @track applicationId;
    isWritten = false;

    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }
    renderedCallback() {
        if (this.fullCalendarJsInitialised) {
            return;
        }
        this.fullCalendarJsInitialised = true;
        Promise.all([
            loadScript(this, MomentTimeZone + "/MomentTimezone.js"),
            loadStyle(this, FullCalendarJS + "/FullCalendarJS/fullcalendar.min.css"),
            loadScript(this, FullCalendarJS + "/FullCalendarJS/jquery.min.js"),
            loadScript(this, FullCalendarJS + "/FullCalendarJS/moment.min.js"),
            loadScript(this, FullCalendarJS + "/FullCalendarJS/fullcalendar.min.js")
        ])
            .then(() => {
                console.log('initialiseFullCalendarJs');
                this.renderfetchEvents1function();
                this.initialiseFullCalendarJs();

            })
            .catch((ex) => {
                console.log('error in promise ' + ex);
                console.error({
                    message: "Error occured on FullCalendarJS",
                    ex,
                });
            }
            )
    }
    initialiseFullCalendarJs() {
        const ele = this.template.querySelector("div.fullcalendarjs");
        $(ele).fullCalendar({
            header: {
                left: "prev,next today",
                center: "title",
                right: "year,month,agendaWeek,agendaDay",
            },
            scrollTime: '06:00:00',
            aspectRatio: 2,
            defaultDate: new Date(), // default day is today - to show the current date
            defaultView: 'month', //To display the default view - as of now it is set to week view
            navLinks: true, // can click day/week names to navigate views
            selectable: true, //To select the period of time
            eventLimit: false,
            events: this.events,
            eventClick: (calEvent, jsEvent, view) => {
                this.isModalOpen = true;
                this.modalData = calEvent;
                console.log('Sent to Popup'+calEvent.start);
                this.sendData = Date.parse(calEvent.start);
                console.log('Event Id',calEvent.id);
                this.eventId = calEvent.id;
            }
        });
    }
    renderfetchEvents1function() {
        fetchEvents1()
            .then(data => {
                let events = data.map(event => {
                    return {
                        id: event.Id,
                        title: event.Subject,
                        start: moment(event.StartDateTime).utc().format(),
                        end: moment(event.EndDateTime).tz(timeZone).format(),
                        allDay: event.IsAllDayEvent,
                    };
                });
                this.events = JSON.parse(JSON.stringify(events));
                const ele = this.template.querySelector("div.fullcalendarjs");
                $(ele).fullCalendar('renderEvents', this.events, true);
            })
            .catch(error => {
                this.error = error;
                console.log('ERRORfetchevents ' + JSON.stringify(this.error));

            })
    }
}