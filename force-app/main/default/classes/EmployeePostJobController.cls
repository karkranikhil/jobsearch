public with sharing class EmployeePostJobController {
    public EmployeePostJobController() {

    }

    @AuraEnabled
    public static string employeePostJob(String jobPostList){
        JobWrapper jobPost= (JobWrapper)JSON.deserialize(jobPostList, JobWrapper.Class);
        try {
            Id userId = UserInfo.getUserId();
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :userId]?.ContactId;
            Id accountId = [Select Id, AccountId FROM Contact Where Id = :contactId]?.AccountId;
     
            Job_Post__c jobPostObj = new Job_Post__c();
            jobPostObj.Name = jobPost.jobTitle;
            jobPostObj.Employer_Contact__c = contactId;
            jobPostObj.Company__c = jobPost.company;
            jobPostObj.Job_Title__c = jobPost.jobTitle;
            jobPostObj.Location__c = jobPost.location;
            jobPostObj.Employment_Type2__c = jobPost.employmentType;
            jobPostObj.Job_Status__c = jobPost.jobStatus;
            jobPostObj.Job_Responsibilities__c = jobPost.jobResponsibilities;
            jobPostObj.Job_Description__c = jobPost.jobDescription;
            jobPostObj.Salary_Range__c = jobPost.salaryRange;
            jobPostObj.Industry_Type__c = jobPost.industryType;
            jobPostObj.Account__c = accountId;
            
            insert jobPostObj;
            return jobPostObj.Id;

        } 
        
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string addJobPostEvent(String addEventList, String jobPostId){
        
            EventWrapper addEvent= (EventWrapper)JSON.deserialize(addEventList, EventWrapper.Class);
            try {
                   Id userId = UserInfo.getUserId();
                   Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :userId]?.ContactId;
                  

                   Event event = new Event();
                   event.WhoId = contactId;
                   event.WhatId = jobPostId;
                   event.Subject = 'Meeting';
                   event.Job_Event_Name__c = addEvent.eventName;
                   event.Job_Event_Virtual_Link__c = addEvent.virtualLink;
                   event.Description = addEvent.eventDescription;
                   event.ActivityDate=addEvent.eventDate;
                   Event.StartDateTime = Datetime.newInstance(addEvent.eventDate, addEvent.startTime);
                   Event.EndDateTime = Datetime.newInstance(addEvent.eventDate, addEvent.endTime);

                   insert event;

                   if(addEvent.eventFile <> null ){
                    ContentVersion cv = createContentVersion(addEvent.eventFile.base64,addEvent.eventFile.fileName);
                    ContentDocumentLink cdl = createContentLink(cv.Id, jobPostId);}

                   return '';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getAccountName(){
        try {
            Id userId = UserInfo.getUserId();
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :userId]?.ContactId;
            Contact contactList = [Select Id, Account.Name, Account.Website FROM Contact Where Id = :contactId LIMIT 1];
            return JSON.serialize(contactList);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class JobWrapper {
        @AuraEnabled Public String company;
        @AuraEnabled Public String jobTitle;
        @AuraEnabled Public String location;
        @AuraEnabled Public String employmentType;
        @AuraEnabled Public String industryType;
        @AuraEnabled Public String jobStatus;
        @AuraEnabled Public String jobResponsibilities;
        @AuraEnabled Public String jobDescription;
        @AuraEnabled Public String salaryRange;
    }

    public class EventWrapper{
        @AuraEnabled Public String eventName;
        @AuraEnabled Public String eventlocation;
        @AuraEnabled Public String virtualLink;
        @AuraEnabled Public Date eventDate;
        @AuraEnabled Public Time startTime;
        @AuraEnabled Public Time endTime;
        @AuraEnabled Public String eventDescription;
        @AuraEnabled Public DocumentWrapper eventFile;

    }
    public class DocumentWrapper {
        @AuraEnabled Public String fileName;
        @AuraEnabled Public String base64;
    }
    private static ContentVersion createContentVersion(String base64, String filename) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        try {
          insert cv;
          return cv;
        } catch(DMLException e) {
          System.debug(e);
          return null;
        }
      }
      private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
        if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [
                                SELECT ContentDocumentId 
                                FROM ContentVersion 
                                WHERE Id =: contentVersionId
                                ].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        cdl.ShareType = 'V';
        try {
            insert cdl;
            return cdl;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
    }  
}