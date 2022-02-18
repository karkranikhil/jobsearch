public with sharing class TestFilesController {
    public TestFilesController() {

    }

    @AuraEnabled
    public static String testFile(){
        try {
            Blob versionData = [Select Versiondata from ContentVersion where ContentDocumentId='0695f00000359MQAAY'].Versiondata;
            String fileData = EncodingUtil.base64Encode(versionData);
            return fileData;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}