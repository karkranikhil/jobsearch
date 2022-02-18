public without sharing class SearchController {
    public SearchController() {

    }
    public class AccessTokenWrapper{
        public String access_token;
        public String token_type;
        public String expires_in;
    }
    public static String getJobsEQAccessToken(){
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://jobseq.eqsuite.com/token');
        req.setMethod('GET');
        String username = 'Arpit.khuraswar@mtxb2b.com';
        String password = 'Welcome@2021';
        String grantType = 'password';    
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        String payload = 'grant_type='+EncodingUtil.urlEncode(grantType,'UTF-8')+'&username='+EncodingUtil.urlEncode(username,'UTF-8')+'&password='+EncodingUtil.urlEncode(password,'UTF-8');
        req.setBody(payload);
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(res.getBody());
        AccessTokenWrapper obj= (AccessTokenWrapper)Json.deserialize(res.getBody(),AccessTokenWrapper.Class);
        System.debug('obj##'+obj.access_token);
        return obj.access_token;
    }
    @AuraEnabled
    public static string fetchRegions(String searchKey){
        try {
            String key = searchKey + '%';
            String QUERY =' Select Id, Name, Type__c, Code__c From Region__c WHERE Name LIKE \''+key+'\'';
            system.debug(QUERY);
            List<Region__c> regions = Database.query(QUERY);
            return JSON.serialize(regions);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true) 
    public static String getOnetData(String keyword){
        String username = 'abc_inc';
        String password = '8896pne';

        if(keyword =='')
            keyword= 'Account';

        Blob headerValue = Blob.valueOf(username + ':' + password);
        String authorizationHeader = 'BASIC ' +EncodingUtil.base64Encode(headerValue);
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://services.onetcenter.org/ws/online/search?keyword=' + keyword);
        req.setMethod('GET');
        req.setHeader('authorization', authorizationHeader);
        req.setHeader('Accept', 'application/json');

        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(res.getBody());
        return res.getBody();
    }
}