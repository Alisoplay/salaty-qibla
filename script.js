const MAKKAH = {
  lat: 21.4225,
  lon: 39.8262
};

function toRad(x){
  return x*Math.PI/180;
}

function toDeg(x){
  return x*180/Math.PI;
}

function qiblaDirection(lat,lon){

  const lat1=toRad(lat);
  const lon1=toRad(lon);

  const lat2=toRad(MAKKAH.lat);
  const lon2=toRad(MAKKAH.lon);

  const dLon=lon2-lon1;

  const y=Math.sin(dLon);

  const x=Math.cos(lat1)*Math.tan(lat2)-Math.sin(lat1)*Math.cos(dLon);

  let brng=toDeg(Math.atan2(y,x));

  return (brng+360)%360;
}

function distance(lat1,lon1,lat2,lon2){

 const R=6371;

 const dLat=toRad(lat2-lat1);
 const dLon=toRad(lon2-lon1);

 const a=
 Math.sin(dLat/2)*Math.sin(dLat/2)+
 Math.cos(toRad(lat1))*
 Math.cos(toRad(lat2))*
 Math.sin(dLon/2)*
 Math.sin(dLon/2);

 const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

 return Math.round(R*c);
}

navigator.geolocation.getCurrentPosition(function(pos){

 const lat=pos.coords.latitude;
 const lon=pos.coords.longitude;

 const qibla=qiblaDirection(lat,lon);

 document.getElementById("distance").innerHTML=
 distance(lat,lon,MAKKAH.lat,MAKKAH.lon)+" km إلى مكة";

 fetch("https://api-bdc.net/data/reverse-geocode-client?latitude="+lat+"&longitude="+lon+"&localityLanguage=en")
 .then(r=>r.json())
 .then(data=>{
   document.getElementById("city").innerHTML=data.city||data.locality||"Unknown";
 });

 window.addEventListener("deviceorientation",function(e){

   if(e.alpha==null)return;

   const angle=qibla-e.alpha;

   document.getElementById("arrow").style.transform=
   "translate(-50%,-85%) rotate("+angle+"deg)";
 });

},function(){

 document.getElementById("status").innerHTML="Location Permission Required";

});
