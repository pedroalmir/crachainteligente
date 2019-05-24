#include <WiFi.h>         // ESP32 Core WiFi Library
#include <DNSServer.h>    // Local DNS Server used for redirecting all requests to the configuration portal
#include <WebServer.h>    // Local WebServer used to serve the configuration portal
#include <WiFiManager.h>  // WiFi Configuration Manager
 
void setup() {
  Serial.begin(9600);
  
  // Creating wifi manager...
  WiFiManager wifiManager;
 
  /* Callback to setup mode */
  wifiManager.setAPCallback(configModeCallback); 
  /* Callback to event of saved config. AP mode to Station Mode */
  wifiManager.setSaveConfigCallback(saveConfigCallback); 
 
  /* Create an network with SSID: GREat_ID and pass: greatID */
  wifiManager.autoConnect("GREat_ID", "greatID"); 
  Serial.println("Setup ok!");

  /*WiFiManager wifiManager;
  if(!wifiManager.startConfigPortal("GREat_ID", "greatID")){
    Serial.println("Failed to connect!");
    delay(2000);
    ESP.restart();
  }*/
   /* To reset saved settings */
  wifiManager.resetSettings();
}

void loop() {
  Serial.println(WiFi.status() != WL_CONNECTED ? "Disconnected" : "Connected");
}

/**
 * Callback method to setup mode
 */
void configModeCallback (WiFiManager *myWiFiManager) {  
  Serial.println("You entered setup mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager -> getConfigPortalSSID());
}

/**
 * Callback method to event of saved config
 */
void saveConfigCallback () {
  Serial.println("Setting saved!");
}
