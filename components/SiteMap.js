// import React from "react";
// import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

// const containerStyle = {
//   width: "100%",
//   height: "500px",
//   marginTop: "40px",
//   marginBottom: "-10px",
// };

// const center = {
//   lat: -3.745,
//   lng: -38.523,
// };

// function SiteMap() {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//   });

//   const [map, setMap] = React.useState(null);

//   const onLoad = React.useCallback(function callback(map) {
//     // This is just an example of getting and using the map instance!!! don't just blindly copy!
//     const bounds = new window.google.maps.LatLngBounds(center);
//     map.fitBounds(bounds);

//     setMap(map);
//   }, []);

//   const onUnmount = React.useCallback(function callback(map) {
//     setMap(null);
//   }, []);

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={10}
//       onLoad={onLoad}
//       onUnmount={onUnmount}
//     >
//       {/* Child components, such as markers, info windows, etc. */}
//       <></>
//     </GoogleMap>
//   ) : (
//     <></>
//   );
// }

// export default React.memo(SiteMap

const SiteMap = () => {
  return (
    <>
      <iframe
        title="halalkababncurry"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12234.156326159311!2d-75.2663067!3d39.9516985!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c140b29df945%3A0x4d27b2a0eefb5ced!2sHalal%20Kabab%20%26%20Curry!5e0!3m2!1sen!2sbd!4v1697612139222!5m2!1sen!2sbd"
        className="map-frame"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </>
  );
};

export default SiteMap;
