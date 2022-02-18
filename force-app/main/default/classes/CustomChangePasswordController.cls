public with sharing class CustomChangePasswordController {
    @AuraEnabled
    public static void changeNewPassword(String newPassword,String verifyNewPassword,String oldpassword){
        try {
  		PageReference pr = Site.changePassword(newPassword, verifyNewPassword, oldpassword);
  		pr.setRedirect(true);
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}