import { LightningElement,api } from 'lwc';

export default class JobApplicantsContainer extends LightningElement {
    
     data1 = [
        {
            id: 1,
            name: "Billy Simonns",
            AppliedDate: "12/01/2022",
            Status: "Pending",
            ph: 3344949449,
        },
        {
            id: 2,
            name: "Kelsey Denesik",
            AppliedDate: "10/01/2022",
            Status: "Pending",
            ph: 6349496444,
        },
        {
            id: 3,
            name: "Kyle Ruecker",
            AppliedDate: "10/01/2022",
            Status: "Pending",
            ph: 9821298756,
        },
        
    ];
    
     columns1 = [
        {
            label: "Candidate",
            fieldName: "name",
            cellAttributes: {
                iconName: "utility:user",
                Name: "user",
                alignment: "Right",
            },
        },
        // { label: 'Candidate', fieldName: 'name' },
        { label: "Applied Date", fieldName: "AppliedDate" },
        { label: "Interview Status", fieldName: "Status" },
        { label: "Phone number", fieldName: "ph" },
    
        {
            fieldName: "",
            label: "Action",
            cellAttributes: { iconName: "utility:download",
                               label: 'Resume',  
                                name: 'Resume',  
                                title: 'Resume',},
        },
        {type: "button", typeAttributes: {  
            label: 'Accept',  
            name: 'Accept',  
            title: 'Accept',  
            disabled: false,  
            variant: 'brand',
            value: 'accept',  
            iconPosition: 'left'  
        }},  
        {type: "button", typeAttributes: {  
            label: 'Reject',  
            name: 'Reject',  
            title: 'Reject',  
            disabled: false,  
            variant: 'brand',
            value: 'reject',  
            iconPosition: 'left'  
        }} ,
    ];
    data2 = [
        {
            id: 1,
            name: "Mark Anthony",
            AppliedDate: "19/01/2022",
            Status: "Pending",
            ph: 6456453456,
        },
        {
            id: 2,
            name: "Denise John",
            AppliedDate: "19/01/2022",
            Status: "Pending",
            ph: 9089087890,
        },
        {
            id: 3,
            name: "Hailey Mark",
            AppliedDate: "18/01/2022",
            Status: "Pending",
            ph: 9898789878,
        },
        
    ];
    
     columns2 = [
        {
            label: "Candidate",
            fieldName: "name",
            cellAttributes: {
                iconName: "utility:user",
                Name: "user",
                alignment: "Right",
            },
        },
        // { label: 'Candidate', fieldName: 'name' },
        { label: "Applied Date", fieldName: "AppliedDate" },
        { label: "Interview Status", fieldName: "Status" },
        { label: "Phone number", fieldName: "ph" },
    
        {
            fieldName: "",
            label: "Action",
            cellAttributes: { iconName: "utility:email" },
        },
        {type: "button", typeAttributes: {  
            label: 'Accept',  
            name: 'Accept',  
            title: 'Accept',  
            disabled: false,  
            variant: 'brand',
            value: 'accept',  
            iconPosition: 'left'  
        }},  
        {type: "button", typeAttributes: {  
            label: 'Reject',  
            name: 'Reject',  
            title: 'Reject',  
            disabled: false,  
            variant: 'brand',
            value: 'reject',  
            iconPosition: 'left'  
        }} ,
    ];

    data3 = [
        {
            id: 1,
            name: "Adam Joel",
            AppliedDate: "21/01/2022",
            Status: "Pending",
            ph: 4567456890,
        },
        {
            id: 2,
            name: "Rachel Jenny",
            AppliedDate: "19/01/2022",
            Status: "Pending",
            ph: 9989998909,
        },
        {
            id: 3,
            name: "Lucas Kim",
            AppliedDate: "19/01/2022",
            Status: "Pending",
            ph: 7897897890,
        },
        
    ];
    
     columns3 = [
        {
            label: "Candidate",
            fieldName: "name",
            cellAttributes: {
                iconName: "utility:user",
                Name: "user",
                alignment: "Right",
            },
        },
        // { label: 'Candidate', fieldName: 'name' },
        { label: "Applied Date", fieldName: "AppliedDate" },
        { label: "Interview Status", fieldName: "Status" },
        { label: "Phone number", fieldName: "ph" },
    
        {
            fieldName: "",
            label: "Action",
            cellAttributes: { iconName: "utility:email" },
        },
        {type: "button", typeAttributes: {  
            label: 'Accept',  
            name: 'Accept',  
            title: 'Accept',  
            disabled: false,  
            variant: 'brand',
            value: 'accept',  
            iconPosition: 'left'  
        }},  
        {type: "button", typeAttributes: {  
            label: 'Reject',  
            name: 'Reject',  
            title: 'Reject',  
            disabled: false,  
            variant: 'brand',
            value: 'reject',  
            iconPosition: 'left'  
        }} ,
    ];
   
}