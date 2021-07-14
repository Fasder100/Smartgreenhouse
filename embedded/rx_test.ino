#include <SoftwareSerial.h> 

#define RXPIN 2 // Arduino Pin for Reception
#define TXPIN 3   // Arduino Pin for Transmission

  // link virtual serial between xbee and arduino

SoftwareSerial xbee (RXPIN, TXPIN);
/* Communication */
int i,found ;
String frame = ""; //sent to the other XBEE
String state_start=""; //for start
String received=""; //received from the other XBEE
char c; //byte received
int lightint;
int Soilint;
int Tempint;
int Humint;
void setup() {
  
  Serial.begin(9600); //opening serial with 9600 baud
  
  /* XBee Initialisation */
  while(!Serial)
  { ; } //waiting for Serial Port
  xbee.begin(9600); // opening serial xbee with 9600 baud
  pinMode(7,OUTPUT);
  pinMode(8,OUTPUT);
  pinMode(9,OUTPUT);
  
  Serial.println("Arduino is ready"); //serial link activated
}

void loop() {

//Waiting for the Start 
    //Serial.flush(); //clear out
     c=xbee.read();
    if (c == 0x7E){
   
    for(int b=0; b<15; b++){
      char dispose = xbee.read();
    }      
    }
    //received=xbee.readStringUntil('X');
    //Start Delimiter Detected
    if (c==0x4C) {
       received.concat(c);
       for (i=0;i<35;i++) {
        c=xbee.read();
        received.concat(c); 
       }
    Serial.println();
    Serial.println(received);
    
//  found = received.indexOf("Start"); //detect "Send" and return index
    String light = "";
    String Temp ="";
    String Hum ="";
    String Soil ="";
    light =received.substring(1, 5);
    Soil = received.substring(6, 9);
    Hum = received.substring(11, 18);
    Temp = received.substring(19,25);
     lightint = light.toInt();
     Soilint = Soil.toInt();
     Humint = Hum.toInt();
     Tempint = Temp.toInt();
     Serial.println();
     Serial.println();
     
    Serial.println(lightint);
    Serial.println(Soilint);
    Serial.println(Humint);
    Serial.println(Tempint);
    
     
     received ="";
    
     
}

     if(lightint >9){
      digitalWrite(7,HIGH);
      delay(500);
      digitalWrite(7,LOW);
      }
      if(Tempint <26){
      digitalWrite(8,HIGH);
      delay(500);
      digitalWrite(8,LOW);
      }

      if(Soilint > 100){
      digitalWrite(5,HIGH);
      delay(500);
      digitalWrite(5,LOW);
      }
    
}
