import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

const MapComponent = ({ locations, selectedActivity }) => {
  const [placeDetails, setPlaceDetails] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(loc => {
        bounds.extend(new window.google.maps.LatLng(loc.location.lat, loc.location.lng));
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [locations]);

  useEffect(() => {
    if (selectedActivity && mapRef.current) {
      mapRef.current.panTo(selectedActivity.location);
      mapRef.current.setZoom(15);

      const service = new window.google.maps.places.PlacesService(mapRef.current);
      const request = {
        placeId: selectedActivity.placeId,
        fields: ['name', 'formatted_address', 'place_id', 'geometry']
      };

      service.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaceDetails({
            name: place.name,
            address: place.formatted_address,
            placeId: place.place_id,
            location: place.geometry.location
          });
        } else {
          console.error(`Failed to get details for place ID ${selectedActivity.placeId}: ${status}`);
        }
      });
    }
  }, [selectedActivity]);

  const handleClick = (poi) => {
    console.log('Marker clicked:', poi);
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      placeId: poi.placeId,
      fields: ['name', 'formatted_address', 'place_id', 'geometry']
    };

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log('Place details:', place);
        setPlaceDetails({
          name: place.name,
          address: place.formatted_address,
          placeId: place.place_id,
          location: place.geometry.location
        });

        if (mapRef.current) {
          mapRef.current.panTo(place.geometry.location);
          mapRef.current.setZoom(15); // Adjust zoom level as needed
        }
      } else {
        console.error(`Failed to get details for place ID ${poi.placeId}: ${status}`);
      }
    });
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: 37.5665,
    lng: 126.9780,
  };

  return (
    <APIProvider apiKey={'AIzaSyCSE_TMMsKRwr3TsvuwBbJEiwojEL1XF4A'} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={10}
        defaultCenter={center}
        mapId='7567f4f2e6490e41'
        onLoad={map => (mapRef.current = map)}
        containerStyle={containerStyle}
      >
        {locations.map((poi) => (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}
            clickable={true}
            gmpClickable={true}
            onClick={() => handleClick(poi)}
          >
            <Pin background={'#ec1111'} glyphColor={'#ffffff'} borderColor={'#ffffff'} />
          </AdvancedMarker>
        ))}
        {placeDetails && (
          <InfoWindow
            position={placeDetails.location}
            onCloseClick={() => setPlaceDetails(null)}
          >
            <div>
              <h3>{placeDetails.name}</h3>
              <p>{placeDetails.address}</p>
              <p>{placeDetails.placeId}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
