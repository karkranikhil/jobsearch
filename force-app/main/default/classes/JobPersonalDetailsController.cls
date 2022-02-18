public with sharing class JobPersonalDetailsController {
    public JobPersonalDetailsController() {

    }
    @AuraEnabled
    public static UserWrapper2 getUserInformation(){
        try {
            Id userId = UserInfo.getUserId();
            List<User> userL = new List<User>();
            userL =     [Select Id, Name, FirstName, LastName, Username,DOB__c,Gender__c,SSN__c,Social_Security_Number__c,Email,
                         Work_Authentication__c,Employment_Status__c,Veteran__c,Disability_Accomodations__c,
                         Primary_Language__c,Birth_City__c,Alias,Race__c,Ethnicity__c,Informed_Consent_Questions__c,
                         Current_School_Status__c, Self_Employment__c, Selective_Service_Males_Certain_Age__c,
                         Public_assistance_in_the_last_6_months__c, Do_you_have_a_low_income__c , Notice_period__c,
                         Are_you_underemployed__c, Are_you_homemaker__c, Disclose_Disability__c,Highest_Education__c,
                         Difficulty_Hearing__c,Difficulty_Seeing__c,Physical_Or_Mental__c, LanguageLocaleKey, Highest_level_of_Education_Achieved__c
                         from User WHERE Id = :userId];
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :userId]?.ContactId;
            List<Id> entityIdsToDocumentId = new List<Id>();

            List<ContentDocumentLink> ContentDocumentLinkList = new List<ContentDocumentLink>([
                SELECT ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId =:contactId]);
            for(ContentDocumentLink cd: ContentDocumentLinkList){
                entityIdsToDocumentId.add(cd.ContentDocumentId);
            }
            Map<Id, ContentVersion> documentIdToVersion = new Map<Id, ContentVersion>();
            List<ContentVersion> contentVersionList = [SELECT Id, ContentDocument.Title, ContentDocumentId
            FROM   ContentVersion 
            WHERE  ContentDocumentId IN : entityIdsToDocumentId];
            
            for(ContentVersion cv: contentVersionList){
                documentIdToVersion.put(cv.ContentDocumentId, cv);
            }
            
            UserWrapper2 userJ = new UserWrapper2();
            for (User user : userL) {
                userJ.name = user.Name;
                userJ.fname = user.FirstName;
                userJ.lname = user.LastName;
                userJ.userNameOrUniqueId = user.Username;
                userJ.dob = user.DOB__c;
                userJ.gender = user.Gender__c;
                userJ.ssNumber = user.SSN__c;
                userJ.email = user.Email;
                userJ.highestEducation = user.Highest_level_of_Education_Achieved__c;
                userJ.workAuthentication = user.Work_Authentication__c;
                userJ.employmentStatus = user.Employment_Status__c;
                userJ.veteranEligibleSpouse = user.Veteran__c;
                userJ.disablilityAccomodations = user.Disability_Accomodations__c;
                userJ.primaryLanguage = user.LanguageLocaleKey;
                userJ.birthCity = user.Birth_City__c;
                userJ.firstNameAlias = user.Alias;
                userJ.race = user.Race__c;
                userJ.ethnicity = user.Ethnicity__c;
                userJ.informedConsentQuestions = user.Informed_Consent_Questions__c;
                userJ.currentSchoolStatus = user.Current_School_Status__c;
                userJ.selfEmployment = user.Self_Employment__c;
                userJ.selectiveService = user.Selective_Service_Males_Certain_Age__c;
                userJ.DoYouHaveALowIncome =user.Do_you_have_a_low_income__c;
                userJ.PublicAssistanceInTheLast6Months =user.Public_assistance_in_the_last_6_months__c;
                userJ.Noticeperiod = user.Notice_period__c;
                userJ.Areyouunderemployed = user.Are_you_underemployed__c;
                userJ.Areyouhomemaker = user.Are_you_homemaker__c;
                userJ.DiscloseDisability= user.Disclose_Disability__c;
                userJ.DifficultyHearing= user.Difficulty_Hearing__c;
                userJ.DifficultySeeing= user.Difficulty_Seeing__c;
                userJ.PhysicalOrMental= user.Physical_Or_Mental__c;
                DocumentWrapper resumeDocWrap = new DocumentWrapper();
                DocumentWrapper licenseDocWrap = new DocumentWrapper();

                if(!entityIdsToDocumentId.isEmpty()){
                   
                    for( Id documentId: documentIdToVersion.keySet()){
                    String checkFileName = documentIdToVersion.get(documentId).ContentDocument.Title;
                    if(checkFileName.contains('R_')){
                       resumeDocWrap.showFiles = true;
                       resumeDocWrap.fileName = documentIdToVersion.get(documentId).ContentDocument.Title;
                       resumeDocWrap.ContentDocId = documentIdToVersion.get(documentId).ContentDocumentId;
                       resumeDocWrap.ContentVerId = documentIdToVersion.get(documentId).Id;
                    }
                    else if(checkFileName.contains('L_')){
                        licenseDocWrap.showFiles = true;
                        licenseDocWrap.fileName = documentIdToVersion.get(documentId).ContentDocument.Title;
                        licenseDocWrap.ContentDocId = documentIdToVersion.get(documentId).ContentDocumentId;
                        licenseDocWrap.ContentVerId = documentIdToVersion.get(documentId).Id;
                    }
                    }
                }else {
                    resumeDocWrap.showFiles = false;
                    resumeDocWrap.fileName = '';
                    resumeDocWrap.ContentDocId = '';
                    resumeDocWrap.ContentVerId = '';
                    
                    licenseDocWrap.showFiles = false;
                    licenseDocWrap.fileName = '';
                    licenseDocWrap.ContentDocId = '';
                    licenseDocWrap.ContentVerId = '';

                }

                userJ.resumeFile = resumeDocWrap;
                userJ.licenseFile=licenseDocWrap;
                
   
            }
           
            return userJ;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string updateUserDetails(String userList, List<Id> deleteFileList){
        try {
            
            List<ContentDocument> deleteDocs = [
                SELECT Id FROM ContentDocument WHERE Id IN: deleteFileList
            ];
            
            if(!deleteDocs.isEmpty()){ delete deleteDocs;
            }

            UserWrapper2 userJ= (UserWrapper2)JSON.deserialize(userList, UserWrapper2.Class);
            Id userId = UserInfo.getUserId();
            User user = new User();
            Contact contact = new Contact();

           

            user = [ Select Id, Name, FirstName,LastName,Username,DOB__c,Gender__c,SSN__c,Social_Security_Number__c,Email,
                                   Work_Authentication__c,Employment_Status__c,Veteran__c,Disability_Accomodations__c,
                                   Primary_Language__c,Birth_City__c,Alias,Race__c,Ethnicity__c,Informed_Consent_Questions__c,
                                   Current_School_Status__c, Self_Employment__c, Selective_Service_Males_Certain_Age__c,
                                   Public_assistance_in_the_last_6_months__c, Do_you_have_a_low_income__c, Notice_period__c,
                                   Are_you_underemployed__c, Are_you_homemaker__c, Disclose_Disability__c,Highest_Education__c,
                                   Difficulty_Hearing__c,Difficulty_Seeing__c,Physical_Or_Mental__c, LanguageLocaleKey, Highest_level_of_Education_Achieved__c
                                   from User WHERE Id = :userId];
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :userId].ContactId;
            contact = [Select Id, FirstName, LastName from Contact where Id = :contactId];


            //user.Name = userJ.name;
            user.FirstName = userJ.fname;
            user.LastName = userJ.mname ==null ? userJ.lname : userJ.mname +userJ.lname;
            //user.Username = userJ.userNameOrUniqueId;
            user.DOB__c = userJ.dob;
            user.Gender__c = userJ.gender;
            user.SSN__c = userJ.ssNumber;
            //user.Email = userJ.email;
            user.Highest_level_of_Education_Achieved__c =userJ.highestEducation;
            user.Work_Authentication__c = (Boolean)userJ.workAuthentication;
            user.Employment_Status__c = userJ.employmentStatus;
            user.Veteran__c = userJ.veteranEligibleSpouse;
            user.Disability_Accomodations__c = (Boolean)userJ.disablilityAccomodations;
            user.LanguageLocaleKey = userJ.primaryLanguage;
            user.Birth_City__c = userJ.birthCity;
            user.Alias = userJ.firstNameAlias;
            user.Race__c = userJ.race;
            user.Ethnicity__c = userJ.ethnicity;
            user.Informed_Consent_Questions__c = userJ.informedConsentQuestions;
            user.Current_School_Status__c = (Boolean)userJ.currentSchoolStatus;
            user.Self_Employment__c = (Boolean)userJ.selfEmployment;
            user.Selective_Service_Males_Certain_Age__c = userJ.selectiveService;
            user.Do_you_have_a_low_income__c =(Boolean)userJ.DoYouHaveALowIncome;
            user.Public_assistance_in_the_last_6_months__c =(Boolean)userJ.PublicAssistanceInTheLast6Months;

            user.Notice_period__c= (Boolean)userJ.Noticeperiod;
            user.Are_you_underemployed__c= (Boolean)userJ.Areyouunderemployed;
            user.Are_you_homemaker__c= (Boolean)userJ.Areyouhomemaker;

            user.Disclose_Disability__c= (Boolean)userJ.DiscloseDisability;
            user.Difficulty_Hearing__c= (Boolean)userJ.DifficultyHearing;
            user.Difficulty_Hearing__c= (Boolean)userJ.DifficultySeeing;
            user.Physical_Or_Mental__c= (Boolean)userJ.PhysicalOrMental;

            contact.FirstName = userJ.fname;
            contact.LastName = userJ.mname ==null ? userJ.lname : userJ.mname +userJ.lname;
            //contact.Email = userJ.email;

            update user;
            update contact;
            if(userJ.resumeFile <> null){
            if(!String.isBlank(userJ.resumeFile.base64) && !String.isBlank(userJ.resumeFile.fileName)){
                ContentVersion cv = createContentVersion(userJ.resumeFile.base64,userJ.resumeFile.fileName,userJ.resumeFile.ContentDocId);
                if(String.isBlank(userJ.resumeFile.ContentDocId)){ContentDocumentLink cdl = createContentLink(cv.Id, contactId);}
                }}
            if(userJ.licenseFile <> null){  
                if(!String.isBlank(userJ.licenseFile.base64) && !String.isBlank(userJ.licenseFile.fileName)){
                ContentVersion cv = createContentVersion(userJ.licenseFile.base64,userJ.licenseFile.fileName,userJ.licenseFile.ContentDocId);
                if(String.isBlank(userJ.licenseFile.ContentDocId)){ContentDocumentLink cdl = createContentLink(cv.Id, contactId);}
            }}
            JobProgramReferrals.insertProgramRefferals();
            return 'Success';
    }
    catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }   
}
    //Wrappers:
    public class UserWrapper2 {
        @AuraEnabled Public Boolean DiscloseDisability;
        @AuraEnabled Public Boolean DifficultyHearing;
        @AuraEnabled Public Boolean DifficultySeeing;
        @AuraEnabled Public Boolean PhysicalOrMental;
        @AuraEnabled Public Boolean PublicAssistanceInTheLast6Months;
        @AuraEnabled Public Boolean DoYouHaveALowIncome;
        @AuraEnabled Public Boolean Noticeperiod;
        @AuraEnabled Public Boolean Areyouunderemployed;
        @AuraEnabled Public Boolean Areyouhomemaker;
        @AuraEnabled Public String name;
        @AuraEnabled Public String fname;
        @AuraEnabled Public String mname;
        @AuraEnabled Public String lname;
        @AuraEnabled Public String userNameOrUniqueId;
        @AuraEnabled Public Date dob;
        @AuraEnabled Public String gender;
        @AuraEnabled Public String ssNumber;
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
        @AuraEnabled Public String ContentDocId;
        @AuraEnabled Public String ContentVerId;
        @AuraEnabled Public Boolean showFiles;
    }

    //for Uploading File:
    private static ContentVersion createContentVersion(String base64, String filename, String contentDocId) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        if(String.isNotBlank(contentDocId))
            cv.ContentDocumentId = contentDocId;
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
        // ShareType is either 'V', 'C', or 'I'
        // V = Viewer, C = Collaborator, I = Inferred
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