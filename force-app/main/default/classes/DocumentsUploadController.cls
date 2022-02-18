public with sharing class DocumentsUploadController {
    @AuraEnabled
    public static string uploadDocuments(String dataList, List<Id> deleteList){
        try {
            List<ContentDocument> deleteDocs = [
                SELECT Id FROM ContentDocument WHERE Id IN: deleteList
            ];
            delete deleteDocs;

            List<DocumentUploadsWrapper> wrapperList = (List<DocumentUploadsWrapper>)JSON.deserialize(dataList, List<DocumentUploadsWrapper>.class);
            List<Contact> con = new List<Contact>();
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;

            for(Integer i = 0; i < wrapperList.size(); i++){
                if(!String.isBlank(wrapperList[i].base64) && !String.isBlank(wrapperList[i].fileName)){
                    ContentVersion cv = createContentVersion(wrapperList[i].base64,wrapperList[i].keyName + '_' + wrapperList[i].fileName, wrapperList[i].ContentDocId);
                    if(String.isBlank(wrapperList[i].ContentDocId))
                        ContentDocumentLink cdl = createContentLink(cv.Id, contactId);
                }
            }
            return 'successful';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<DocumentUploadsWrapper> getDocuments(){
        try {
            Id contactId = [SELECT ID,ContactId FROM User WHERE Id = :UserInfo.getUserId()]?.ContactId;
            List<Id> entityIdsToDocumentId = new List<Id>();
            List<ContentDocumentLink> ContentDocumentLinkList = new List<ContentDocumentLink>([
                SELECT ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId =:contactId]);
            for(ContentDocumentLink cd: ContentDocumentLinkList){
                entityIdsToDocumentId.add(cd.ContentDocumentId);
            }
            List<ContentVersion> contentVersionList = [SELECT Id, ContentDocument.Title, ContentDocumentId
            FROM   ContentVersion 
            WHERE  ContentDocumentId IN : entityIdsToDocumentId AND IsLatest =: true];

            List<DocumentUploadsWrapper> docWrapperList = new List<DocumentUploadsWrapper>();
            for (Integer i = 0; i < contentVersionList.size(); i++) {
                DocumentUploadsWrapper doc = new DocumentUploadsWrapper();
                String str = contentVersionList[i].ContentDocument.Title;
                List<String> res = str.split('_', 2);
                if (res.size() > 0) {
                    //Two prefix are avalible for sttoring the resume and certificate on contact 
                    //hence except these 2 docs we are selecting all the doc
                    if (res[0] != 'L' && res[0] != 'R') {
                        doc.keyName = res[0];
                        doc.fileName = res[1];
                        doc.showFiles = true;
                        doc.ContentVerId = contentVersionList[i].Id;
                        doc.ContentDocId = contentVersionList[i].ContentDocumentId;
                        docWrapperList.add(doc);
                    }
                }
            }
            return docWrapperList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    
    }

    //MavQ APi integration
    @AuraEnabled
    public static string hitMavQAndGetResponse(String base64Value){
        try {
            HTTPRequest feedRequest = new HTTPRequest();
            feedRequest.setEndpoint('callout:AI_Verify');
            feedRequest.setMethod('POST');
            feedRequest.setHeader('Content-Type', HttpFormBuilder.GetContentType());

            String body = '';
            body += HttpFormBuilder.WriteBoundary();
            body += HttpFormBuilder.WriteBodyParameter('doc_path', base64Value);
            body += HttpFormBuilder.WriteBoundary(HttpFormBuilder.EndingType.CrLf);

            Blob formBlob = EncodingUtil.base64Decode(body);
            feedRequest.setHeader('Content-Length', String.valueOf(formBlob.size()));
            feedRequest.setBodyAsBlob(formBlob);
            HTTP http = new HTTP();
            HTTPResponse feedResponse = http.send(feedRequest);
            return feedResponse.getBody();
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    public class DocumentUploadsWrapper {
        @AuraEnabled Public String key;
        @AuraEnabled Public String title;
        @AuraEnabled Public String keyName;
        @AuraEnabled Public String fileName;
        @AuraEnabled Public String base64;
        @AuraEnabled Public String ContentDocId;
        @AuraEnabled Public String ContentVerId;
        @AuraEnabled Public Boolean showFiles;
    }
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