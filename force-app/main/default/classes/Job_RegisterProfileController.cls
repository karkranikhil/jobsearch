public class Job_RegisterProfileController {

    @AuraEnabled
    public static UserWrapper getUserDetails(){
        List<User> con= [SELECT Id, FirstName, LastName FROM User 
                        WHERE Id=: UserInfo.getUserId()];
        if(con != null && !con.isEmpty()){
            UserWrapper obj= new UserWrapper();
            obj.firstName= con[0].FirstName;
            obj.lastName= con[0].LastName;
            return obj;
        }
    return null;
    }

    @AuraEnabled
    public static string getContactCmpDetails(){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            Contact con = [SELECT ID,Email, MobilePhone, Preferred_Method_Of_Communication__c,Country__c, City__c, Street__c,
                            State__c, Zip_Code__c, Permanent_Add_City__c, Permanent_Add_Country__c, Permanent_Add_State__c, Permanent_Add_Street__c, Permanent_Add_Zip_Code__c,
                            Desired_Occupation__c, Occupation_Code__c, Preferred_Location__c, Region__r.Name, Required_Wages__c FROM Contact WHERE Id = :contactId];
            return JSON.serialize(con);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class UserWrapper{
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
    }

    @AuraEnabled
    public static string updateContactDetails(String name, String email, String communication, String mobile, String country, String state, String street, 
                                                String city, String zipcode, String pCity, String pCountry, String pState, String pStreet, String pZipcode,  String desiredOccupation,
                                                String preferredLocation, String requiredWages){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            Contact con = new Contact(Id = contactId);
            con.Email = email;
            con.MobilePhone = mobile;
            con.Preferred_Method_Of_Communication__c = communication;
            con.Country__c = country;
            con.State__c = state;
            con.City__c = city;
            con.Street__c = street;
            con.Zip_Code__c = zipcode;
            con.Permanent_Add_City__c = pCity;
            con.Permanent_Add_Country__c = pCountry;
            con.Permanent_Add_State__c = pState;
            con.Permanent_Add_Street__c = pStreet;
            con.Permanent_Add_Zip_Code__c = pZipcode;
            con.Desired_Occupation__c = desiredOccupation;
            con.Region__c = preferredLocation;
            con.Required_Wages__c = requiredWages;
            update con;
            return '';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string updateContactGoals( String desiredOccupation,String preferredLocation, String requiredWages,String OccupationCode){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            // Region__c region = [select Id,Name FROM Region__c Where Name = :preferredLocation LIMIT 1];
            Contact con = new Contact(Id = contactId);
            con.Desired_Occupation__c = desiredOccupation;
            con.Region__c = preferredLocation;  //this is Id
            con.Required_Wages__c = requiredWages;
            con.Occupation_Code__c = OccupationCode;
            con.Show_Profile__c = false;
            
            update con;
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string saveEducationDetails(String educationList){
        try {
            List<EducationWrapper> wrapperList = (List<EducationWrapper>)JSON.deserialize(educationList, List<EducationWrapper>.class);
            List<Education_Details__c> eduList = new List<Education_Details__c>();
            Id userId = UserInfo.getUserId();
            User usr = [
                SELECT Id, ContactId FROM User WHERE Id =: userId LIMIT 1
            ];
            for(Integer i = 0; i<wrapperList.size(); i++){
                Education_Details__c ed = new Education_Details__c();
                ed.Level_Of_Education__c = wrapperList[i].levelOfEducation;
                ed.Degree__c = wrapperList[i].degree;
                ed.Education_Type__c = wrapperList[i].educationType;
                ed.Start_date__c = wrapperList[i].startDate;
                ed.End_Date__c = wrapperList[i].endDate;
                ed.School_College_University__c = wrapperList[i].schoolCollegeUniversity;
                ed.Description__c = wrapperList[i].description;
                ed.Contact__c = usr.ContactId;

                eduList.add(ed);
            }
            insert eduList;
            for(Integer i = 0; i < eduList.size(); i++){
                ContentVersion cv = createContentVersion(wrapperList[i].certificatonUploadData.base64, wrapperList[i].certificatonUploadData.fileName);
                ContentDocumentLink cdl = createContentLink(cv.Id, eduList[i].Id);
            }

            return 'Success';

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public class EducationWrapper {
        @AuraEnabled Public String levelOfEducation;
        @AuraEnabled Public String degree;
        @AuraEnabled Public String educationType;
        @AuraEnabled Public Date startDate;
        @AuraEnabled Public Date endDate;
        @AuraEnabled Public String schoolCollegeUniversity;
        @AuraEnabled Public String description;
        @AuraEnabled Public CertificationDocumentWrapper certificatonUploadData;
    }
    public class CertificationDocumentWrapper {
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
        // ShareType is either 'V', 'C', or 'I'
        // V = Viewer, C = Collaborator, I = Inferred
        cdl.ShareType = 'V';
        try {
            insert cdl;
            return cdl;
        } catch(DMLException e) {
            return null;
        }
    }
    @AuraEnabled
      public static string updateUserDetails(String userList)
    
      {  
        UserWrapper2 userJ= (UserWrapper2)JSON.deserialize(userList, UserWrapper2.Class);
        Id userId = UserInfo.getUserId();
        User user = new User();
          try{
            user = [ Select Id, Name, FirstName,LastName,Username,DOB__c,Gender__c,Social_Security_Number__c,Email,Highest_Education__c,
                                   Work_Authentication__c,Employment_Status__c,Veteran__c,Disability_Accomodations__c,
                                   Primary_Language__c,Birth_City__c,Alias,Race__c,Ethnicity__c,Informed_Consent_Questions__c,
                                   Current_School_Status__c, Self_Employment__c, Selective_Service_Males_Certain_Age__c from User WHERE
                                   Id = :userId];
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :userId]?.ContactId;

            //user.Name = userJ.name;
            user.FirstName = userJ.fname;
            user.LastName = userJ.mname ==null ? userJ.lname : userJ.mname +userJ.lname;
            //user.Username = userJ.userNameOrUniqueId;
            user.DOB__c = userJ.dob;
            user.Gender__c = userJ.gender;
            user.Social_Security_Number__c = userJ.ssNumber;
            //user.Email = userJ.email;
            user.Highest_Education__c =userJ.highestEducation;
            user.Work_Authentication__c = userJ.workAuthentication;
            user.Employment_Status__c = userJ.employmentStatus;
            user.Veteran__c = userJ.veteranEligibleSpouse;
            user.Disability_Accomodations__c = userJ.disablilityAccomodations;
            user.Primary_Language__c = userJ.primaryLanguage;
            user.Birth_City__c = userJ.birthCity;
            user.Alias = userJ.firstNameAlias;
            user.Race__c = userJ.race;
            user.Ethnicity__c = userJ.ethnicity;
            user.Informed_Consent_Questions__c = userJ.informedConsentQuestions;
            user.Current_School_Status__c = userJ.currentSchoolStatus;
            user.Self_Employment__c = userJ.selfEmployment;
            user.Selective_Service_Males_Certain_Age__c = userJ.selectiveService;
            
            update user;
            if(userJ.resumeFile <> null ){
                ContentVersion cv = createContentVersion(userJ.resumeFile.base64,userJ.resumeFile.fileName);
                ContentDocumentLink cdl = createContentLink(cv.Id, contactId);}
            if(userJ.licenseFile <> null ){
                ContentVersion cv = createContentVersion(userJ.licenseFile.base64,userJ.licenseFile.fileName);
                ContentDocumentLink cdl = createContentLink(cv.Id, contactId);
            }
            return 'Success';
            }
            catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }    
        }

        @AuraEnabled
        public static UserWrapper2 getUserInformation(){
          Id userId = UserInfo.getUserId();
            try {
                List<User> userL = new List<User>();
                userL =     [Select Id, Name, FirstName, LastName, Username,DOB__c,Gender__c,Social_Security_Number__c,Email,Highest_Education__c,
                             Work_Authentication__c,Employment_Status__c,Veteran__c,Disability_Accomodations__c,
                             Primary_Language__c,Birth_City__c,Alias,Race__c,Ethnicity__c,Informed_Consent_Questions__c,
                             Current_School_Status__c, Self_Employment__c, Selective_Service_Males_Certain_Age__c from User WHERE
                                      Id = :userId];
                
          
                 UserWrapper2 userJ = new UserWrapper2();
                for (User user : userL) {
                    userJ.name = user.Name;
                    userJ.fname = user.FirstName;
                    userJ.lname = user.LastName;
                    userJ.userNameOrUniqueId = user.Username;
                    userJ.dob = user.DOB__c;
                    userJ.gender = user.Gender__c;
                    userJ.ssNumber = user.Social_Security_Number__c;
                    userJ.email = user.Email;
                    userJ.highestEducation = user.Highest_Education__c;
                    userJ.workAuthentication = user.Work_Authentication__c;
                    userJ.employmentStatus = user.Employment_Status__c;
                    userJ.veteranEligibleSpouse = user.Veteran__c;
                    userJ.disablilityAccomodations = user.Disability_Accomodations__c;
                    userJ.primaryLanguage = user.Primary_Language__c;
                    userJ.birthCity = user.Birth_City__c;
                    userJ.firstNameAlias = user.Alias;
                    userJ.race = user.Race__c;
                    userJ.ethnicity = user.Ethnicity__c;
                    userJ.informedConsentQuestions = user.Informed_Consent_Questions__c;
                    userJ.currentSchoolStatus = user.Current_School_Status__c;
                    userJ.selfEmployment = user.Self_Employment__c;
                    userJ.selectiveService = user.Selective_Service_Males_Certain_Age__c;
                    
                }
                return userJ;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
            
        }
        public class UserWrapper2 {
            @AuraEnabled Public String name;
            @AuraEnabled Public String fname;
            @AuraEnabled Public String mname;
            @AuraEnabled Public String lname;
            @AuraEnabled Public String userNameOrUniqueId;
            @AuraEnabled Public Date dob;
            @AuraEnabled Public String gender;
            @AuraEnabled Public Decimal ssNumber;
            @AuraEnabled Public String email;
            @AuraEnabled Public String highestEducation;
            @AuraEnabled Public Boolean workAuthentication;
            @AuraEnabled Public String employmentStatus;
            @AuraEnabled Public String veteranEligibleSpouse;
            @AuraEnabled Public Boolean disablilityAccomodations;
            @AuraEnabled Public String primaryLanguage;
            @AuraEnabled Public String birthCity;
            @AuraEnabled Public String firstNameAlias;
            @AuraEnabled Public String race;
            @AuraEnabled Public String ethnicity;
            @AuraEnabled Public String informedConsentQuestions;
            @AuraEnabled Public Boolean currentSchoolStatus;
            @AuraEnabled Public Boolean selfEmployment;
            @AuraEnabled Public String selectiveService;
            @AuraEnabled Public DocumentWrapper resumeFile;
            @AuraEnabled Public DocumentWrapper licenseFile;
        }
        public class DocumentWrapper {
            @AuraEnabled Public String fileName;
            @AuraEnabled Public String base64;
        }

    //job update -Ayush
    @AuraEnabled
    public static List<JobWrapper> getJobInformation(){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            Integer key = 0;
            List<Job_Information__c> jobList = [select Id,Title__c,Duties__c, Occupational_Goal__c, Employment_Type__c, End_Date__c, Preferred_Location__c,Required_Wages__c, Skills__c,Start_date__c from Job_Information__c where Contact__c = :contactId];
            List<JobWrapper> jobWrapperList = new List<JobWrapper>();
            for (Job_Information__c job : jobList) {
                JobWrapper newjob = new JobWrapper();
                newjob.key = ++key;
                newjob.jobId = job.Id;
                newjob.title = job.Title__c;
                newjob.empType = job.Employment_Type__c;
                newjob.startDate = job.Start_date__c;
                newjob.endDate = job.End_Date__c;
                newjob.duties = job.Duties__c;
                newjob.skills = job.Skills__c;
                newjob.goal = job.Occupational_Goal__c;
                // newjob.desiredOccupation;
                newjob.location = job.Preferred_Location__c;
                newjob.requiredWages = job.Required_Wages__c;

                jobWrapperList.add(newjob);
            }
            return jobWrapperList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }
    @AuraEnabled
    public static string updateJobInformation(String jobList, List<Id> jobDeleteList){
        try {
            List<Job_Information__c> deleteRecords = [
                SELECT Id FROM Job_Information__c WHERE Id IN: jobDeleteList
            ];
            delete deleteRecords;

            List<JobWrapper> jobWrapperList = (List<JobWrapper>)JSON.deserialize(jobList, List<JobWrapper>.class);
            List<Job_Information__c> newJobList = new List<Job_Information__c>();
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            //update show profile
            // Contact con = new Contact();
            // con.Id = contactId;
            // con.Show_Profile__c = false;
            // update con;
            for (JobWrapper job : jobWrapperList) {
                Job_Information__c newJob = new Job_Information__c();
                if(!String.isBlank(job.jobId))
                    newJob.Id = job.jobId;
                newJob.Contact__c = contactId;
                newJob.Title__c = job.title;
                newJob.Employment_Type__c = job.empType;
                newJob.Start_date__c = job.startDate;
                newJob.End_Date__c = job.endDate;
                newJob.Duties__c = job.duties;
                newJob.Skills__c = job.skills;
                newJob.Occupational_Goal__c = job.goal;
                newJob.Preferred_Location__c = job.location;
                newJob.Required_Wages__c = job.requiredWages;

                newJobList.add(newJob);
            }
            upsert newJobList;
            return 'success update';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public class JobWrapper{
        @AuraEnabled public Id jobId;
        @AuraEnabled public Integer key;
        @AuraEnabled public String title;
        @AuraEnabled public String degree;//left
        @AuraEnabled public String empType;
        @AuraEnabled public Date startDate;
        @AuraEnabled public Date endDate;
        @AuraEnabled public String duties;
        @AuraEnabled public String skills;
        @AuraEnabled public String goal;
        @AuraEnabled public String desiredOccupation;//left
        @AuraEnabled public String location;
        @AuraEnabled public String requiredWages;//left
    }
    @AuraEnabled
    public static List<Contact> getShowProfile(){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            List<Contact> conList = [select Id,Show_Profile__c from Contact where Id = :contactId];    
            return conList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string getManageAccountDetails(){
        try {
            User user = [SELECT Id, FirstName, LastName, Email, MobilePhone FROM User WHERE Id = :UserInfo.getUserId()];
            return JSON.serialize(user);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string saveContactUsInfo(String name, String iAm, String emailAddress, String message){
        try {
            Id userId = UserInfo.getUserId();
            User usr = [SELECT Id, ContactId FROM User WHERE Id =: userId LIMIT 1];
                
                Contact_Us__c contactUs = new Contact_Us__c();
                contactUs.I_am__c=iAm;
                contactUs.Name=name;
                contactUs.Email_Address__c=emailAddress;
                contactUs.Message__c=message;
                contactUs.Contact__c=usr.ContactId;
                insert contactUs;

                return 'success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // Function to get profile picture from user
    @AuraEnabled
    public static User fetchUserDetail(){
        try {
            return [Select id,Name,SmallPhotoUrl, FullPhotoUrl
            From User
            Where Id =: Userinfo.getUserId()];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
}
}