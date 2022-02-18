public  class JobsEQController {
    
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

    
    @AuraEnabled public static String getJobsEQData(String regionType, String regionCode, String occupationCode){
        if(occupationCode.contains('.00')){
            occupationCode =  occupationCode.replace('.00', '');
        }
        String accessToken= getJobsEQAccessToken();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://jobseq.eqsuite.com/api/external/runanalytic/?id=346c9b58-4636-4b92-9521-be86a0868f76');
        req.setMethod('POST');
        req.setHeader('authorization', 'Bearer ' + accessToken);
        String occupationType = '0';
        system.debug('1111--'+regionType);
            system.debug('111---'+regionCode);
        if(occupationCode != '00-0000')
        {
            occupationType = '7';
        }
        String bodyInput  =    '{\n' +
        ' "regions": '+ 
                    ' [{  "type": '+regionType+', '+
                    '  "code": "'+regionCode+'" ' +
                '}],\n'+
            ' "occupation": ' +
                    '{ "code": "'+occupationCode+'", '+
                    '  "type": '+occupationType +
                    '},\n' +
            ' "histYears": "10",\n' +
            ' "projYears": "10",\n' +
            ' "excludePrelim": true,\n' +
            ' "occLevel": "7",\n' +
            ' "model": 0,\n' +
            ' "ownLevel": "10",\n' +
            ' "rawOnly": true\n' +
            '}';
            system.debug('bodyInput---'+bodyInput);
        req.setBody(bodyInput);
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug('##Response' + res.getBody());
        return res.getBody();
        //ResponseWrapper obj= (ResponseWrapper)Json.deserialize(res.getBody(),ResponseWrapper.Class);
    }
    
    					
    // public class ResponseWrapper{
    //     public String soc;
    //     public String title;
    //     public String employment;
    //     public String avgWages;
    //     public String medianWages;
    //     public String lq;        
    //     public String histChange;
    //     public String regionalChangePct;
    //     public String forecastTotalDemand;
    //     public String separationExits;
    //     public String separationTransfers;
    //     public String forecastGrowth;
    //     public String forecastPctGrowth;
    // }

    public class AccessTokenWrapper{
        public String access_token;
        public String token_type;
        public String expires_in;
    }
    
    

    //Abel's Code:
    
    @AuraEnabled
    public static string getOccupationGapData(String regionCode, String regionType, String occupationCode){
        try {
            if(occupationCode.contains('.00')){
                occupationCode =  occupationCode.replace('.00', '');
            }
            String occupationType = '0';
            if(occupationCode != '00-0000'){
                occupationType = '7';
            }
            String accessToken= getJobsEQAccessToken();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://jobseq.eqsuite.com/api/external/runanalytic?id=f0b719b4-308b-4c5c-b689-baa6b909d5f3');
            req.setMethod('POST');
            req.setHeader('authorization', 'Bearer ' + accessToken);
            String bodyInput  =    '{\n' +
            ' "region": '+ 
                        ' {  "type": '+regionType+', '+
                        '  "code": "'+regionCode+'" ' +
                    '},\n'+
                    ' "occupation": '+ 
                    ' {  "type": '+occupationType+', '+
                        '   "code": "'+occupationCode+'", '+
                '},\n'+
                ' "years": "10",\n' +
                ' "rawOnly": false,\n' +
                ' "legacyOutput": true,\n' +
                ' "tableShowMore": false,\n' +
                ' "displayType": "GapChart",\n' +
                ' "socLevel": "2",\n' +
                ' "knowledgeOnly": false\n' +
                '}';
                system.debug('bodyInput###'+bodyInput);
            req.setBody(bodyInput);
            Http http = new Http();
            HTTPResponse res = http.send(req);

            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getSkillGapData(String regionCode, String regionType, String occupationCode){
        try {
            if(occupationCode.contains('.00')){
                occupationCode =  occupationCode.replace('.00', '');
            }
            String occupationType = '0';
            if(occupationCode != '00-0000'){
                occupationType = '7';
            }
            String accessToken= getJobsEQAccessToken();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://jobseq.eqsuite.com/api/external/runanalytic?id=148c7d96-36e5-446d-a9b8-f4078bd19d74');
            req.setMethod('POST');
            req.setHeader('authorization', 'Bearer ' + accessToken);
            String bodyInput = '{'+
                '"gapType":"BySkill","datasetKey":"BySkill",'+
                '"bySkill":{'+
                    '"region":{'+
                        '"type":' + regionType + ','+
                        '"code":"' + regionCode +'",'+
                        '"enabled":true,'+
                        '"sharedBy":null,'+
                        '"disabled":false,'+
                    '},'+
                    '"occupation":{'+
                        '"code":"' + occupationCode + '",'+
                        '"type":' + occupationType +
                    '},'+
                    '"numberOfRows":0,'+
                    '"filter":"Hard",'+
                    '"displayType":"Chart",'+
                    '"rawOnly":false,'+
                    '"legacyOutput":true'+
                '},'+
                '"byOccupation":{'+
                    '"region":null,'+
                    '"occupation":null,'+
                    '"skill":null,'+
                    '"occLevel":7,'+
                    '"displayType":"Chart",'+
                    '"rawOnly":false,'+
                    '"legacyOutput":true'+
                '},'+
                '"supply":{'+
                    '"regions":['+
                        '{"code":null,"type":null},{"code":null,"type":null},{"code":null,"type":null}'+
                    '],'+
                    '"skill":null,'+
                    '"occupation":null,'+
                    '"displayType":"Chart",'+
                    '"rawOnly":false,'+
                    '"legacyOutput":true'+
                '},'+
                '"rawOnly":false,'+
                '"legacyOutput":true}';
            system.debug('bodyInput###'+bodyInput);
            req.setBody(bodyInput);
            Http http = new Http();
            HTTPResponse res = http.send(req);

            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getOccupationalDiversityData(String regionCode, String regionType, String occupationCode){
        try {
            if(occupationCode.contains('.00')){
                occupationCode =  occupationCode.replace('.00', '');
            }
            String occupationType = '0';
            if(occupationCode != '00-0000'){
                occupationType = '7';
            }
            String accessToken= getJobsEQAccessToken();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://jobseq.eqsuite.com/api/external/runanalytic?id=7993e1f6-b66f-4a15-a876-3d93731affa8');
            req.setMethod('POST');
            req.setHeader('authorization', 'Bearer ' + accessToken);
            String bodyInput  = '{\n'+
                '"regions":['+
                    '{"code":"0","type":10}'+
                    '],'+
                '"region":{'+
                    '"code":"'+regionCode+'",'+
                    '"type":'+regionType+
                '},'+
                '"occupation":{'+
                    '"code":"'+occupationCode+'",'+
                    '"type":'+occupationType+
                '},'+
                '"displayMode":"Chart",'+
                '"category":null,'+
                '"occLevel":0,'+
                '"showPercentages":false,'+
                '"showTrainingDetails":false,'+
                '"rawOnly":false,'+
                '"legacyOutput":true'+
            '}';
            req.setBody(bodyInput);
            Http http = new Http();
            HTTPResponse res = http.send(req);

            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getJobSearchData(String regionType, String regionCode, String key){
        try {
            String accessToken= getJobsEQAccessToken();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://jobseq.eqsuite.com/api/external/runanalytic?id=fb9d934a-17db-4a9d-94d2-54a7c93b3a3d');
            req.setMethod('POST');
            req.setHeader('authorization', 'Bearer ' + accessToken);
            String occupationType = '0';
            system.debug('Region type###'+regionType);
            system.debug('Region code###'+regionCode);
            // String regionType = '2';
            // String regionCode = '1746';
            // String key = 'Accountants and Auditors';
            String bodyInput  =    '{\n' +
            ' "regions": '+ 
                        ' [{  "type": '+regionType+', '+
                        '  "code": "'+regionCode+'" ' +
                    '}],\n'+
                    ' "filters": '+ 
                    ' [{  "type": "title", '+
                        '   "filterType": "contains", '+
                    '  "key": "'+key+'" ' +
                '}],\n'+
                ' "timeframe": 0,\n' +
                ' "rawOnly": true\n' +
                '}';
                system.debug('bodyInput###'+bodyInput);
            req.setBody(bodyInput);
            Http http = new Http();
            HTTPResponse res = http.send(req);

            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string getOccupationWages(String regionType, String regionCode, String occupationCode){
        try {
            if(occupationCode.contains('.00')){
                occupationCode =  occupationCode.replace('.00', '');
            }
            String accessToken= getJobsEQAccessToken();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://jobseq.eqsuite.com/api/external/runanalytic?id=772c8997-01e0-4404-b05a-3d16138a39d2');
            req.setMethod('POST');
            req.setHeader('authorization', 'Bearer ' + accessToken);
            String occupationType = '0';
            if(occupationCode != '00-0000'){
                occupationType = '7';
            }

            String bodyInput  =    '{\n' +
            ' "legacyOutput": false,\n' +
            ' "rawOnly": false,\n' +
            ' "type": "WageDistribution",\n' +
            ' "wageDistribution": {\n' +
            ' "regions": '+ 
                        ' [{  "type": '+regionType+', '+
                        '  "code": "'+regionCode+'" ' +
                    '},\n'+
                    '{  "type": '+regionType+', '+
                    '  "code": "'+regionCode+'" ' +
                    '},\n'+
                    '{  "type": '+regionType+', '+
                    '  "code": "'+regionCode+'" ' +
                    '},\n'+
                    '],\n'+
                    ' "occupation": \n'+ 
                    ' {  "type": '+occupationType+', '+
                        '   "code": "'+occupationCode+'", '+
                '},\n'+
                ' "occLevel": "7",\n' +
                ' "hourly": false\n' +
                '}\n'+
                '}';
            //system.debug(bodyInput);
            req.setBody(bodyInput);
            Http http = new Http();
            HTTPResponse res = http.send(req);

            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
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
        //String accessToken= getJobsEQAccessToken();
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

       // String bodyInput  =  '';
        //req.setBody(bodyInput);
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(res.getBody());
        return res.getBody();
        //ResponseWrapper obj= (ResponseWrapper)Json.deserialize(res.getBody(),ResponseWrapper.Class);
    }

    @AuraEnabled
    public static string getContactRegionDetails(){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            Contact con = [SELECT ID,Region__r.Type__c, Region__r.Code__c, Region__r.Name, Desired_Occupation__c FROM Contact WHERE Id = :contactId];
            return JSON.serialize(con);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //Fetch recent Job Postings

    @AuraEnabled
    public static List<JobPostWrapper> getJobPosting(String jobTitle, String region){
        try {
            List<JobPostWrapper> JobPostWrapperList = new List<JobPostWrapper>();
            List<Job_Post__c> jobPostList = [SELECT ID,Name,Company__c,Job_Title__c, Location__c, Employment_Type__c, Job_Description__c, Job_Responsibilities__c, Salary_Range__c  FROM Job_Post__c WHERE Job_Title__c =:jobTitle  AND Location__c =:region Order by CreatedDate DESC];
            
            for(Job_Post__c job : jobPostList){
                JobPostWrapper jobPost = new JobPostWrapper();
                jobPost.company = job.Company__c;
                jobPost.location = job.Location__c;
                jobPost.title = job.Job_Title__c;

                JobPostWrapperList.add(jobPost);
            }
            return JobPostWrapperList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class JobPostWrapper {
        @AuraEnabled Public String company;
        @AuraEnabled Public String title;
        @AuraEnabled Public String location;
    }

}