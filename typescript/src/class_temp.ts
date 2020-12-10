import { DvDate, DvDateTime } from 'ehrcraft-form-api';


export class TEMP_OBJECT {

        temperatur: any; 
        time : any;
        news_score : any; 
        status: any
        constructor(temperatur:any,time:any, news_score?:any, status?:any){
            this.temperatur = temperatur; 
            this.time = time; 
            this.news_score = news_score; 
            this.status = status;
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


     getTemperatur(){
        let split = this.temperatur.toString().split(" "); 
        return split[0];
     }


     getNewsScore(){
         return this.news_score; 
     }

     printObject(){
        console.log("Temperatur:" + this.temperatur + " klokken: " + this.time + " NEWS score " + this.news_score) ;
    
     }

     setStatus(status:any){
         this.status = status;

     }

     getStatus(){
         return this.status; 
     }

    generateNewsScore(){

        let temp = this.getTemperatur();

        switch(true) {
            case (!temp):
                break;
            case (temp <=35.0):
                this.news_score = 3;
                break;
            case (temp >= 35.1 && temp <= 36.0):
                this.news_score = 1;
                break;
            case (temp >= 36.1 && temp <= 38):
                this.news_score = 0;
                break;
            case  (temp >= 38.1 && temp <= 39.0):
                this.news_score = 1;
                break;
            case  (temp >= 39.1):
                this.news_score = 2;
                break;
            default:
                break;
            }
        }       
}
