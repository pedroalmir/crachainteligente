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

#define SS_PIN    21  // SDA pin of RFID
#define RST_PIN   22  // reset pin of RFID
#define LED_ACCESS_GRANTED  2
#define LED_ACCESS_DENIED   12

#define WIFI_SSID "CLARO_2GDB49CF"
#define WIFI_PWD "9EDB49CF"
#define FIREBASE_HOST "crachainteligence.firebaseio.com"
#define FIREBASE_AUTH "QxdC3N03YVSqUmSkrx1s0PlH0FkmGPkYG5TE8bSS"

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance.
MFRC522::MIFARE_Key key;

LiquidCrystal_I2C lcd(0x27,16,2);  // Set the LCD address to 0x27 for a 16 chars and 2 line display

FirebaseData firebaseData;
 
/**
 * GREatID Hardware
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
  
  pinMode (LED_ACCESS_GRANTED, OUTPUT);
  pinMode (LED_ACCESS_DENIED, OUTPUT);

  connectWifi();
  
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

void connectWifi(){
  WiFi.begin(WIFI_SSID, WIFI_PWD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());
}

/**
 * Print welcome message in LCD Display
**/
void printMessageLCD(String greeting, String name, int led){
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print(greeting);
  lcd.setCursor(0,1);
  lcd.print(name); 
  blinkThreeTimes(led);
  lcd.clear();
  lcd.noBacklight();
  return;
}

void blinkThreeTimes(int port){
  digitalWrite(port, HIGH); delay(500);
  digitalWrite(port, LOW);  delay(500);
  digitalWrite(port, HIGH); delay(500);
  digitalWrite(port, LOW);  delay(500);
  digitalWrite(port, HIGH); delay(500);
  digitalWrite(port, LOW);
}

String getActualDate(){
  // Configurações do Servidor NTP
  char* servidorNTP = "a.st1.ntp.br"; // Servidor NTP para pesquisar a hora
  int fusoHorario = -10800;           // Fuso horário em segundos (-03h = -10800 seg)
  
  WiFiUDP ntpUDP; // Declaração do Protocolo UDP
  NTPClient timeClient(ntpUDP, servidorNTP, fusoHorario);
  
  // Initialize a NTPClient to get time
  timeClient.begin();
  timeClient.update();
  String date = timeClient.getFullFormattedTime();
  timeClient.end();
  return date;
}

void saveEntryInFirebase(String name, String date){
  //Begin Firebase connection
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  Firebase.pushString(firebaseData, name + "/input", date);
  
  //Quit Firebase and release all resources
  Firebase.end(firebaseData);
}

/**
 * Function to active writing mode using serial port;
 **/
boolean checkWritingHardMode(){
  Serial.setTimeout(2000L);     
  Serial.println(F("You have two second to enter the writing option (1). Otherwise, the default reading will be done."));
  int option = (int)Serial.parseInt();
  if(option == 1) return true;
  else return false;
}

/**
 * Get user name in sector #1, block 4 (key A at block 7);
 **/
String getUsername(){
  byte status;
  byte buffer[18];
  byte size = sizeof(buffer);
  byte usernameLocation[3] = {1, 4, 7};
  
  // Authenticate using key A
  Serial.println(F("Authenticating using key A..."));
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, usernameLocation[2], &key, &(mfrc522.uid));
  if(status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName((MFRC522::StatusCode)status));
    return "";
  }

  // Read data from the block
  Serial.print(F("Reading data from block "));Serial.print(usernameLocation[1]);Serial.println(F(" ..."));
  status = mfrc522.MIFARE_Read(usernameLocation[1], buffer, &size);
  if(status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Read() failed: "));
    Serial.println(mfrc522.GetStatusCodeName((MFRC522::StatusCode)status));
  }
  
  Serial.print(F("Data in block ")); Serial.print(usernameLocation[1]); Serial.println(F(":"));
  dump_byte_array(buffer, 16); Serial.println();
  String value = (char*)buffer;
  return value.substring(0, value.indexOf('#'));
}

/**
 * Show some details of the PICC (that is: the tag/card)
 **/
void showTagInfo(boolean showAllData){
  Serial.print(F("Card UID:"));
  dump_byte_array(mfrc522.uid.uidByte, mfrc522.uid.size);
  Serial.println();
  Serial.print(F("PICC type: "));
  byte piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
  Serial.println(mfrc522.PICC_GetTypeName((MFRC522::PICC_Type)piccType));

  if(showAllData){
    mfrc522.PICC_DumpMifareClassicToSerial(&(mfrc522.uid), (MFRC522::PICC_Type)piccType, &key);
  }
}

boolean writeUsername(){
  byte status;
  byte buffer[18];
  byte size = sizeof(buffer);
  
  byte dataBlock[16] = "";
  byte usernameLocation[3] = {1, 4, 7};
  
  Serial.setTimeout(30000L);     
  Serial.println(F("Enter the data to be written with the '#' character at the end [maximum of 16 chars]:"));
  byte dataSize = Serial.readBytesUntil('#', (char*)dataBlock, 16);
  for(byte i = dataSize; i< 16; i++){
    dataBlock[i] = '#';
  }
  
  // Authenticate using key A
  Serial.println(F("Authenticating again using key A..."));
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, usernameLocation[2], &key, &(mfrc522.uid));
  if(status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName((MFRC522::StatusCode)status));
    return false;
  }

  // Write data to the block
  Serial.print(F("Writing data into block "));Serial.print(usernameLocation[1]);Serial.println(F(" ..."));
  dump_byte_array(dataBlock, 16); Serial.println();
  status = mfrc522.MIFARE_Write(usernameLocation[1], dataBlock, 16);
  if(status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName((MFRC522::StatusCode)status));
  }
  Serial.println();

  // Read data from the block (again, should now be what we have written)
  Serial.print(F("Reading data from block "));Serial.print(usernameLocation[1]);Serial.println(F(" ..."));
  status = mfrc522.MIFARE_Read(usernameLocation[1], buffer, &size);
  if(status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Read() failed: "));
    Serial.println(mfrc522.GetStatusCodeName((MFRC522::StatusCode)status));
  }
  Serial.print(F("Data in block "));Serial.print(usernameLocation[1]);Serial.println(F(":"));
  dump_byte_array(buffer, 16); Serial.println();
  Serial.println((char*)buffer);
  /** 
   * Check that data in block is what we have written
   * by counting the number of bytes that are equal
  **/
  Serial.println(F("Checking result..."));
  byte count = 0;
  for (byte i = 0; i < 16; i++) {
    // Compare buffer with dataBlock
    if(buffer[i] == dataBlock[i])
      count++;
  }
  Serial.print(F("Number of bytes that match = ")); Serial.println(count);
  if(count == 16) {
    Serial.println(F("Success :-)"));
  }else{
    Serial.println(F("Failure, no match. Writing problems!"));
    return false;
  }
  Serial.println();

  return true;
}

/**
 * Main loop.
 */
void loop() {
  // Look for new cards
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial()) return;

  byte sector = 1;
  // Show the whole sector as it currently is
  Serial.println(F("Current data in sector:"));
  mfrc522.PICC_DumpMifareClassicSectorToSerial(&(mfrc522.uid), &key, sector);
  Serial.println();

  if(checkWritingHardMode()){
    //Go to writing function
    writeUsername();
  }else{
    //Read data
    String name = getUsername();
    name.trim();

    /* Only for test */
    if(mfrc522.uid.uidByte[0] == 0xE0 && mfrc522.uid.uidByte[1] == 0x8A &&
        mfrc522.uid.uidByte[2] == 0x6F && mfrc522.uid.uidByte[3] == 0xA3) {
      Serial.print("Welcome, " + name + "!");
      printMessageLCD("Welcome, ", name, LED_ACCESS_GRANTED);
      saveEntryInFirebase(name, getActualDate());
    }else if(mfrc522.uid.uidByte[0] == 0x96 && mfrc522.uid.uidByte[1] == 0x2B &&
        mfrc522.uid.uidByte[2] == 0x66 && mfrc522.uid.uidByte[3] == 0xAC){
      Serial.println("Access Denied, " + name + "!");
      printMessageLCD("Access Denied, ", name, LED_ACCESS_DENIED);
    }else{
      Serial.println("Are you crazy? Try again!");
      printMessageLCD("Are you crazy?", "Try again!", LED_ACCESS_DENIED);
    }
  }

  // Halt PICC
  mfrc522.PICC_HaltA();
  // Stop encryption on PCD
  mfrc522.PCD_StopCrypto1();
}
