// worker 메시지 수신 listener
self.onmessage = function(e) {
	
	var oData = e.data,
		sDateTime = "";
	
	if(this.currentTimer){
		clearInterval(this.currentTimer);
		this.currentTimer = null;
	}
	
	this.currentTimer = setInterval(function(){
		
		var currentDate = new Date();
		
		// 날짜
		var sDate = currentDate.getFullYear()
					+ "-" + addZeros((currentDate.getMonth() + 1 ), 2)
					+ "-" + addZeros(currentDate.getDate(), 2); // 현재 날짜
		
		// 시간
		var currentHours = addZeros(currentDate.getHours(),2),
			currentMinute = addZeros(currentDate.getMinutes() ,2),
			currentSeconds =  addZeros(currentDate.getSeconds(),2);
		
		var amPm = ''; // 초기값 AM

		// 시간 표기법에 따른 표현식 결정  12 or 24
		if(!oData.support2400){
			amPm = 'AM';

			if(currentHours >= 12){ // 시간이 12보다 클 때 PM으로 세팅, 12를 빼줌
				amPm = 'PM';

				if(currentHours > 12){
					currentHours = addZeros(currentHours - 12,2);
				}
			}
		} // end of if
		
		sDateTime = currentHours + ":"
                  + currentMinute + ":"
                  + currentSeconds + " " + amPm;
				  
		postMessage(sDateTime);
		
	}, 1000);
};

function addZeros(n, width) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}	 