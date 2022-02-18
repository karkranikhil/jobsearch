public class ProfileRegisterUserControllerD {
   
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
            user.LastName = userJ.mname + userJ.lname;
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