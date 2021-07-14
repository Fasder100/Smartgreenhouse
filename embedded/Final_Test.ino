#include <SoftwareSerial.h>
#define RX 6
#define TX 5
#define exhaust_fan 12
#define light_ 11
#define humidifier 10
#define status_led 7

SoftwareSerial ESP01 (RX,TX); // RX | TX
SoftwareSerial xbee (2,3);

String ssid = "138SL-Residents";
String password = "resident2020@138sl";
String host = "10.10.26.238";
String PORT = "5000";
String Command  = "";
String post = "";
String body = "";
int id = 1;
int countTrueCommand;
int countTimeCommand; 
boolean found = false; 

int i ;
String received=""; //received from the other XBEE
char c; //byte received
char dispose; //dispose bytes
 String light = "";
 String Temp ="";
 String Hum ="";
 String Soil ="";
 int lightint;
 int Soilint ;
 int Humint;
 int Tempint ;

volatile byte buttonState = LOW;


void setup() {
 pinMode(exhaust_fan, OUTPUT);
 pinMode(light_, OUTPUT);
 pinMode(humidifier, OUTPUT);
 pinMode(1, INPUT_PULLUP);
 pinMode(status_led, OUTPUT);
 attachInterrupt(digitalPinToInterrupt(1), blink, LOW);
 randomSeed(analogRead(0));
  Serial.begin(9600);
  xbee.begin(9600);
  ESP01.begin(115200);
  ESP01.listen();
  sendCommand("AT",5,"OK"); // check if connection is okay
  sendCommand("AT+CWMODE=1",5,"OK"); // set client mode
  sendCommand("AT+CWJAP=\""+ ssid +"\",\""+ password +"\"",20,"OK");
  
}

void loop() {
  buttonState= HIGH;
     xbee.listen();
     delay(1000);
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
      Serial.println("Reading");
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
    light =received.substring(1, 6);
    Soil = received.substring(6, 10);
    Hum = received.substring(11, 19);
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
   ESP01.listen(); 
   sendCommand("AT+CIPSTART=\"TCP\",\""+ host +"\"," + PORT,15,"OK");
   body = "";
    body = "{\"soil\":"+ String(Soilint);
    body+= ",\"temp\":"+ String(Tempint);
    body+= ",\"light\":" + String(lightint);
    body+= ",\"humidity\":" + String(Humint);
    body+= ",\"plantID\":" + String(0001);
    body+= ",\"sensorID\":"+ String(0001);
    body+= ",\"cropName\": \"cassava\"";
    body+= "}";
    post="";
    post = "POST /data HTTP/1.1\r\nHost: ";
    post += host;
    post += "\r\nContent-Type: application/json\r\nContent-Length:";
    post += body.length();
    post += "\r\n\r\n";
    post += body;
    post += "\r\n";
    Command = "AT+CIPSEND=";
    Command+= String(post.length());
    sendCommand(Command, 10, "OK");
    sendCommand(post, 10,"OK");
    sendCommand("AT+CIPCLOSE=0", 15, "OK");
    delay(2000);
}
lightact();
fan();
hum();

}


void sendCommand(String command, int maxTime, char readReplay[]) {
  Serial.print(countTrueCommand);
  Serial.print(". at command => ");
  Serial.print(command);
  Serial.print(" ");
  while(countTimeCommand < (maxTime*1))
  {
    ESP01.println(command);//at+cipsend
    if(ESP01.find(readReplay))//ok
    {
      found = true;
      break;
    }
  
    countTimeCommand++;
  }
  
  if(found == true)
  {
    Serial.println("Successful");
    countTrueCommand++;
    countTimeCommand = 0;

  }
  
  if(found == false)
  {
    Serial.println("Unsuccessful");
    countTrueCommand = 0;
    countTimeCommand = 0;
  }
  
  found = false;
 }





void fan(){
  if (Tempint>32 && buttonState==HIGH){
  digitalWrite(exhaust_fan,HIGH);
  }else{
  digitalWrite(exhaust_fan,LOW);
  }
  }
void hum(){
  if(Humint<70 && buttonState==HIGH){
  digitalWrite(humidifier,HIGH);
  }else{
  digitalWrite(humidifier,LOW);
  }
 }
void lightact(){
  if (lightint<1000 && buttonState==HIGH ){
    digitalWrite(light_, HIGH);
  }else{
    digitalWrite(light_,LOW);
  }
 
}

void blink(){
  buttonState = !buttonState;
  Serial.println(buttonState);
  digitalWrite(status_led,buttonState);
}
