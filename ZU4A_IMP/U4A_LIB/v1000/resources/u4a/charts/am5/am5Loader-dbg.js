sap.ui.define("u4a.charts.am5.am5Loader", [
    "sap/base/util/uid"
],function(uid){

    //이미 am5 라이브러리가 로드 됐다면 exit.
    if(typeof window?.am5 !== "undefined"){
        return;
    }

    let _url = sap.ui.require.toUrl("am5Chart") + "/index.js";

    var _oUrlParam = new URLSearchParams(location.search);

    //디버그 모드일때 url 뒤에 랜덤키 구성 처리.
    if(_oUrlParam.get("u4a-ui-debug") === true){
        _url += `?ver=${uid()}`;
    }
        
    
    var _oXhttp = new XMLHttpRequest();

    _oXhttp.onload = (e)=> {

        var _oDom = document.createElement("script");

        _oDom.id = "am5Index";

        _oDom.src = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(e.target.response)));

        document.body.append(_oDom);

    };


    _oXhttp.open("GET", _url, false);


    _oXhttp.send();


});