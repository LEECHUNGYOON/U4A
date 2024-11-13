// common JS 


// *--Error log visible 
function LF_Error_LOG(msg,url,l,cno,error) {
  var L_msg = '<br>'
            + '<p style="color:red;">Error message: ' + msg + '.</p>'
            + '<p style="color:red;">URL: '  + url + '</p>'
            + '<p style="color:red;">Line: ' + l
            + '<br>'; 
  
  document.getElementById("erro").innerHTML = L_msg;
    

  //if(newWindow){newWindow=null}

  //var newWindow = window.open ("","errolistwindow","width=335,height=330,resizable=1,toolbar=1,scrollbars=1,status=0");
 
  //newWindow.document.write(L_msg);
  //newWindow.document.title = "erro list";
  //newWindow.focus();


}


// *--GlobalEventHandlers.onerror --*
window.onerror = function(msg,url,lineNo,columnNo,error){


  // Error log 
  LF_Error_LOG(msg,url,lineNo,columnNo,error);  

};


//window.onunload = function(){
 $(window).bind('beforeunload', function(){

  var locationUrl = location.href;
  var splitUrl    = locationUrl.split('/');  
  var len         = splitUrl.length - 1;
  var appid       = splitUrl[len];
  var res         = appid.toLowerCase();

  var zGappid     = document.getElementById("Gappid").value; 
  
  var closeURL    = "/zu4a/" + res + "?APPCLOSE=X&zGappid=" + zGappid;


  $.ajax({
      type       : "POST",
      contentType:"application/json",
      url        :closeURL

      })

});






