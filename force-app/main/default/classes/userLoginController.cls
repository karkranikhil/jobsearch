public with sharing class userLoginController {
    public userLoginController() {

    }
    @AuraEnabled
    public static string doLogin(String username, String password){
        try {
            
            String startUrl = Url.getSalesforceBaseUrl().toExternalForm();
            ApexPages.PageReference pageRef = Site.login(username, password, startUrl);

            if(pageRef != null) return pageRef.getUrl();

            throw new CalloutException();

        } catch (Exception e) {
            system.debug('e.getMessagelogin+   '+e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

}