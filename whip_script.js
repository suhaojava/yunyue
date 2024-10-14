const localVideo = document.getElementById('localVideo');
const startButton = document.getElementById('startButton');

navigator.mediaDevices.enumerateDevices().then(function(devices) {
    devices.forEach(function(device) {
      console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
      // 在这里，你可以根据 device.kind 和 device.label 来构建用户界面，让用户选择设备
    });
  }).catch(function(err) {
    console.log(err.name + ": " + err.message);
  });

let localStream;
let peerConnection;

// Function to start streaming
async function startStreaming() {  
    try {  

	
	
		const constraints = {  
			  video: {  
				deviceId: { exact: '1139df5ee936808e5fb8e3f08a7d222dee8f2acc1e0462d164f7e32daff5ae9f' } // selectedDeviceId 是用户选择的视频设备的 deviceId  
			  },  
			  audio: {  
				deviceId: { exact: 'default' } // 如果需要，也可以指定音频设备的 deviceId
			  }  
			};  

	
        // Get the local media stream  
        const localStream = await navigator.mediaDevices.getUserMedia(constraints);  
        localVideo.srcObject = localStream;  
  
        // Initialize Peer Connection  
        const peerConnection = new RTCPeerConnection();  
  
        // Add tracks to the peer connection  
        localStream.getTracks().forEach(track => {  
            peerConnection.addTrack(track, localStream);  
        });  
  
        // Create an offer 
         var randomInt1 = Math.floor(Math.random() * 1000);
         var randomInt2 = Math.floor(Math.random() * 1000);
         var url = 'https://11.11.2.119:8043/index/api/whip?app=live&stream='+randomInt1+'_'+randomInt2+'&type=push';

	      peerConnection.createOffer().then(desc => {
			console.log('offer:', desc.sdp);
			peerConnection.setLocalDescription(desc).then(() => {
			  axios({
				method: 'post',
				url: url,
				responseType: 'json',
				data: desc.sdp,
				headers: {
				  'Content-Type': 'text/plain;charset=utf-8'
				}
			  }).then(response => {
				let ret = response.data;
				let anwser = {};
				anwser.sdp = ret;
				anwser.type = 'answer';
				console.log('answer:', ret);
				peerConnection.setRemoteDescription(anwser).then(() => {
				  console.log('set remote sucess');
				}).catch(e => {
				  console.error('Error in startStreaming:', e);  
				});
			  });
			});
		  }).catch(e => {
			console.error('Error in startStreaming:', e);
		  });


  
    } catch (error) {  
        console.error('Error in startStreaming:', error);  
    }  
}

// Event listener for the start button
startButton.addEventListener('click', startStreaming);