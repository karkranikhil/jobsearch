public with sharing class LMS_Controller {
    public LMS_Controller() {

    }
    public static AccessTokenWrapper getLMSAccessToken(){
        String username = 'md.yaqub@lms.demo';
        String password = 'Test@123,./%23';
        String grantType = 'password';
        String client_id = '3MVG9p1Q1BCe9GmDc91ZXNnwcTyZqyTtQ6L9TwgRHvAgsUlLTCsd85hmjK9LOIBMRDzlOUoTnGZ_VWpbCnUkl';
        String client_secret = '8B60D7B0FF2DCFA6965FA33BD84C96CE20A40E5E71FD2313804F926AB32765AC';
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://login.salesforce.com/services/oauth2/token?grant_type='+grantType+'&client_id='+ client_id+'&client_secret='+ client_secret+'&username='+ username 
        +'&password='+ password);
        req.setMethod('POST');
        
        req.setHeader('Content-Type', 'application/json');
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug('Response Body>>>> '+res.getBody());
        AccessTokenWrapper acc = (AccessTokenWrapper)Json.deserialize(res.getBody(), AccessTokenWrapper.Class);
        return acc;
    }
    public class AccessTokenWrapper{
        public String access_token;
        public String instance_url;
        public String id;
        public String token_type;
        public String issued_at;
        public String signature;
    }
    @AuraEnabled
    public static string getAllCourses(){
        try {
            User usr = [SELECT Id, Username, ContactId, Email from User WHERE Id =: UserInfo.getUserId() LIMIT 1];

            AccessTokenWrapper acc = getLMSAccessToken();
            HttpRequest req = new HttpRequest();
            req.setEndpoint(acc.instance_url+'/services/apexrest/AllCourses?username='+usr.Username);
            req.setMethod('GET');  
            req.setHeader('authorization', 'Bearer ' + acc.access_token);
            Http http = new Http();
            HttpResponse res = http.send(req);
            //System.debug(res.getBody());
            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string createUser(){
        try {
            User usr = [SELECT Id, FirstName, LastName, Email, Username, ContactId from User WHERE Id =: UserInfo.getUserId() LIMIT 1];
            String body = '{'+
                            '"firstName":"'+usr.FirstName+'",'+
                            '"lastName":"'+usr.LastName+'",'+
                            '"email":"'+usr.Email+'",'+
                            '"userName":"'+usr.Username+'"'+
                        '}';
            AccessTokenWrapper acc = getLMSAccessToken();
            HttpRequest req = new HttpRequest();
            req.setEndpoint(acc.instance_url+'/services/apexrest/CreateUser');
            req.setMethod('POST');
            req.setHeader('authorization', 'Bearer '+acc.access_token);
            req.setHeader('Content-Type', 'application/json'); //new
            req.setBody(body);
            Http http = new Http();
            HttpResponse res = http.send(req);

            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}