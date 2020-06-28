function GF_conent_sorket() {

  var url = "ws://" + location.hostname +  ":" + location.port + "/sap/bc/apc/sap/zapc_u4a_services";

  if(location.port == ""){  
    url = "ws://" + location.hostname + "/sap/bc/apc/sap/zapc_u4a_services";
  }

  var LO_Websocket = new WebSocket(url);

  LO_Websocket.onopen = function(){
     console.log("connect");
     
     Gwebsorket = LO_Websocket;     

     var Linit = document.getElementById("Gappid").value + "|" + "SORKETOPEN";

     this.send(Linit);

     LO_Websocket.onmessage = function (obj){
        
        var Lsplit = obj.data.split('　');

        var Lappid = document.getElementById("Gappid").value;

        if(Lsplit[0] == Lappid){

            var LAPPID = "";
            var LOBJID = "";
            var LATRNM = "";
            var LVALUE = "";
            var LSEND  = "";

            try {
              eval(Lsplit[1]);
            }
            catch(err) {
            alert(err);
            }
         }

      };

     LO_Websocket.onclose = function(){
   
        GF_close_sorket();
      
     };

  };

}


//sorket close 
function GF_close_sorket(){

  var Linit = document.getElementById("Gappid").value + "|" + "SORKETCLOSE";
  Gwebsorket.send(Linit);
  Gwebsorket.close();

}

var Gwebsorket = null;
GF_conent_sorket();
