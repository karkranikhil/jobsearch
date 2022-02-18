public without sharing class SchedulingController {
    public SchedulingController() {

    }
    @AuraEnabled
    public static string fetchDetails(String applicantId){
        try {
            Job_Applicants__c app = [
                SELECT Id, Job_Applicant_Name__c, Applied_For__c FROM Job_Applicants__c WHERE Id =: applicantId LIMIT 1
            ];
            return JSON.serialize(app);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string updateDetails(String scheduledDate, String scheduledTime, String applicantId){
            try {
                Job_Applicants__c app = new Job_Applicants__c();
                app.Id = applicantId;
                Integer hour = Integer.valueOf(scheduledTime);
                if(hour<9){
                    hour += 12;
                }
                Date myDate = Date.valueOf(scheduledDate);
                Time myTime = Time.newInstance(hour, 0, 0, 0);
                DateTime dt = DateTime.newInstance(myDate, myTime);
                app.Next_Round_Scheduled_Date__c = dt;


                update app;
                String formattedDateTime = app.Next_Round_Scheduled_Date__c.format('MMMMM dd, yyyy hh:mm:ss a');
                return formattedDateTime;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}