import { DvDate, DvDateTime } from 'ehrcraft-form-api';
import {FORMID_TEMPERATUR, FORMID_TEMPERATUR_TIME} from './index'
import {API} from "ehrcraft-form-api/dist/api"; 
import { TEMP_OBJECT } from "./class_temp";

export function temperatur_liste(api:API) {

    
    var all_temp = api.getFields(FORMID_TEMPERATUR).toString().split(",");
    var all_temp_time = api.getFields(FORMID_TEMPERATUR_TIME).toString().split(",")

    console.log(api.getFields("klinisk_kontakt/kroppstemperatur/uspesifisert_hendelse/temperatur"));  


    var temp_list = new Array<TEMP_OBJECT>();

    // lage og legge objekter inn i en liste 
    for (let i= 0; i < all_temp_time.length; i++) {

        createTempObjectAndAddToList(
            all_temp[i],
            all_temp_time[i]
            )
    }


    // generer NEWS score og skriv ut alle objekter 
    for (let i = 0; i < temp_list.length; i++){
        temp_list[i].generateNewsScore(); 
        console.log("dette er news score på element nr " + i)
        console.log(temp_list[i].getNewsScore());
        console.log("dette er temperatur på element nr " + i)
        console.log(temp_list[i].getTemperatur()); 
        console.log("dette er hele objektet på element nr " + i)
        console.log(temp_list[i].printObject()); 

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



 
return sorted; 

  





// HJELPEFUNKSJONER 

  function createTempObjectAndAddToList(temperatur:string,  time:string){

    var nytt_objekt = new TEMP_OBJECT(temperatur, time)

    temp_list.push(nytt_objekt)
}


// sorterer listen på tid og returnerer den sorterte listen 
function returnListSortedByTime() {

    temp_list.sort(function (a, b) {
        if (a.time > b.time) { return 1 };
        if (a.time < b.time) { return -1 };
        return 0;
        });

    return temp_list;
}





// setter news status i forhold til den forrige målingen 
function setNewsStatus(){

    
    for (var i = 1; i < sorted.length; i++) {

        let current = sorted[i];
        let previous = sorted[i - 1];

        sorted[0].setStatus("første");

        if (current.getTemperatur() != "" ){


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





}
