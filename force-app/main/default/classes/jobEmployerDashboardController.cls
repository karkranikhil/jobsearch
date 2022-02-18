public with sharing class jobEmployerDashboardController {
    public jobEmployerDashboardController() {

    }

    @AuraEnabled
    public static List<JobApplicantsWrapper> JobApplicantsDeveloper(){
       
        try {        
            
        List<Job_Applicants__c> SFDCDevApplicantsList = new List<Job_Applicants__c>();
        SFDCDevApplicantsList = [Select Id, Job_Applicant_Name__c,Applied_Date__c,Status__c,Ranking__c,Phone__c,Resume_URL__c,Applied_For__c FROM Job_Applicants__c WHERE Applied_For__c = 'Salesforce Developer'];
        
        
        List<JobApplicantsWrapper> devWrapperList= new List<JobApplicantsWrapper>();
        JobApplicantsWrapper devWrapper = new JobApplicantsWrapper();
        for(Job_Applicants__c applicants :SFDCDevApplicantsList)
        {
            devWrapper.applicantId = applicants.Id;
            devWrapper.applicantName = applicants.Job_Applicant_Name__c;
            devWrapper.appliedDate = applicants.Applied_Date__c;
            devWrapper.status = applicants.Status__c;
            devWrapper.ranking = applicants.Ranking__c;
            devWrapper.phone = applicants.Phone__c;
            devWrapper.resume = applicants.Resume_URL__c;

            devWrapperList.add(devWrapper);

        }
        return devWrapperList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<JobApplicantsWrapper> getJobApplicantSFDCTester(){
       
        try {          
            
            List<Job_Applicants__c> SFDCTesterApplicantsList = new List<Job_Applicants__c>();
            SFDCTesterApplicantsList = [Select Id, Job_Applicant_Name__c,Applied_Date__c,Status__c,Ranking__c,Phone__c,Resume_URL__c,Applied_For__c FROM Job_Applicants__c WHERE Applied_For__c = 'Salesforce Tester'];
            
            List<JobApplicantsWrapper> testWrapperList= new List<JobApplicantsWrapper>();
        JobApplicantsWrapper testWrapper = new JobApplicantsWrapper();
        for(Job_Applicants__c applicants : SFDCTesterApplicantsList)
        {
            testWrapper.applicantId = applicants.Id;
            testWrapper.applicantName = applicants.Job_Applicant_Name__c;
            testWrapper.appliedDate = applicants.Applied_Date__c;
            testWrapper.status = applicants.Status__c;
            testWrapper.ranking = applicants.Ranking__c;
            testWrapper.phone = applicants.Phone__c;
            testWrapper.resume = applicants.Resume_URL__c;

            testWrapperList.add(testWrapper);
        }
        return testWrapperList;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class JobApplicantsWrapper {
        @AuraEnabled Public String applicantId;
        @AuraEnabled Public String applicantName;
        @AuraEnabled Public Date appliedDate;
        @AuraEnabled Public String status;
        @AuraEnabled Public String ranking;
        @AuraEnabled Public String phone;
        @AuraEnabled Public String resume;
        
    }
}