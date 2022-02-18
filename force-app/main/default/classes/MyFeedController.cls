public without sharing class MyFeedController {
    @AuraEnabled
    public static ContactWrapper getContactInfo(){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            List<Contact> conList = [select Id,Name,Title,vlocity_ins__Age__c,vlocity_ins__AnnualIncome__c, Desired_Occupation__c, Region__r.Name, Region__r.Type__c, Region__r.Code__c,
             Email,MobilePhone, Required_Wages__c, (SELECT ID,Title__c, URL__c FROM Program_Referrals__r ORDER BY Title__c) from Contact where Id = :contactId LIMIT 1];    
            List<ContactWrapper> contactWrapperList = new List<ContactWrapper>();
            for (Contact con : conList) {
                ContactWrapper contactWrapper = new contactWrapper();
                contactWrapper.Name = con.Name;
                contactWrapper.title = con.Title;
                contactWrapper.Age = con.vlocity_ins__Age__c;
                contactWrapper.AnnualIncome = con.vlocity_ins__AnnualIncome__c;
                contactWrapper.email = con.Email;
                contactWrapper.MobNumber = con.MobilePhone;
                contactWrapper.RequiredWages = con.Required_Wages__c;
                contactWrapper.programReferals = con.Program_Referrals__r;
                contactWrapper.DesiredOccupation = con.Desired_Occupation__c;
                contactWrapper.PreferredLocation = con.Region__r.Name;
                contactWrapper.regionCode = con.Region__r.Code__c;
                contactWrapper.regionType = con.Region__r.Type__c;
                contactWrapperList.add(contactWrapper);
            }
            return contactWrapperList[0];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public class ContactWrapper{
        @AuraEnabled public Id Id;
        @AuraEnabled public String Title;
        @AuraEnabled public String Name;
        @AuraEnabled public Decimal Age;
        @AuraEnabled public Decimal AnnualIncome;
        @AuraEnabled public String MobNumber;
        @AuraEnabled public String Email;
        @AuraEnabled public String RequiredWages;
        @AuraEnabled public String DesiredOccupation;
        @AuraEnabled public String PreferredLocation;
        @AuraEnabled public String regionType;
        @AuraEnabled public String regionCode;
        @AuraEnabled public List<Program_Referral__c> programReferals;
    }
}