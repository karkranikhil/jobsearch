public class EmployerDashboardController {
    
    @AuraEnabled
    public static string getJobPosting(){
        try {
            Id accid = [SELECT ID,Contact.AccountId FROM User WHERE Id= :UserInfo.getUserId()].Contact.AccountId;
            List<Job_Post__c> jobPostList = [SELECT ID,Name,Company__c,Job_Title__c, Location__c, Employment_Type__c, Job_Description__c, Job_Responsibilities__c, Salary_Range__c  FROM Job_Post__c WHERE Account__c = :accid Order by CreatedDate DESC];
            return JSON.serialize(jobPostList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String getJobApplicantsDeveloper(){
       
        try {        
            
        List<Job_Applicants__c> SFDCDevApplicantsList = new List<Job_Applicants__c>();
        SFDCDevApplicantsList = [Select Id, Job_Applicant_Name__c,LinkedIn_Profile__c,Next_Round_Scheduled_Date__c, Applied_Date__c,Status__c, Ranking__c, Phone__c, Resume_URL__c, Applied_For__c FROM Job_Applicants__c WHERE Applied_For__c = 'Salesforce Developer' Order By Ranking__c];
        
        
        List<JobApplicantsWrapper> devWrapperList= new List<JobApplicantsWrapper>();
        
        for(Job_Applicants__c applicants :SFDCDevApplicantsList)
        {
            JobApplicantsWrapper devWrapper = new JobApplicantsWrapper();
            devWrapper.applicantId = applicants.Id;
            devWrapper.applicantName = applicants.Job_Applicant_Name__c;
            devWrapper.appliedDate = applicants.Applied_Date__c;
            devWrapper.status = applicants.Status__c;
            devWrapper.ranking = applicants.Ranking__c;
            devWrapper.phone = applicants.Phone__c;
            devWrapper.resume = applicants.Resume_URL__c;
            devWrapper.linkedin = applicants.LinkedIn_Profile__c;
            devWrapper.nextRound = applicants.Next_Round_Scheduled_Date__c != null ? applicants.Next_Round_Scheduled_Date__c.format('MMMMM dd, yyyy hh:mm:ss a'):'';

            devWrapperList.add(devWrapper);

        }
        
        String devList = JSON.serialize(devWrapperList);
        return devList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String getJobApplicantsSFDCTester(){
       
        try {          
            
            List<Job_Applicants__c> SFDCTesterApplicantsList = new List<Job_Applicants__c>();
            SFDCTesterApplicantsList = [Select Id, Job_Applicant_Name__c,LinkedIn_Profile__c,Next_Round_Scheduled_Date__c, Applied_Date__c, Status__c, Ranking__c, Phone__c, Resume_URL__c, Applied_For__c FROM Job_Applicants__c WHERE Applied_For__c = 'Salesforce Tester' Order By Ranking__c];
            
            List<JobApplicantsWrapper> testWrapperList= new List<JobApplicantsWrapper>();
        
        for(Job_Applicants__c applicants : SFDCTesterApplicantsList)
        {
            JobApplicantsWrapper testWrapper = new JobApplicantsWrapper();
            testWrapper.applicantId = applicants.Id;
            testWrapper.applicantName = applicants.Job_Applicant_Name__c;
            testWrapper.appliedDate = applicants.Applied_Date__c;
            testWrapper.status = applicants.Status__c;
            testWrapper.ranking = applicants.Ranking__c;
            testWrapper.phone = applicants.Phone__c;
            testWrapper.resume = applicants.Resume_URL__c;
            testWrapper.linkedin = applicants.LinkedIn_Profile__c;
            testWrapper.nextRound = applicants.Next_Round_Scheduled_Date__c != null ? applicants.Next_Round_Scheduled_Date__c.format('MMMMM dd, yyyy hh:mm:ss a'):'';

            testWrapperList.add(testWrapper);
        }
       
        String testerList = JSON.serialize(testWrapperList);
        return testerList;

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
        @AuraEnabled Public String linkedin;
        @AuraEnabled Public String nextRound;
        
    }

    @AuraEnabled
    public static string changeStatus(String applicantId, String status){
        try {
            Job_Applicants__c jobApplicant = new  Job_Applicants__c();
            jobApplicant = [Select Id, Status__c from Job_Applicants__c where Id =:applicantId];
            jobApplicant.Status__c = status;

            update jobApplicant;


            return '';
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}