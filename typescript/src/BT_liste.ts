import { DvDate, DvDateTime } from 'ehrcraft-form-api';
import {FORMID_SYSTOLISK, FORMID_DIASTOLISK, FORMID_TIME_BT} from './index'
import {API} from "ehrcraft-form-api/dist/api"; 
import { BT_OBJECT } from "./class_bt";

export function Blodtrykks_liste(api:API) {

    
    var all_sys = api.getFields(FORMID_SYSTOLISK).toString().split(",");
    var all_dia = api.getFields(FORMID_DIASTOLISK).toString().split(",")
    var all_time = api.getFields(FORMID_TIME_BT).toString().split(","); 

    console.log(api.getFields("encounter/blodtrykk/uspesifisert_hendelse/systolisk"))  ;  


    var BT_List = new Array<BT_OBJECT>();

    // lage og legge objekter inn i en liste 
    for (let i= 0; i < all_sys.length; i++) {

        createBTObjectAndAddToList(
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



 
return sorted; 

  





// HJELPEFUNKSJONER 

  function createBTObjectAndAddToList(systolisk:string, diastolisk:any,  time:string){

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





}
