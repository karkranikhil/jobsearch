public class ResumeController {
    public WrapperClass ResumeDetails {get;set;}
    
    public ResumeController() { 
        WrapperClass wrapData = New WrapperClass();
        wrapData.Name = 'JOHN DOE';
        wrapData.FirstName = 'John';
        wrapData.LastName ='Doe';
        wrapData.Phone = '111-222-3333';
        wrapData.Email = 'john.doe@email.com';
        ResumeDetails = wrapData;
    }
    
    public class WrapperClass{
        public String Name {get; set;}
        public String FirstName {get; set;}
        public String LastName {get; set;}
        public String Phone {get; set;}
        public String Email {get; set;}
    }
    
}