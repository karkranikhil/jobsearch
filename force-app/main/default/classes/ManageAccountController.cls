public with sharing class ManageAccountController {
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
    @AuraEnabled
    public static void uploadProilePhoto(String documentId){
        try {
            ContentVersion cv = [Select id , FileExtension, FileType, title,VersionData from ContentVersion Where ContentDocumentId =: documentId Limit 1];
            ConnectApi.UserProfiles.setPhoto(null, UserInfo.getUserId(), new ConnectApi.BinaryInput(cv.VersionData,'image/' + cv.FileExtension,cv.title + '.' + cv.FileExtension));
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    //To get user details
    @AuraEnabled
    public static string getManageAccountDetails(){
        try {
            User user = [SELECT Id, FirstName, LastName, Email, MobilePhone FROM User WHERE Id = :UserInfo.getUserId()];
            return JSON.serialize(user);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // to update user details
    @AuraEnabled
    public static string updateManageAccountDetails(String FirstName, String LastName, String MobilePhone, String Email){
        try {
            User user = new User();
            user.Id = UserInfo.getUserId();
            user.FirstName = FirstName;
            user.LastName = LastName;
            user.MobilePhone = MobilePhone;
            user.Email = Email;
            update user;
            return 'sucess';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    //To get Acccount details
    @AuraEnabled
    public static string getManageAccountEmployerDetails(){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            Id accountId = [SELECT ID,AccountId,Email FROM Contact WHERE Id = :contactId]?.AccountId;
            
            Account acc = [SELECT Id,Name,Type,Website,Company_Type__c,Company_Size__c,(SELECT Email FROM Contacts LIMIT 1) FROM Account WHERE Id = :accountId];
            ManageAccountEmployerWrapper manageWrapper = new ManageAccountEmployerWrapper();
            manageWrapper.Id = acc.Id;
            manageWrapper.Name = acc.Name;
            manageWrapper.Type = acc.Type;
            manageWrapper.Website = acc.Website;
            manageWrapper.Company_Type = acc.Company_Type__c;
            manageWrapper.Company_Size = acc.Company_Size__c;
            manageWrapper.Email = acc.Contacts[0].Email;
            return JSON.serialize(manageWrapper);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string updateManageAccountEmployer(String manageAccData){
        try {
            ManageAccountEmployerWrapper wrapperList = (ManageAccountEmployerWrapper)JSON.deserialize(manageAccData, ManageAccountEmployerWrapper.class);
           
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            Account acc = new Account();
            acc.Id = wrapperList.Id;
            acc.Name = wrapperList.Name;
            acc.Type = wrapperList.Type;
            acc.Website = wrapperList.Website;
            acc.Company_Type__c = wrapperList.Company_Type;
            acc.Company_Size__c = wrapperList.Company_Size;
            Contact con = new Contact();
            con.Id = contactId;
            con.Email = wrapperList.Email;
            update acc;
            update con;
            return 'success';
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public class ManageAccountEmployerWrapper {
        @AuraEnabled Public String Id;
        @AuraEnabled Public String Name;
        @AuraEnabled Public String Type;
        @AuraEnabled Public String Website;
        @AuraEnabled Public String Company_Type;
        @AuraEnabled Public String Company_Size;
        @AuraEnabled Public String Email;
    }

}