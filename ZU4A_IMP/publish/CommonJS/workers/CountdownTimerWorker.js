// worker 메시지 수신 listener
self.onmessage = function(e) {

	var oReceiveData = e.data,
		oSendData = {},
		countDownDate = oReceiveData.countDownDate;
	
	if(this.timerInterval){
		clearInterval(this.timerInterval);
		this.timerInterval = null;
	}

	// Update the count down every 1 second
	this.timerInterval = setInterval(function() {
		try {
			
			var now = new Date().getTime();

			// Find the distance between now and the count down date
			var distance = countDownDate - now;

			// Time calculations for days, hours, minutes and seconds
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			hours = (hours < 0 ? 0 : hours);
			minutes = (minutes < 0 ? 0 : minutes);
			seconds = (seconds < 0 ? 0 : seconds);
			
			// return Parameter
			oSendData.hourCount = fn_addZeros(hours, 2);
			oSendData.minCount = fn_addZeros(minutes, 2);
			oSendData.secCount = fn_addZeros(seconds, 2);
			oSendData.print = oSendData.hourCount + ":" + oSendData.minCount + ":" + oSendData.secCount;
			
			postMessage(oSendData);
		
			// If the count down is over, write some text
			if (distance < 0) {

				clearInterval(this.timerInterval);
				this.timerInterval = null;
				
				oSendData.isStop = true;
				
				postMessage(oSendData);
			}
		
		}catch(e){}
		
	}.bind(this), 1000);
};

function fn_addZeros(n, width) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}	 