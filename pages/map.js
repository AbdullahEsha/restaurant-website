import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Store } from '../helpers/Store'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'
import { toast, ToastContainer } from 'react-toastify'
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api'
import { getError } from '../helpers/error'

const defaultLocation = { lat: 45.516, lng: -73.56 }
const libs = ['places']

function Map() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const [googleApiKey, setGoogleApiKey] = useState('')
  const [center, setCenter] = useState(defaultLocation)
  const [location, setLocation] = useState(center)

  // Get User Current Location
  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        const { data } = await axios('/api/keys/google', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        setGoogleApiKey(data)
        getUserCurrentLocation()
      } catch (err) {
        toast.error(`${getError(err)}`)
      }
    }
    fetchGoogleApiKey()
  }, [])

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser')
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }

  const mapRef = useRef(null)
  const placeRef = useRef(null)
  const markerRef = useRef(null)

  const onLoad = (map) => {
    mapRef.current = map
  }

  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    })
  }

  const onLoadPlaces = (place) => {
    placeRef.current = place
  }

  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location
    setCenter({ lat: place.lat(), lng: place.lng() })
    setLocation({ lat: place.lat(), lng: place.lng() })
  }

  const onConfirm = () => {
    const places = placeRef.current.getPlaces()
    if (places && places.length === 1) {
      dispatch({
        type: 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION',
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      })
      toast.error('Location selected successfully')
      router.push('/shipping')
    }
  }

  const onMarkerLoad = (marker) => {
    markerRef.current = marker
  }

  return googleApiKey ? (
    <>
      <Head>
        <title>
          Halal Kabab & Curry | Food Delivery and Takeout | Order Online
        </title>
        <meta
          name="description"
          content="We deliver your takeouts or essential groceries from the best-rated local partners straight to your door. Download our app or order online. Food. We Get It."
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ToastContainer />
      <main>
        <div style={{ height: '100vh' }}>
          <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
            <GoogleMap
              id="sample-map"
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={center}
              zoom={15}
              onLoad={onLoad}
              onIdle={onIdle}
            >
              <StandaloneSearchBox
                onLoad={onLoadPlaces}
                onPlacesChanged={onPlacesChanged}
              >
                <div className="mapInputBox">
                  <input type="text" placeholder="Enter your address"></input>
                  <button
                    type="button"
                    className="addTOCart__btn"
                    onClick={onConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </StandaloneSearchBox>
              <Marker position={location} onLoad={onMarkerLoad}></Marker>
            </GoogleMap>
          </LoadScript>
        </div>
      </main>
    </>
  ) : (
    <CircularProgress />
  )
}

export default dynamic(() => Promise.resolve(Map), { ssr: false })
