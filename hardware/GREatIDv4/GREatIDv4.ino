#include <deprecated.h>
#include <MFRC522.h>
#include <MFRC522Extended.h>
#include <require_cpp11.h>
#include <SPI.h>

#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

#include <WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <FirebaseESP32.h>

#include <DNSServer.h>    // Local DNS Server used for redirecting all requests to the configuration portal
#include <WebServer.h>    // Local WebServer used to serve the configuration portal
#include <WiFiManager.h>  // WiFi Configuration Manager

#include <ArduinoJson.h>  // ArduinoJson - arduinojson.org

#define SS_PIN    21  // SDA pin of RFID
#define RST_PIN   22  // reset pin of RFID
#define LED_ACCESS_GRANTED  2
#define LED_ACCESS_DENIED   12

#define WIFI_SSID "CLARO_2GDB49CF"
#define WIFI_PWD "9EDB49CF"

//#define WIFI_SSID "J221"
//#define WIFI_PWD "847aaubh"

#define FIREBASE_HOST "crachainteligence.firebaseio.com"
#define FIREBASE_AUTH "QxdC3N03YVSqUmSkrx1s0PlH0FkmGPkYG5TE8bSS"

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance.
MFRC522::MIFARE_Key key;

LiquidCrystal_I2C lcd(0x27,16,2);  // Set the LCD address to 0x27 for a 16 chars and 2 line display

FirebaseData firebaseData;
 
/**
 * GREatID Hardware v4
 * Pinout:
 *  RFID 3.3V -|3.3V       GND|- RFID GND
 *            -|EN      GPIO23|- RFID MOSI: used to receive data
 *            -|GPIO36  GPIO22|- RFID RST: reset pin
 *            -|GPIO39     TX0|-
 *            -|GPIO34     RX0|-
 *            -|GPIO35  GPIO21|- RFID SDA: bi-directional line
 *            -|GPIO32     GND|- LEDs GND
 *            -|GPIO33  GPIO19|- RFID MISO: used to send data
 *            -|GPIO25  GPIO18|- RFID SCK: clock
 *            -|GPOI26  GPIO05|- I2C SCL
 *            -|GPIO27  GPIO17|-
 *            -|GPIO14  GPIO16|-
 * LED_DENIED -|GPIO12  GPIO04|- I2C SDA
 *    I2C GND -|GND     GPIO00|-
 *            -|GPIO13  GPIO02|- LED_GRANTED
 *            -|GPIO09  GPIO15|- 
 *            -|GPIO10  GPIO08|-
 *            -|GPIO11  GPIO07|-
 * I2C VCC(5v)-|Vin(5v) GPIO06|-
 *  
 *  >> Please, don't change it!!!
 *  
 * Card: E0 8A 6F A3
 * Tag: 96 2B 66 AC
 * Type: MIFARE 1KB
 * 
 * Sector of user name: #1
 * byte[] usernameData = {1, 4, 7};
 * 
 * Setup function
**/
void setup() {
  Serial.begin(9600); // Initialize serial communications
  SPI.begin();        // Initialize SPI bus
  mfrc522.PCD_Init(); // Initialize MFRC522 card
  lcd.begin(4, 5);    // Initialize the lcd (SDA, SCL)
  lcd.backlight();
  
  pinMode (LED_ACCESS_GRANTED, OUTPUT);
  pinMode (LED_ACCESS_DENIED, OUTPUT);

  connectWifiFinalPresentation();
  connectFirebase();
  
  /** 
   * Prepare the key (used both as key A and as key B)
   * using FFFFFFFFFFFFh which is the default at chip 
   * delivery from the factory
   */
  for(byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  dump_byte_array(key.keyByte, MFRC522::MF_KEY_SIZE);

  Serial.println();
  Serial.println(F("GREatID Hardware: setup completed successfully;"));
}

/**
 * Helper routine to dump a byte array as hex values to Serial.
 **/
void dump_byte_array(byte *buffer, byte bufferSize) {
    for(byte i = 0; i < bufferSize; i++) {
      Serial.print(buffer[i] < 0x10 ? " 0" : " ");
      Serial.print(buffer[i], HEX);
    }
}

/**
 * Connect to WiFi method.
 * In this case, we have used a hard coded network
 * to improve the performance and avoid problems in
 * presentation.
 */
void connectWifiFinalPresentation(){
  WiFi.begin(WIFI_SSID, WIFI_PWD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);Serial.println("Connecting to WiFi...");
    printMessageLCD("GREat ID", "Connecting...", 0);
  }
  Serial.println("Connected to the WiFi network");
  printMessageLCD("GREat ID", "Connected!!!", 0);
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());
}

/**
 * Print welcome message in LCD Display
 */
void printMessageLCD(String greeting, String name, int led){
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(greeting);
  lcd.setCursor(0,1);
  lcd.print(name); 
  blinkThreeTimes(led);
  //lcd.noBacklight();
}

/**
 * Blink method
 */
void blinkThreeTimes(int port){
  digitalWrite(port, HIGH); delay(500);
  digitalWrite(port, LOW);  delay(500);
  digitalWrite(port, HIGH); delay(500);
  digitalWrite(port, LOW);  delay(500);
  digitalWrite(port, HIGH); delay(500);
  digitalWrite(port, LOW);
}

/**
 * Get actual date using NTP server
 */
String getActualDate(){
  char* servidorNTP = "a.st1.ntp.br";
  int fusoHorario = -10800;
  
  WiFiUDP ntpUDP;
  NTPClient timeClient(ntpUDP, servidorNTP, fusoHorario);
  
  timeClient.begin();
  String date = "";
  while(true){
    timeClient.update();
    int year = timeClient.getYear();
    Serial.println(year);
    date = timeClient.getFullFormattedTime();

    if(year >= 2019) break;
    delay(500);
  }
     
  timeClient.end();
  return date;
}

/**
 * Save entry in firebase
 */
void saveEntryInFirebase(String userUID, String cardUID, String date, String type){
  Firebase.pushString(firebaseData, userUID + "/registers", date);
  Firebase.setString(firebaseData, userUID + "/info/lastAction", type);
  //Firebase.setString(firebaseData, "/cards/" + cardUID + "/lastAction", type);
}


/**
 * Firebase connection methods:
 * 
 * - Connect to firebase database;
 * - Close connection with firebase (not used yet);
 * - Reconnect to firebase database (not used yet);
 */
void connectFirebase(){
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  //Firebase.setMaxRetry(firebaseData, 3);
}

void endFirebaseConnection(){
  //Quit Firebase and release all resources
  Firebase.end(firebaseData);
}

void reconnectFirebaseConnection(){
   endFirebaseConnection();
   connectFirebase();
}

/**
 * Get data from Firebase in json format
 */
String getFirebaseJsonData(String tag){
  int count = 1;
  while(!Firebase.getJSON(firebaseData, tag)){ 
    Serial.println("Searching in firebase tag: " + tag);
    if(count == 3){ break; }
    count++;
  }
  return (count == 3) ? "" : firebaseData.jsonData();
}

/**
 * Get data from Firebase in string format
 */
String getFirebaseStringData(String tag){
  /*int count = 1;
  while(!Firebase.getString(firebaseData, tag)){ 
    Serial.println("Searching in firebase tag: " + tag);
    if(count == 3){ break; }
    count++;
  }
  return (count == 3) ? "" : firebaseData.stringData();*/
  Firebase.getString(firebaseData, tag);
  return firebaseData.stringData();
}

/**
 * Convert card UID to String
 */
String convertCardUID2String(){
  return String(mfrc522.uid.uidByte[0], HEX) + String(mfrc522.uid.uidByte[1], HEX) + String(mfrc522.uid.uidByte[2], HEX) + String(mfrc522.uid.uidByte[3], HEX);
}

/**
 * Main loop.
 */
void loop() {
  printMessageLCD("GREat ID", "Presence record", 0);
  
  // Look for new cards
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial()) return;

  String cardUID = convertCardUID2String();
  printMessageLCD("Wait a moment!", "Processing...", 0);
    
  /* Reading data from Firebase... */
  //String json = getFirebaseJsonData("/cards/" + cardUID);
  /* Capacity of the memory pool in bytes */
  //StaticJsonBuffer<200> JSONBuffer;
  /* Deserialize the JSON document */
  //JsonObject& parsed = JSONBuffer.parseObject(json);
  
  String userUID = getFirebaseStringData("/cards/" + cardUID + "/uid");
    
  /* Test if parsing succeeds. !parsed.success() */
  //if (!parsed.success()) {
  if (userUID.length() == 0) {
    Serial.println("Access Denied!");
    printMessageLCD("Access Denied!!! ", "Sign up now!", LED_ACCESS_DENIED);
  }else{
    //const char* userUID = parsed["uid"];
    //const char* userName = parsed["name"];
    //const char* laCharArray = parsed["lastAction"];
    
    String userName = getFirebaseStringData("/cards/" + cardUID + "/name");
    String lastAction = getFirebaseStringData("/" + String(userUID) + "/info/lastAction");
    
    String type = "";
    if(lastAction == "input"){
      type = "output";
    }else if(lastAction == "output"){
      type = "input";
    }else{
      type = "input";
    }
    
    /* Updating data [registers and lastAction: in or output] in firebase */
    printMessageLCD("Wait a moment!", "Saving data...", 0);
    saveEntryInFirebase(userUID, cardUID, getActualDate(), type);
    
    String greeting = (type == "input") ? "Welcome, " : "See you, ";
    Serial.print(greeting + userName + "!");
    printMessageLCD(greeting, userName, LED_ACCESS_GRANTED);
  }
}
