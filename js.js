var video = document.getElementById('video');
var container = document.getElementById('custom-video');
var playbutton = document.getElementById('playpause');
var mutebutton = document.getElementById('mute');
var fullscreenbutton = document.getElementById('fullscreen');
var seek = document.getElementById('seekbar');
var volume = document.getElementById('volumebar');
var progressbar = document.getElementById('progressbar');
var bufferbar = document.getElementById('bufferbar');   
var controls = document.getElementById('controls');
var tooltip = document.getElementById('tooltip');
var duration = document.getElementById('duration');
var currentTime = document.getElementById('currenttime');
var seeker = document.getElementById('seeker');
var buffTime = document.getElementById('buffTime');
var buffVolum = document.getElementById('buffVolum');
var volumebufferbar = document.getElementById('volumebufferbar');
var play = document.getElementById('play');

var hasHours = false;
var tifHours = false;
var isFullscreen= false;
var full = false;

var vval = volume.value;
volumebufferbar.value = (volume.value * 100);
var floatTipStyle = tooltip.style;

var timerId = setTimeout(function() { controls.style.display = 'none'; }, 3000);

function playpause(){
	if(video.paused){
		video.play();
		playbutton.classList.add('icon-pause');
		playbutton.classList.remove('icon-play');
		seek.classList.add('light');
		play.style.display = "none";		
	}else{
		video.pause();
		playbutton.classList.add('icon-play');
		playbutton.classList.remove('icon-pause');
		seek.classList.remove('light');
		play.style.display = "block";
	}
	play.style.left = (video.clientWidth / 2) - (play.clientWidth / 2)  + 'px';
	play.style.top = (video.clientHeight / 2) - (play.clientHeight / 2)  + 'px';		
}

function formatTime(time, hours) {
    if (hours) {
        var h = Math.floor(time / 3600);
        time = time - h * 3600;                   
        var m = Math.floor(time / 60);
        var s = Math.floor(time % 60);           
        return h.lead0(2)  + ":" + m.lead0(2) + ":" + s.lead0(2);
    } else {
        var m = Math.floor(time / 60);
        var s = Math.floor(time % 60);                 
        return m.lead0(2) + ":" + s.lead0(2);
    }
}
            
Number.prototype.lead0 = function(n) {
    var nz = "" + this;
    while (nz.length < n) {
        nz = "0" + nz;
    }
    return nz;
};

function changeHandler() {                                                                                            
	if (!full) {
		full = true;  
		seeker.style.width = screen.width - 275 + 'px';
		play.style.left = (screen.width / 2) - (play.clientWidth / 2)  + 'px';
		play.style.top = (screen.height / 2) - (play.clientHeight / 2)  + 'px';	
		isFullscreen=true;
		fullscreenbutton.classList.remove('icon-fullscreen-alt');
		fullscreenbutton.classList.add('icon-fullscreen-exit-alt');		
	} else { 
		full = false ;
		seeker.style.width = controls.clientWidth - 275 + 'px';
		play.style.left = (video.clientWidth / 2) - (play.clientWidth / 2)  + 'px';
		play.style.top = (video.clientHeight / 2) - (play.clientHeight / 2)  + 'px';
		isFullscreen=false;
		fullscreenbutton.classList.add('icon-fullscreen-alt');
		fullscreenbutton.classList.remove('icon-fullscreen-exit-alt');		
	}		
} 

mutebutton.addEventListener('click', function(){
	if(video.muted) {
		video.muted = false;
		mutebutton.classList.add('icon-volume-2');
		mutebutton.classList.remove('icon-volume');
		volume.value = vval;
		volumebufferbar.value = (volume.value * 100);
	} else {
		video.muted = true;
		volume.value = 0;
		volumebufferbar.value = (volume.value * 100);
		mutebutton.classList.add('icon-volume');
		mutebutton.classList.remove('icon-volume-2');
	}   
}, false);

play.addEventListener('click', function(){ 
	playpause();
}, false);
 
fullscreenbutton.addEventListener('click', function() {
	if(!isFullscreen){
		if (container.requestFullscreen) {
			container.requestFullscreen();
		} 
		else if (container.mozRequestFullScreen) {
			container.mozRequestFullScreen(); // Firefox
		} 
		else if (container.webkitRequestFullscreen) {
			container.webkitRequestFullscreen(); // Chrome and Safari
		}
		isFullscreen=true;
		fullscreenbutton.classList.remove('icon-fullscreen-alt');
		fullscreenbutton.classList.add('icon-fullscreen-exit-alt');
	}
	else{

		if(document.cancelFullScreen) {
			document.cancelFullScreen();
		} 
		else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} 
		else if(document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
		isFullscreen=false;
		fullscreenbutton.classList.add('icon-fullscreen-alt');
		fullscreenbutton.classList.remove('icon-fullscreen-exit-alt');
	}
}, false);

volume.addEventListener('change', function(){
	video.volume = this.value;
	vval = this.value;
	if(this.value < 0.05){
		video.muted = true;
		mutebutton.classList.add('icon-volume');
		mutebutton.classList.remove('icon-volume-2');
	}
	else if(this.value !== 0){
		video.muted = false;
		mutebutton.classList.add('icon-volume-2');
		mutebutton.classList.remove('icon-volume');
	}
}, false);

volume.addEventListener('mousemove', function(e) {
	var x = e.offsetX;
	buffVolum.style.left = x + 160 + seeker.clientWidth  + 'px';
	buffVolum.style.top =  seek.style.top - 5 + 'px';
	var prs = Math.floor((x / volume.clientWidth) * 100);
	buffVolum.innerHTML = prs + '%';
	if(prs < 0 || prs > 100){
		buffVolum.style.display = "none";
	}else{
		buffVolum.style.display = "block";
		video.volume = this.value;
		volumebufferbar.value = (this.value * 100);
	}
}, false);

volume.addEventListener('mouseover', function(e) {
	buffVolum.style.display = "block";
}, false);

volume.addEventListener('mouseout',  function() {
	buffVolum.style.display = "none";
}, false);

seek.addEventListener('change', function(){
	var time = video.duration * (seek.value/100);
	video.currentTime = time;
}, false);

seek.addEventListener('mousedown', function(){
	video.pause();
}, false);

seek.addEventListener('mouseup', function(){
	video.play();
	play.style.display = "none";
	playbutton.classList.remove('icon-play');
	playbutton.classList.add('icon-pause');
}, false);

seek.addEventListener('mousemove', function(e) {
	var tif = document.getElementById('tif');
	var x = e.offsetX;
	floatTipStyle.left = x + 'px';
	buffTime.style.left = x + 36 + 'px';
	floatTipStyle.top =  seek.style.top - 47 + 'px';
	buffTime.style.top =  seek.style.top - 5 + 'px';
	tif.currentTime = tif.duration * (x / seeker.clientWidth);
	tifHours = (tif.duration / 3600) >= 1.0;
	buffTime.innerHTML = formatTime(tif.currentTime, tifHours);
	progressbar.value = seek.value;	
}, false);

seek.addEventListener('mouseover', function(e) {
	floatTipStyle.display = "block";
	buffTime.style.display = "block";
}, false);

seek.addEventListener('mouseout',  function() {
	floatTipStyle.display = "none";
	buffTime.style.display = "none";
}, false);

controls.addEventListener('mouseover', function(e) {
	clearTimeout(timerId);
}, false);

controls.addEventListener('mouseout', function(e) {
	timerId = setTimeout(function() { controls.style.display = 'none'; }, 3000);
}, false);

video.addEventListener("canplay", function() {
	hasHours = (video.duration / 3600) >= 1.0;                    
    duration.innerHTML = (formatTime(video.duration, hasHours));
}, false);

video.addEventListener("timeupdate", function() {
	hasHours = (video.duration / 3600) >= 1.0; 
    currentTime.innerHTML = formatTime(video.currentTime, hasHours);                  
}, false);

video.addEventListener('ended', function(){
	video.pause();
	playbutton.classList.add('icon-play');
	playbutton.classList.remove('icon-pause');
	seek.classList.remove('light');
});

video.addEventListener('mousemove', function(e) {
	clearTimeout(timerId);
	controls.style.display = 'block';
	timerId = setTimeout(function() { controls.style.display = 'none'; }, 3000);
}, false);

video.addEventListener('progress', function() { 
	var percent = (100 / video.duration) * video.buffered.end(0); 
	bufferbar.value = percent;	
}, false);

video.addEventListener('timeupdate', function(){
	var value = (100/video.duration) * video.currentTime;
	seek.value = value;
	progressbar.value = value;
}, false);

video.addEventListener('click', playpause, false);

document.addEventListener("fullscreenchange", changeHandler, false);
document.addEventListener("mozfullscreenchange", changeHandler, false);
document.addEventListener("webkitfullscreenchange", changeHandler, false);
document.addEventListener("msfullscreenchange", changeHandler, false);

play.style.left = (video.clientWidth / 2) - (play.clientWidth / 2)  + 'px';
play.style.top = (video.clientHeight / 2) - (play.clientHeight / 2)  + 'px';	
playbutton.addEventListener('click', playpause, false);
seeker.style.width = controls.clientWidth - 275 + 'px';
video.src = './video/trailer.mp4';
video.load();
var srcBuff = '<video id="tif" src="' + './video/trailer.mp4' + '" width="100%" height="100%" preload></video>';
tooltip.innerHTML = srcBuff;    

function playPause(url)
{ 
    video.src = url;
    video.load();
	var srcBuff = '<video id="tif" src="' + url + '" width="100%" height="100%" preload></video>';
	tooltip.innerHTML = srcBuff;
		playbutton.classList.add('icon-play');
		playbutton.classList.remove('icon-pause');
} 