// Google Maps integration for contact booking page
(function(){
  function initMap(){
    const defaultCenter = {lat:31.6295, lng:-7.9811}; // Marrakesh
    const mapEl = document.getElementById('map');
    if(!mapEl || !window.google) return;

    const map = new google.maps.Map(mapEl, {
      center: defaultCenter,
      zoom: 13,
      disableDefaultUI: false,
      gestureHandling: 'greedy'
    });

    const geocoder = new google.maps.Geocoder();
    let marker = null;

    function setMarker(position){
      if(marker){
        marker.setPosition(position);
      } else {
        marker = new google.maps.Marker({position, map, draggable:true});
        marker.addListener('dragend', ()=>{
          updatePosition(marker.getPosition());
        });
      }
      map.panTo(position);
      updatePosition(position);
    }

    function updatePosition(latLng){
      const lat = latLng.lat();
      const lng = latLng.lng();
      const latInput = document.getElementById('lat');
      const lngInput = document.getElementById('lng');
      const addressInput = document.getElementById('address');
      if(latInput) latInput.value = lat;
      if(lngInput) lngInput.value = lng;

      geocoder.geocode({location: latLng}, (results, status)=>{
        if(status === 'OK' && results[0]){
          if(addressInput) addressInput.value = results[0].formatted_address;
        } else {
          if(addressInput) addressInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
      });
    }

    // click to set
    map.addListener('click', (e)=>{
      setMarker(e.latLng);
    });

    // use device location
    const useBtn = document.getElementById('use-location');
    if(useBtn){
      useBtn.addEventListener('click', ()=>{
        if(navigator.geolocation){
          useBtn.disabled = true;
          navigator.geolocation.getCurrentPosition(pos=>{
            const p = {lat: pos.coords.latitude, lng: pos.coords.longitude};
            setMarker(p);
            useBtn.disabled = false;
          }, err=>{ useBtn.disabled = false; alert('Unable to retrieve location'); });
        } else alert('Geolocation not supported');
      });
    }

    // optional: place initial marker at center
    // setMarker(defaultCenter);
  }

  // init if google is already loaded
  if(window.google && window.google.maps) initMap();
  else {
    // wait for load; Maps API script is expected to be included before this file in contact.html
    window.addEventListener('load', ()=>{
      if(window.google && window.google.maps) initMap();
      else console.warn('Google Maps API not loaded (replace YOUR_API_KEY_HERE in contact.html)');
    });
  }

})();
