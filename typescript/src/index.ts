// generic index.ts fil


import { DvText } from "ehrcraft-form-api";
import {API} from "ehrcraft-form-api/dist/api"; 
import { Blodtrykks_liste } from "./BT_liste";
import { BT_OBJECT } from "./class_bt";

export const FORMID_SYSTOLISK = "klinisk_kontakt/blodtrykk/uspesifisert_hendelse/systolisk"; 
export const FORMID_DIASTOLISK = "klinisk_kontakt/blodtrykk/uspesifisert_hendelse/diastolisk"; 
export const FORMID_TIME_BT = "klinisk_kontakt/blodtrykk/uspesifisert_hendelse/time"; 


export const FORMID_TEMPERATUR = "klinisk_kontakt/kroppstemperatur/uspesifisert_hendelse/temperatur"
export const FORMID_TEMPERATUR_TIME = "klinisk_kontakt/kroppstemperatur/uspesifisert_hendelse/time"; 


export const FOMRID_TEXT = "klinisk_kontakt/vitalia_sammendrag_dips/any_event/vitalia_sammendrag/vitalia_sammendrag"; 




export function main(api: API) {

    console.log(banner);

    console.log("TEST"); 

    let sorted_BT = Blodtrykks_liste(api); // returnerer den sorterte listen over alle BT objekter 
    console.log("S O R T E D    L I S T OF BLODPRESSURE OBJECTS"); 
    for (let i = 0; i < sorted_BT.length; i++){
  
      console.log(sorted_BT[i].printObject()) ;
    }

    console.log(generateDescribingText()); 

  

    function generateDescribingText(){

        var stringToSend = ""

        for (let i = 0; i < sorted_BT.length; i++){
    
                if (sorted_BT[i].getStatus() == "første"){
                    let forste = "\n  \n  "    + sorted_BT[i].getTextDate() +
                                      " Kl" + sorted_BT[i].getReadableTime() + 
                                     " ble det målt systolisk BT som var på " + sorted_BT[i].getSystolisk() + 
                                     " med NEWS på " + sorted_BT[i].getNewsScore(); 

                    stringToSend = stringToSend.concat(forste)  // her sto det forverring ? 
                }

                if (sorted_BT[i].getStatus() == "forverret"){
                    let forverring = "\n  \n " + sorted_BT[i].getTextDate() +
                                     " Kl" + sorted_BT[i].getReadableTime() + 
                                     " ble det forverring på BT som ble målt til " + sorted_BT[i].getSystolisk() +
                                     " med NEWS på " + sorted_BT[i].getNewsScore(); 

                    stringToSend = stringToSend.concat(forverring)
                }

                if (sorted_BT[i].getStatus() == "forbedret"){

                    let forbedring = "\n  \n" +  sorted_BT[i].getTextDate() +
                                     " Kl" + sorted_BT[i].getReadableTime() + 
                                     " ble det forbedring på BT som ble målt til " + sorted_BT[i].getSystolisk() + 
                                     " med NEWS på " + sorted_BT[i].getNewsScore() ;
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


