public without sharing class UserRegistrationController {
    @AuraEnabled
    public static string createPortalUser(String input){
        try {     
            UserDetails wrapper = (UserDetails) JSON.deserialize(input, UserDetails.Class); 
            List<User> uList = [SELECT ID,Email FROM User WHERE Email =: wrapper.userEmail];
            if(!uList.isEmpty()){
                return 'The Email Address you are trying to register with already has an account';
            }
            Id jobseekerRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Job Seeker').getRecordTypeId();
            Id employerRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Employer').getRecordTypeId();
            
            List<Account> newAccountList = new List<Account>();
            if(wrapper.companyName != '') {
                 newAccountList = [Select Id From Account where Name=:wrapper.companyName limit 1];
            }
            Account newAccount;
            if(newAccountList==null || newAccountList.isEmpty()) {
                newAccount = new Account(
                Name= (wrapper.companyName != '' && wrapper.companyName != null) ? wrapper.companyName : wrapper.userFirstName + wrapper.userLastName, 
                OwnerId = '0055f000005yG7q', 
                RecordTypeId= (wrapper.companyName != '' && wrapper.companyName != null) ? employerRecordTypeId : jobseekerRecordTypeId);
              insert newAccount;
            } else {
                newAccount = newAccountList[0];
            }
            
            Contact newContact = new Contact(
                AccountId = newAccount.Id, 
            
                LastName = wrapper.userLastName,
                FirstName = wrapper.userFirstName,
                Email = wrapper.userEmail,
                Designation__c = (wrapper.designation != '' && wrapper.designation != null ) ? wrapper.designation : ''
                // Program_Interests__c = interest,
                // Birthdate = wrapper.userBirthdate,
                // MobilePhone = wrapper.userPhone,
                // MailingStreet = wrapper.address.street,
                // MailingCity = wrapper.address.city,
                // MailingCountry = wrapper.address.country, 
                // MailingPostalCode = wrapper.address.postalCode, 
                // MailingState = wrapper.address.state
            //  Gender__c =wrapper.gender,
            //  Gender_Pronoun__c =wrapper.pronoun
             );
            insert newContact;

            Profile prof;
            if((wrapper.companyName != '' && wrapper.companyName != null)){
                prof = [select id,userType from Profile where name='Employee User' limit 1];
            } else{
                prof = [select id,userType from Profile where name='Portal User' limit 1];
            }
            
            String alias = (wrapper.userFirstName != null ? wrapper.userFirstName.substring(0,1).toUpperCase() :'') + 
                (wrapper.userLastName.length() > 6 ? wrapper.userLastName.substring(0,6) : wrapper.userLastName);
            String nickname = ((wrapper.userFirstName != null && wrapper.userFirstName.length() > 0) ? wrapper.userFirstName.substring(0,1) : '' ) + wrapper.userLastName.substring(0,1);
            nickname = nickname + String.valueOf(Crypto.getRandomInteger()).substring(1,7);

            User userObj = new User(
                Username   = wrapper.userEmail+'.mtxjob',
                Email      = wrapper.userEmail,
                FirstName  = wrapper.userFirstName,
                LastName   = wrapper.userLastName,
                // Phone      = wrapper.userPhone,
                // Alternate_Contact_Number__c = wrapper.alternateContact,
                // SMS_Communication__c = wrapper.smsCommunication,
                // Email_Communication__c = wrapper.emailCommunication,
                // MobilePhone= wrapper.userPhone,
                // Birthdate__c = wrapper.userBirthdate,
                ProfileId = prof.id,
                contactId = newContact.Id,
                emailEncodingKey  = 'UTF-8',
                languageLocaleKey ='en_US',
                localesIdKey = 'en_CA',
                alias = alias,
                CommunityNickname= nickname,
                TimeZoneSidKey='America/New_York'
                // Street = wrapper.address.street,
                // City = wrapper.address.city, 
                // State = wrapper.address.state,
                // Country = wrapper.address.country, 
                // PostalCode =wrapper.address.postalCode
                );
            String networkId = Network.getNetworkId();
            /**If using site to host the community the user should not hit s1 after logging in from mobile. */
            if(networkId != null && siteAsContainerEnabled(networkId)) userObj.put('UserPreferencesHideS1BrowserUI',true);
            INSERT userObj;
            return '';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @TestVisible
    private static boolean siteAsContainerEnabled(Id networkId) {
        Auth.AuthConfiguration authConfig = new Auth.AuthConfiguration(networkId,'');
        return authConfig.isCommunityUsingSiteAsContainer();
    }
    public class UserDetails {
        @AuraEnabled
        public String userFirstName;
        @AuraEnabled
        public String userLastName;
        @AuraEnabled
        public String userEmail;
        @AuraEnabled
        public String userPhone;
        @AuraEnabled
        public Date userBirthdate;
        @AuraEnabled
        public UserAddress address;
        @AuraEnabled
        public String alternateContact;
        @AuraEnabled
        public boolean smsCommunication;
        @AuraEnabled
        public boolean emailCommunication;
        @AuraEnabled
        public String organizationName;
        @AuraEnabled
        public String corporateNumber;
        @AuraEnabled
        public String role;
        @AuraEnabled
        public String gender;
        @AuraEnabled
        public String pronoun;
        @AuraEnabled
        public String companyName;
        @AuraEnabled
        public String designation;
    }

    public class UserAddress{
        @AuraEnabled
        public String street;
        @AuraEnabled
        public String city;
        @AuraEnabled
        public String state;
        @AuraEnabled
        public String country;
        @AuraEnabled
        public String postalCode;
    }
}