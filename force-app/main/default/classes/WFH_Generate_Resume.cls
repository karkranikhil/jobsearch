public class WFH_Generate_Resume {
    
    public static void generatePDF() {
       
        Pagereference pg = Page.Resume_Template;

        Attachment objAttachment = new Attachment();
        objAttachment.Name = 'Dummy.pdf';
        objAttachment.ParentId = '0035f00000EXJiK';
        objAttachment.Body = pg.getContentaspdf();   
        objAttachment.IsPrivate = false;
        insert objAttachment;
        
        system.debug('$$$attachID'+objAttachment.Id);
        
        
    }
    
}