public with sharing class JobsDetailController {
    public JobsDetailController() {

    }
    //Abel's Code:
    @AuraEnabled
    public static string getContactDetails(){   //getting contact Detail for Search defaults.
        try {
            Id userId = UserInfo.getUserId();
            User usr = [
                SELECT Id, ContactId FROM User WHERE Id =: userId LIMIT 1
            ];
            Contact con = [
                SELECT Id, Desired_Occupation__c, Occupation_Code__c, Region__r.Type__c, Region__r.Code__c, Region__r.Name  FROM Contact WHERE Id =: usr.ContactId LIMIT 1
            ];
            return JSON.serialize(con);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getJobSkills(String code){
        try {
            String username = 'abc_inc';
            String password = '8896pne';
            Blob headerValue = Blob.valueOf(username + ':' + password);
            String authorizationHeader = 'BASIC ' +EncodingUtil.base64Encode(headerValue);

            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://services.onetcenter.org/ws/online/occupations/'+code+'/summary/skills');
            req.setMethod('GET');
            req.setHeader('authorization', authorizationHeader);
            req.setHeader('Accept', 'application/json');

            Http http = new Http();
            HTTPResponse res = http.send(req);
            
            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getJobResponsibilites(String code){
        try {
            String username = 'abc_inc';
            String password = '8896pne';
            Blob headerValue = Blob.valueOf(username + ':' + password);
            String authorizationHeader = 'BASIC ' +EncodingUtil.base64Encode(headerValue);

            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://services.onetcenter.org/ws/online/occupations/'+code+'/summary/work_activities');
            req.setMethod('GET');
            req.setHeader('authorization', authorizationHeader);
            req.setHeader('Accept', 'application/json');

            Http http = new Http();
            HTTPResponse res = http.send(req);
            
            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getJobDescription(String code){
        try {
            String username = 'abc_inc';
            String password = '8896pne';
            Blob headerValue = Blob.valueOf(username + ':' + password);
            String authorizationHeader = 'BASIC ' +EncodingUtil.base64Encode(headerValue);

            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://services.onetcenter.org/ws/online/occupations/'+code);
            req.setMethod('GET');
            req.setHeader('authorization', authorizationHeader);
            req.setHeader('Accept', 'application/json');

            Http http = new Http();
            HTTPResponse res = http.send(req);
            
            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getJobRelatedExperience(String code){
        try {
            String username = 'abc_inc';
            String password = '8896pne';
            Blob headerValue = Blob.valueOf(username + ':' + password);
            String authorizationHeader = 'BASIC ' +EncodingUtil.base64Encode(headerValue);

            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://services.onetcenter.org/ws/online/occupations/'+code+'/summary/job_zone');
            req.setMethod('GET');
            req.setHeader('authorization', authorizationHeader);
            req.setHeader('Accept', 'application/json');

            Http http = new Http();
            HTTPResponse res = http.send(req);
            
            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<string> getJobApplyUrl(String urlId){
        try {
            String accessToken= JobsEQController.getJobsEQAccessToken();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://jobseq.eqsuite.com/JobPost/View/'+urlId);
            req.setMethod('GET');
            req.setHeader('authorization', 'Bearer ' + accessToken);
            Http http = new Http();
            HTTPResponse res = http.send(req);
            String value = res.getBody();
            Pattern anchors = Pattern.compile('<a.+View Original<\\/a>');
            Matcher m = anchors.matcher(value);
            String links = '';
            while (m.find()) links = m.group();
            Dom.document doc = new Dom.Document();
            doc.load(links);
            dom.XmlNode xroot = doc.getrootelement();

            //desc
            Pattern anchorsNew = Pattern.compile('<div class="job-field job-type.+<\\/div>');
            Matcher m2 = anchorsNew.matcher(value);
            String linksNew = '';
            while (m2.find()) linksNew = m2.group();
            linksNew = linksNew.replace('<div class="job-field job-type"><span class="field-label">Type: </span>','');
            linksNew = linksNew.replace('</div>','');
            List<String> sendResponse = new List<String>();
            sendResponse.add(linksNew);
            sendResponse.add(xroot.getAttribute('href',''));

             return sendResponse;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<Job_Application__c> getJobApplication(){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            List<Job_Application__c> jobList = [select Id,Company_Name__c,Location__c,Salary_Range__c,Status__c,Category__c,Name,soc__c,title__c,urlId__c from Job_Application__c where Contact__c =:contactId];
            return jobList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Id setJobApplication(String title,String location,String wage,String company,String jobType,String urlId){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;

            Job_Application__c job = new Job_Application__c();
            job.Contact__c = contactId;
            job.Location__c = location;
            job.Salary_Range__c = wage;
            job.Category__c = jobType;
            job.Company_Name__c = company;
            job.Title__c = title;
            job.urlId__c = urlId;

            insert job;
            return job.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static string sendEmailForRefer(String candidateName, String candidateEmail,String jobName, String jobUrl){
        try {
            String contactName = [SELECT ID,ContactId, Contact.Name FROM User WHERE Id =:UserInfo.getUserId()].Contact.Name;
            String[] toAddresses = new String[] {candidateEmail};
            String messageBody;
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(toAddresses);
            mail.setSubject('Job Reference');
            messageBody = '<html><body>Dear ' + candidateName + ', <br><br>You have been referred by ' + contactName +' for the Job :- ' + jobName + '. <br><br>Please visit the URL for more details:- <a href='+jobUrl+'>Link</a> <br><br>Thanks</body></html>';
            mail.setHtmlBody(messageBody);  
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail }); 
            return 'SUCCESS'; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}