
#define exhaust_fan 12
#define light_ 11
#define humidifier 10
#define status_led 7


int lightval, humval, tempval;
volatile byte buttonState = LOW;
int mode =0;


void setup() {
  // put your setup code here, to run once:
 pinMode(exhaust_fan, OUTPUT);
 pinMode(light, OUTPUT);
 pinMode(humidifier, OUTPUT);
 pinMode(2, INPUT_PULLUP);
 pinMode(status_led, OUTPUT);
 attachInterrupt(digitalPinToInterrupt(2), blink, LOW);
 
 Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:


  //print out the value of the pushbutton
Serial.println(buttonState);


  humval = getHum();
  tempval = getTempr();
  lightval = getLight();
  Serial.println("The Light value is ");
  Serial.println(lightval);
  Serial.println("The Temp value is ");
  Serial.println(tempval);
  Serial.println("The Humidity value is ");
  Serial.println(humval);
  light();
  fan();
  hum();
 

 

  
delay(1000);
}


int getLight(){

  return random(500,2000);
}

int getHum(){

  return random(50,100);
}
int getTempr(){
  return random(15,40);
}

void fan(){
  if (tempval>32 && buttonState==HIGH){
  digitalWrite(exhaust_fan,HIGH);
  }else{
  digitalWrite(exhaust_fan,LOW);
  }
  }
void hum(){
  if(humval<70 && buttonState==HIGH){
  digitalWrite(humidifier,HIGH);
  }else{
  digitalWrite(humidifier,LOW);
  }
  }
void light (){
  if (lightval<1000 && buttonState==HIGH ){
    digitalWrite(light_, HIGH);
  }else{
    digitalWrite(light_,LOW);
  }
   
    
  
}
void blink(){
  buttonState = !buttonState;
  
  Serial.println(mode);
  digitalWrite(status_led,buttonState);
}
