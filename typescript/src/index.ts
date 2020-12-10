// generic index.ts fil


import { DvText } from "ehrcraft-form-api";
import {API} from "ehrcraft-form-api/dist/api"; 
import { BT_OBJECT } from "./class_bt";

const FORMID_SYSTOLISK = "klinisk_kontakt/blodtrykk/uspesifisert_hendelse/systolisk"; 
const FORMID_DIASTOLISK = "klinisk_kontakt/blodtrykk/uspesifisert_hendelse/diastolisk"; 
const FORMID_TIME_BT = "klinisk_kontakt/blodtrykk/uspesifisert_hendelse/time"; 


const FORMID_TEMPERATUR = "klinisk_kontakt/kroppstemperatur/uspesifisert_hendelse/temperatur"
const FORMID_TEMPERATUR_TIME = "klinisk_kontakt/kroppstemperatur/uspesifisert_hendelse/time"; 


const FOMRID_TEXT = "klinisk_kontakt/vitalia_sammendrag_dips/any_event/vitalia_sammendrag/vitalia_sammendrag"; 




export function main(api: API) {

    console.log(banner);

    console.log("TEST"); 
     
    var BT_List = new Array<BT_OBJECT>();
   
   
    

    var all_sys = api.getFields(FORMID_SYSTOLISK).toString().split(",");
    var all_dia = api.getFields(FORMID_DIASTOLISK).toString().split(",")
    var all_time = api.getFields(FORMID_TIME_BT).toString().split(","); 

    console.log(api.getFields("encounter/blodtrykk/uspesifisert_hendelse/systolisk"))  ;  


    // lage og legge objekter inn i en liste 
    for (let i= 0; i < all_sys.length; i++) {

        createBTObjectAndAddToList(api,
            all_sys[i],
            all_dia[i],
            all_time[i]  )
    }


    // generer NEWS score og skriv ut alle objekter 
    for (let i = 0; i < BT_List.length; i++){

        BT_List[i].generateNewsScore(); 
        console.log("dette er news score på element nr " + i)
        console.log(BT_List[i].getNewsScore());
        console.log("dette er systolisk BT på element nr " + i)
        console.log(BT_List[i].getSystolisk()); 
        console.log("dette er hele objektet på element nr " + i)
        console.log(BT_List[i].printObject()); 

    }
    



// sorterer listen på tid 
  let sorted = returnListSortedByTime(); 
  console.log("S O R T E D    L I S T"); 
  for (let i = 0; i < sorted.length; i++){

    console.log(sorted[i].printObject()) ;
  }
 
  

  // setter News Status 
   setNewsStatus();


  for (let i = 0; i < sorted.length; i++){

    console.log(sorted[i].getStatus()) ;
  }



   
  console.log(generateDescribingText()); 

 
  

// skriver teksten til det fritekst feltet 
  console.log("Prøver å generere og sende text til feltet")

let stringToSendToFritekst = generateDescribingText();

let textObject = new DvText(stringToSendToFritekst);

api.setFieldValue(FOMRID_TEXT, textObject); 




// FUNKSJONER 


    function createBTObjectAndAddToList(api:API, systolisk:string, diastolisk:any,  time:string){

        var nytt_objekt = new BT_OBJECT(systolisk, diastolisk, time)

        BT_List.push(nytt_objekt)
    }


// sorterer listen på tid og returnerer den sorterte listen 
    function returnListSortedByTime() {

        BT_List.sort(function (a, b) {
            if (a.time > b.time) { return 1 };
            if (a.time < b.time) { return -1 };
            return 0;
            });
        return BT_List;
    }





// setter news status i forhold til den forrige målingen 
    function setNewsStatus(){

        
        for (var i = 1; i < sorted.length; i++) {

            let current = sorted[i];
            let previous = sorted[i - 1];

            sorted[0].setStatus("første");

            if (current.getSystolisk() != "" ){


                if(current.getNewsScore() < previous.getNewsScore()) {
                    current.setStatus("forbedret");

                }

                if (current.getNewsScore() == previous.getNewsScore()){
                    current.setStatus("uendret");
                }

                if (current.getNewsScore() > previous.getNewsScore()){
                    current.setStatus("forverret");

                }

            }

        }

    }








    function generateDescribingText(){

        var stringToSend = ""

        for (let i = 0; i < sorted.length; i++){
    
                if (sorted[i].getStatus() == "første"){
                    let forste = "\n  \n  "    + sorted[i].getTextDate() +
                                      " Kl" + sorted[i].getReadableTime() + 
                                     " ble det målt systolisk BT som var på " + sorted[i].getSystolisk() + 
                                     " med NEWS på " + sorted[i].getNewsScore(); 

                    stringToSend = stringToSend.concat(forste)  // her sto det forverring ? 
                }

                if (sorted[i].getStatus() == "forverret"){
                    let forverring = "\n  \n " + sorted[i].getTextDate() +
                                     " Kl" + sorted[i].getReadableTime() + 
                                     " ble det forverring på BT som ble målt til " + sorted[i].getSystolisk() +
                                     " med NEWS på " + sorted[i].getNewsScore(); 

                    stringToSend = stringToSend.concat(forverring)
                }

                if (sorted[i].getStatus() == "forbedret"){

                    let forbedring = "\n  \n" +  sorted[i].getTextDate() +
                                     " Kl" + sorted[i].getReadableTime() + 
                                     " ble det forbedring på BT som ble målt til " + sorted[i].getSystolisk() + 
                                     " med NEWS på " + sorted[i].getNewsScore() ;
                    stringToSend = stringToSend.concat(forbedring)
                }

        }

        return stringToSend; 
    }


    
}

 
 





































const banner = `
 _|  o  |_    _    _  |  
(_|  o  | |  (_|  (_  |< 
                         


`;


