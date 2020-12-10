(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.BT_OBJECT = void 0;

var BT_OBJECT =
/** @class */
function () {
  function BT_OBJECT(systolisk, diastolisk, time, news_score, status) {
    this.systolisk = systolisk;
    this.diastolisk = diastolisk;
    this.time = time;
    this.news_score = news_score;
    this.status = status;
  }

  BT_OBJECT.prototype.getTime = function () {
    return this.time;
  };

  BT_OBJECT.prototype.getReadableTime = function () {
    var dateObj = new Date(this.time); // timezone issue, thus + 2

    return dateObj.getHours() + 2 + ":" + dateObj.getMinutes();
  };

  BT_OBJECT.prototype.getReadableDate = function () {
    var dateTime = new Date(this.time);
    var split = dateTime.toString().split(" ");
    return split[1] + " " + split[2];
  };

  BT_OBJECT.prototype.getTextDate = function () {
    var stringToReturn = "";
    var today = new Date().getDate();
    var dayOfRegistration = new Date(this.time).getDate();

    if (today - dayOfRegistration == 0) {
      stringToReturn = "I dag";
    }

    if (today - dayOfRegistration == 1) {
      stringToReturn = "I går";
    }

    return stringToReturn;
  };

  BT_OBJECT.prototype.getSystolisk = function () {
    var split = this.systolisk.toString().split(" ");
    return split[0];
  };

  BT_OBJECT.prototype.getDiastolisk = function () {
    return this.diastolisk;
  };

  BT_OBJECT.prototype.getNewsScore = function () {
    return this.news_score;
  };

  BT_OBJECT.prototype.printObject = function () {
    console.log("Systolisk:" + this.systolisk + " Distolisk:" + this.diastolisk + " klokken: " + this.time + " NEWS score " + this.news_score);
  };

  BT_OBJECT.prototype.setStatus = function (status) {
    this.status = status;
  };

  BT_OBJECT.prototype.getStatus = function () {
    return this.status;
  };

  BT_OBJECT.prototype.generateNewsScore = function () {
    var sys = this.getSystolisk();

    switch (true) {
      case !sys:
        break;

      case sys <= 90:
        this.news_score = 3;
        break;

      case sys >= 19 && sys <= 100:
        this.news_score = 2;
        break;

      case sys >= 101 && sys <= 110:
        this.news_score = 1;
        break;

      case sys >= 111 && sys <= 219:
        this.news_score = 0;
        break;

      case sys >= 220:
        this.news_score = 3;
        break;

      default:
        break;
    }
  };

  return BT_OBJECT;
}();

exports.BT_OBJECT = BT_OBJECT;
},{}],2:[function(require,module,exports){
"use strict"; // generic index.ts fil

exports.__esModule = true;
exports.main = void 0;

var class_bt_1 = require("./class_bt");

var FORMID_SYSTOLISK = "encounter/blodtrykk/uspesifisert_hendelse/systolisk";
var FORMID_DIASTOLISK = "encounter/blodtrykk/uspesifisert_hendelse/diastolisk";
var FORMID_MIDDELARTERIETRYKK = "";
var FORMID_TIME = "encounter/blodtrykk/uspesifisert_hendelse/time";

function main(api) {
  console.log(banner);
  console.log("TEST");
  var BT_List = new Array();
  var all_sys = api.getFields(FORMID_SYSTOLISK).toString().split(",");
  var all_dia = api.getFields(FORMID_DIASTOLISK).toString().split(",");
  var all_time = api.getFields(FORMID_TIME).toString().split(",");
  console.log(api.getFields("encounter/blodtrykk/uspesifisert_hendelse/systolisk")); // lage og legge objekter inn i en liste 

  for (var i = 0; i < all_sys.length; i++) {
    createObjectAndAddToList(api, all_sys[i], all_dia[i], all_time[i]);
  } // generer NEWS score og skriv ut alle objekter 


  for (var i = 0; i < BT_List.length; i++) {
    BT_List[i].generateNewsScore();
    console.log("dette er news score på element nr " + i);
    console.log(BT_List[i].getNewsScore());
    console.log("dette er systolisk BT på element nr " + i);
    console.log(BT_List[i].getSystolisk());
    console.log("dette er hele objektet på element nr " + i);
    console.log(BT_List[i].printObject());
  } // sorterer listen på tid 


  var sorted = returnListSortedByTime();
  console.log("S O R T E D    L I S T");

  for (var i = 0; i < sorted.length; i++) {
    console.log(sorted[i].printObject());
  } // setter News Status 


  setNewsStatus();

  for (var i = 0; i < sorted.length; i++) {
    console.log(sorted[i].getStatus());
  }

  console.log(generateDescribingText()); // FUNKSJONER 

  function createObjectAndAddToList(api, systolisk, diastolisk, time) {
    var nytt_objekt = new class_bt_1.BT_OBJECT(systolisk, diastolisk, time);
    BT_List.push(nytt_objekt);
  } // sorterer listen på tid og returnerer den sorterte listen 


  function returnListSortedByTime() {
    BT_List.sort(function (a, b) {
      if (a.time > b.time) {
        return 1;
      }

      ;

      if (a.time < b.time) {
        return -1;
      }

      ;
      return 0;
    });
    return BT_List;
  } // setter news status i forhold til den forrige målingen 


  function setNewsStatus() {
    for (var i = 1; i < sorted.length; i++) {
      var current = sorted[i];
      var previous = sorted[i - 1];
      sorted[0].setStatus("første");

      if (current.getSystolisk() != "") {
        if (current.getNewsScore() < previous.getNewsScore()) {
          current.setStatus("forbedret");
        }

        if (current.getNewsScore() == previous.getNewsScore()) {
          current.setStatus("uendret");
        }

        if (current.getNewsScore() > previous.getNewsScore()) {
          current.setStatus("forverret");
        }
      }
    }
  }

  function generateDescribingText() {
    var stringToSend = "";

    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].getStatus() == "første") {
        var forverring = "\n  \n  " + sorted[i].getTextDate() + " Kl" + sorted[i].getReadableTime() + " ble det målt systolisk BT som var på " + sorted[i].getSystolisk() + " med NEWS på " + sorted[i].getNewsScore();
        stringToSend = stringToSend.concat(forverring);
      }

      if (sorted[i].getStatus() == "forverret") {
        var forverring = "\n  \n " + sorted[i].getTextDate() + " Kl" + sorted[i].getReadableTime() + " ble det forverring på BT som ble målt til " + sorted[i].getSystolisk() + " med NEWS på " + sorted[i].getNewsScore();
        stringToSend = stringToSend.concat(forverring);
      }

      if (sorted[i].getStatus() == "forbedret") {
        var forbedring = "\n  \n" + sorted[i].getTextDate() + " Kl" + sorted[i].getReadableTime() + " ble det forbedring på BT som ble målt til " + sorted[i].getSystolisk() + " med NEWS på " + sorted[i].getNewsScore();
        stringToSend = stringToSend.concat(forbedring);
      }
    }

    return stringToSend;
  }
}

exports.main = main;
var banner = "\n_______                              _       _   \n|__   __|                            (_)     | |  \n   | |_   _ _ __   ___  ___  ___ _ __ _ _ __ | |_ \n   | | | | | '_  / _ / __|/ __| '__| | '_ | __|\n   | | |_| | |_) |  __/__  (__| |  | | |_) | |_ \n   |_|__, | .__/ ___||___/___|_|  |_| .__/ __|\n       __/ | |                         | |        \n      |___/|_|                         |_|   \n";main(api);
},{"./class_bt":1}]},{},[2])