//$(document).ready()

function getlightData() {
    fetch("http://localhost:5000/data/light")
        .then ((res) => res.json())
        .then((l_data) => {
            
            console.log(l_data);
            var lVal = document.getElementById("lightVal");
           
            //var val_ = document.createElement("DIV");
              
                
             lVal.innerHTML = l_data[0].lightVal;
            
             
            
            //l_data = JSON.stringify(data);
        
            var plant_ID = document.getElementById("plantID");
           
            //var plantID_ = document.createElement("DIV");
              
                
             plant_ID.innerHTML = l_data[0].plantID;
            
             //plant_ID.appendChild(plantID_);
        
             var cropName_ = document.getElementById("cropName");
           
            //var div = document.createElement("DIV");
             cropName_.innerHTML = l_data[0].cropName;
             //cropName_.appendChild(div);
        
             var sensorID = document.getElementById("sensorID");
           
            //var div1 = document.createElement("DIV");
             sensorID.innerHTML = l_data[0].sensorID;
             //sensorID.appendChild(div1);
            
          
        });
  
}
    
   


     function gettempData() {
        return fetch("http://localhost:5000/data/temphum")
            .then ((res) => res.json())
            .then((t_data) => {
               
                //l_data = JSON.stringify(data);
                console.log(t_data);
                var tVal = document.getElementById("tempVal");
           
               // var val_ = document.createElement("DIV");
                var hVal =document.getElementById("humVal");
                
                tVal.innerHTML = t_data[0].tempVal;
                hVal.innerHTML = t_data[0].humVal;
               // tVal.appendChild(val_);
                var plant_ID = document.getElementById("plantID1");
               
                //var plantID_ = document.createElement("DIV");
                  
                    
                 plant_ID.innerHTML = t_data[0].plantID;
                
                 //plant_ID.appendChild(plantID_);
            
                 var cropName_ = document.getElementById("cropName1");
               
                //var div = document.createElement("DIV");
                 cropName_.innerHTML = t_data[0].cropName;
                 //cropName_.appendChild(div);
            
                 var sensorID_ = document.getElementById("sensorID1");
               
                //var div1 = document.createElement("DIV");
                 sensorID_.innerHTML = t_data[0].sensorID;
                 //sensorID_.appendChild(div1);
            });
      
        }
        
       
  
         function getsoilData() {
            return fetch("http://localhost:5000/data/soil")
                .then ((res) => res.json())
                .then((s_data) => {
                    
            //l_data = JSON.stringify(data);
            console.log(s_data);
                var sVal = document.getElementById("smVal");
           
                //var val_ = document.createElement("DIV");
              
                
                sVal.innerHTML = s_data[0].soilMoisture;
            
            //sVal.appendChild(val_);
            
            var plant_ID = document.getElementById("plantID2");
           
           // var plantID_ = document.createElement("DIV");
              
                
             plant_ID.innerHTML = s_data[0].plantID;
             
             //plant_ID.appendChild(plantID_);
        
             var cropName_ = document.getElementById("cropName2");
           
            //var div = document.createElement("DIV");
             cropName_.innerHTML = s_data[0].cropName;
             //cropName_.appendChild(div);
        
             var sensorID_ = document.getElementById("sensorID2");
           
            
             sensorID_.innerHTML = s_data[0].sensorID;
             

          });
          
      }
            


  //document.ready();
  window.onload = function(){
      getlightData();
      gettempData();
      getsoilData();
  }