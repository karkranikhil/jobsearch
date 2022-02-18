public with sharing class JobProgramReferrals {
    Static String conId;
    Static List<Program_Referral__c> prListToInsert= new List<Program_Referral__c>();

    @AuraEnabled
    public static void insertProgramRefferals(){
        
        List<User> loggedInUser= [SELECT Id,ContactId,Public_assistance_in_the_last_6_months__c, Do_you_have_a_low_income__c, DOB__c,
                                    Notice_period__c, Are_you_underemployed__c, Are_you_homemaker__c,Employment_Status__c, Disclose_Disability__c,
                                    Difficulty_Hearing__c,Difficulty_Seeing__c,Physical_Or_Mental__c, Disability_Accomodations__c,
                                    Current_School_Status__c
                                    FROM USER WHERE Id=: Userinfo.getUserId()];
        
        if(loggedInUser != null && !loggedInUser.isEmpty()){
            List<Program_Referral__c> prList= [SELECT Id, Name, Title__c, Contact__c FROM Program_Referral__c WHERE Contact__c=: loggedInUser[0].ContactId];
            Set<String> str= new Set<String>();
            conId=loggedInUser[0].ContactId;
            
            //Create set of titles for existing program referrals
            for(Program_Referral__c each: prList){
                str.add(each.Title__c);
            }
            Integer age= FindAge(loggedInUser[0].DOB__c);
            
            //WIOA Title I - Adult - program
            if(age > 18 && loggedInUser[0].Public_assistance_in_the_last_6_months__c && loggedInUser[0].Do_you_have_a_low_income__c && !str.contains('WIOA Title I - Adult')){
                // Program_Referral__c pr= new Program_Referral__c();
                // pr.Contact__c= loggedInUser[0].ContactId;
                // pr.Title__c='WIOA Title I - Adult';
                // prListToInsert.add(pr);
                programReferralRecord('WIOA Title I - Adult');
            }
            //Wagner Peyser - program
            if(!str.contains('Wagner Peyser')){
                programReferralRecord('Wagner Peyser');
            }
            //WIOA Title I - Youth
            if(!str.contains('WIOA Title I - Youth') && age >= 14 && age<25){
                programReferralRecord('WIOA Title I - Youth');
            }
            //WIOA Title I - Dislocated Worker
            if(!str.contains('WIOA Title I - Dislocated Worker') && loggedInUser[0].Employment_Status__c == 'Active' && loggedInUser[0].Notice_period__c && loggedInUser[0].Are_you_underemployed__c){
                programReferralRecord('WIOA Title I - Dislocated Worker');
            }
            //State Displaced Homemaker
            if(!str.contains('State Displaced Homemaker') && loggedInUser[0].Employment_Status__c == 'Active' && !loggedInUser[0].Notice_period__c && loggedInUser[0].Are_you_underemployed__c && loggedInUser[0].Are_you_homemaker__c){
                programReferralRecord('State Displaced Homemaker');
            }
            //WIOA Title III - Employment Services
            if(!str.contains('WIOA Title III - Employment Services') && age >= 14 && age<25 && loggedInUser[0].Employment_Status__c == 'Active' && loggedInUser[0].Notice_period__c && loggedInUser[0].Are_you_underemployed__c && loggedInUser[0].Are_you_homemaker__c){
                programReferralRecord('WIOA Title III - Employment Services');
            }
            //WIOA Title IV - Vocational Rehabilitation
            if(!str.contains('WIOA Title IV - Vocational Rehabilitation') && loggedInUser[0].Disability_Accomodations__c){
                programReferralRecord('WIOA Title IV - Vocational Rehabilitation');
            }
            //SacramentoWorks Training and Employment Program for Students (steps)
            if(!str.contains('SacramentoWorks Training and Employment Program for Students (steps)') && loggedInUser[0].Current_School_Status__c){
                programReferralRecord('SacramentoWorks Training and Employment Program for Students (steps)');
            }
            if(prListToInsert != null && !prListToInsert.isEmpty()){
                insert prListToInsert;
            }
        }
    }

    @AuraEnabled
    public static void programReferralRecord(String programName){
        Program_Referral__c pr= new Program_Referral__c();
        pr.Contact__c= conId;
        pr.Title__c=programName;
        prListToInsert.add(pr);
    }

    public static Integer FindAge(Date dt)
    {
        Integer days = dt.daysBetween(Date.Today());
        Integer age1 = Integer.valueOf(days/365);
        return age1;
    }
}