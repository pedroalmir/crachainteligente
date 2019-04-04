/**
 * 
**/
#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include <ArduinoJson.h>
#include <FirebaseArduino.h>

#define FIREBASE_HOST "crachainteligence.firebaseio.com"
#define FIREBASE_AUTH "QxdC3N03YVSqUmSkrx1s0PlH0FkmGPkYG5TE8bSS"

#define WIFI_SSID "J221"
#define WIFI_PWD "847aaubh"

ESP8266WiFiMulti WiFiMulti;

String input = "";

/*
 * GetValue @data @separator @index
 * https://stackoverflow.com/questions/9072320/split-string-into-string-array 
 * Return: string
*/
String getValue(String data, char separator, int index){
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i = 0; i <= maxIndex && found <= index; i++){
    if(data.charAt(i) == separator || i == maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return (found > index) ? ((index == 2) ? data.substring(strIndex[0]) : data.substring(strIndex[0], strIndex[1])) : "";
}

void setup() {
  Serial.begin(115200);

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(WIFI_SSID, WIFI_PWD);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}


void loop() {
  if (Serial.available() > 0) {
    input = Serial.readString();
    input = input.substring(0, input.length()-2);
    input.trim();
    if(getValue(input, ' ', 0) == "get"){
      String tag = getValue(input, ' ', 1);
      if ((WiFiMulti.run() == WL_CONNECTED)) {
        String value = Firebase.getString(tag);
        Serial.println(tag + ": " + value);

         if (Firebase.failed()) {
          Serial.print("setting /number failed: " + Firebase.error());
          Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
          return;
        }
        
      }
    }else if(getValue(input, ' ', 0) == "save"){
      String tag = getValue(input, ' ', 1);
      String value = getValue(input, ' ', 2);
      Serial.println("Saving tag " + tag + " with value " + value);
      if ((WiFiMulti.run() == WL_CONNECTED)) {
        Firebase.setString(tag, value);
      }
    }
  }
}
