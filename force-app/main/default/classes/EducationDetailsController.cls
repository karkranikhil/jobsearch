public with sharing class EducationDetailsController {
    public EducationDetailsController() {

    }

    @AuraEnabled
    public static string fetchEducationDetails(){
        try {
            Id userId = UserInfo.getUserId();
            User usr = [
                SELECT Id, ContactId FROM User WHERE Id =: userId LIMIT 1
            ];

            List<Education_Details__c> edDetailsList = new List<Education_Details__c>([
                SELECT Id, Level_Of_Education__c, Degree__c, Education_Type__c, Start_date__c, End_Date__c, Is_Currently_Pursuing__c, School_College_University__c,
                Description__c, Contact__c FROM Education_Details__c WHERE Contact__c =: usr.ContactId
            ]);

            Map<Id,Id> entityIdsToDocumentId = new Map<Id,Id>();
            for(Education_Details__c ed: edDetailsList){
                entityIdsToDocumentId.put(ed.Id, null);
            }
            //System.debug(entityIdsToDocumentId);
            List<ContentDocumentLink> ContentDocumentLinkList = new List<ContentDocumentLink>([
                SELECT ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN: entityIdsToDocumentId.keySet()
            ]);
            for(ContentDocumentLink cdl: ContentDocumentLinkList){
                entityIdsToDocumentId.remove(cdl.LinkedEntityId);
                entityIdsToDocumentId.put(cdl.LinkedEntityId, cdl.ContentDocumentId);
            }
            //System.debug(entityIdsToDocumentId);
            Map<Id, ContentVersion> documentIdToVersion = new Map<Id, ContentVersion>();
            List<ContentVersion> contentVersionList = [SELECT Id, ContentDocument.Title, ContentDocumentId
            FROM   ContentVersion 
            WHERE  ContentDocumentId IN : entityIdsToDocumentId.values() AND IsLatest = true];
            for(ContentVersion cv: contentVersionList){
                documentIdToVersion.put(cv.ContentDocumentId, cv);
            }
            //System.debug(documentIdToVersion);

            List<EducationWrapper> wrapperList = new List<EducationWrapper>();
            Integer i = 1;
            for(Education_Details__c ed: edDetailsList){
                EducationWrapper wrap = new EducationWrapper();
                wrap.certificatonUploadData = new CertificationDocumentWrapper();
                wrap.degree = ed.Degree__c;
                wrap.description = ed.Description__c;
                wrap.educationType = ed.Education_Type__c;
                wrap.endDate = ed.End_Date__c;
                wrap.key = i;
                wrap.levelOfEducation = ed.Level_Of_Education__c;
                wrap.currentlyPursuing = ed.Is_Currently_Pursuing__c;
                wrap.schoolCollegeUniversity = ed.School_College_University__c;
                wrap.startDate = ed.Start_date__c;
                wrap.Id = ed.Id;

                CertificationDocumentWrapper docWrap = new CertificationDocumentWrapper();
                if(entityIdsToDocumentId.get(ed.Id) != null){
                    docWrap.showFiles = true;
                    docWrap.fileName = documentIdToVersion.get(entityIdsToDocumentId.get(ed.Id)).ContentDocument.Title;
                    docWrap.ContentDocId = documentIdToVersion.get(entityIdsToDocumentId.get(ed.Id)).ContentDocumentId;
                    docWrap.ContentVerId = documentIdToVersion.get(entityIdsToDocumentId.get(ed.Id)).Id;
                }else {
                    docWrap.showFiles = false;
                    docWrap.fileName = '';
                    docWrap.ContentDocId = '';
                    docWrap.ContentVerId = '';
                }

                wrap.certificatonUploadData = docWrap;
                i++;
                wrapperList.add(wrap);
            }

            String edDetails = JSON.serialize(wrapperList);
            return edDetails;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string updateEducationDetails(String educationList, List<Id> deleteList, List<Id> deleteFileList){
        try {
            List<Education_Details__c> deleteRecords = [
                SELECT Id FROM Education_Details__c WHERE Id IN: deleteList
            ];
            delete deleteRecords;
            List<ContentDocument> deleteDocs = [
                SELECT Id FROM ContentDocument WHERE Id IN: deleteFileList
            ];
            delete deleteDocs;

            List<EducationWrapper> wrapperList = (List<EducationWrapper>)JSON.deserialize(educationList, List<EducationWrapper>.class);
            List<Education_Details__c> eduList = new List<Education_Details__c>();
            Id userId = UserInfo.getUserId();
            User usr = [
                SELECT Id, ContactId FROM User WHERE Id =: userId LIMIT 1
            ];
            for(Integer i = 0; i<wrapperList.size(); i++){
                Education_Details__c ed = new Education_Details__c();
                if(!String.isBlank(wrapperList[i].Id))
                    ed.Id = wrapperList[i].Id;
                ed.Level_Of_Education__c = wrapperList[i].levelOfEducation;
                ed.Degree__c = wrapperList[i].degree;
                ed.Education_Type__c = wrapperList[i].educationType;
                ed.Start_date__c = wrapperList[i].startDate;
                ed.End_Date__c = wrapperList[i].endDate;
                ed.School_College_University__c = wrapperList[i].schoolCollegeUniversity;
                ed.Description__c = wrapperList[i].description;
                ed.Contact__c = usr.ContactId;
                ed.Is_Currently_Pursuing__c = wrapperList[i].currentlyPursuing;

                eduList.add(ed);
            }
            upsert eduList;

            for(Integer i = 0; i < eduList.size(); i++){
                if(!String.isBlank(wrapperList[i].certificatonUploadData.base64) && !String.isBlank(wrapperList[i].certificatonUploadData.fileName)){
                    ContentVersion cv = createContentVersion(wrapperList[i].certificatonUploadData.base64, wrapperList[i].certificatonUploadData.fileName, wrapperList[i].certificatonUploadData.ContentDocId);
                    if(String.isBlank(wrapperList[i].certificatonUploadData.ContentDocId))
                        ContentDocumentLink cdl = createContentLink(cv.Id, eduList[i].Id);
                }
            }
            return 'Success from updateEducationDetails';

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    //Wrappers:
    public class EducationWrapper {
        @AuraEnabled Public String Id;
        @AuraEnabled Public String levelOfEducation;
        @AuraEnabled Public String degree;
        @AuraEnabled Public String educationType;
        @AuraEnabled Public Date startDate;
        @AuraEnabled Public Date endDate;
        @AuraEnabled Public String schoolCollegeUniversity;
        @AuraEnabled Public String description;
        @AuraEnabled Public CertificationDocumentWrapper certificatonUploadData;
        @AuraEnabled Public Integer key;
        @AuraEnabled Public Boolean currentlyPursuing;
    }
    public class CertificationDocumentWrapper {
        @AuraEnabled Public String fileName;
        @AuraEnabled Public String base64;
        @AuraEnabled Public String ContentDocId;
        @AuraEnabled Public String ContentVerId;
        @AuraEnabled Public Boolean showFiles;
    }

    //for Uploading File:
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


//author: Abel David Solomon
//Date: 29th Dec, 2021