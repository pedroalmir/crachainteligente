#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,16,2);  // set the LCD address to 0x27 for a 16 chars and 2 line display
int LED_BUILTIN = 2;

void setup(){ 
  lcd.begin(4, 5);                      // initialize the lcd (SDA, SCL)
  // Print a message to the LCD.
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("Hello, world!");
  lcd.setCursor(0,1);
  lcd.print("by EasyIoT");

  pinMode (LED_BUILTIN, OUTPUT);
}


void loop(){
  digitalWrite (LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite (LED_BUILTIN, LOW);
  delay(1000);
}
