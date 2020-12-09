import { DvDate, DvDateTime } from 'ehrcraft-form-api';


export class BT_OBJECT {

        systolisk : any; 
        diastolisk: any; 
        time : any;
        news_score : any; 
        status: any
        constructor(systolisk:any, diastolisk:any,time:any, news_score?:any, status?:any){
            this.systolisk = systolisk;
            this.diastolisk = diastolisk; 
            this.time = time; 
            this.news_score = news_score; 
            this.status = status;
        } 
 
     getTime(){
         return this.time
     }

     getReadableTime(){
        
        let dateObj = new Date(this.time);
        
        // timezone issue, thus + 2
        return (dateObj.getHours()+2) + ":"  + dateObj.getMinutes();
        
     }

     getReadableDate(){
        let dateTime = new Date(this.time)  ; 
        let split = dateTime.toString().split(" ");
        return split[1] + " " + split[2]; 
     }

     getTextDate(){

        let stringToReturn = ""; 

        let today = new Date().getDate();
        let dayOfRegistration = new Date(this.time).getDate(); 

        if (today - dayOfRegistration == 0) {
            stringToReturn = "I dag"; 
        }

        if (today - dayOfRegistration == 1){
            stringToReturn = "I går"; 
        }

        return stringToReturn; 

     }

     getSystolisk(){
         let split = this.systolisk.toString().split(" "); 
         return split[0]; 
     }

     getDiastolisk(){
         return this.diastolisk
     }


     getNewsScore(){
         return this.news_score; 
     }

     printObject(){
        console.log("Systolisk:" + this.systolisk + " Distolisk:" + this.diastolisk + " klokken: " + this.time + " NEWS score " + this.news_score) ;
    
     }

     setStatus(status:any){
         this.status = status;

     }

     getStatus(){
         return this.status; 
     }

    generateNewsScore(){

        let sys = this.getSystolisk();

        switch(true) {
            case (!sys):
                break;
            case (sys <=90):
                this.news_score = 3;
                break;
            case (sys >= 19 && sys <= 100):
                this.news_score = 2;
                break;
            case (sys >= 101 && sys <= 110):
                this.news_score = 1;
                break;
            case  (sys >= 111 && sys <= 219):
                this.news_score = 0;
                break;
            case  (sys >= 220):
                this.news_score = 3;
                break;
            default:
                break;
            }
        }       


}
