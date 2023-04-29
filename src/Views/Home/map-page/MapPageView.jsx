import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import moment from 'moment';
import { showError } from 'Helpers';
import { DialogComponent } from 'Components';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import { ThemeContext } from 'Contexts/theme-context';
import markerIcon from '../../../Assets/Images/marker.png';
import teslaLogo from '../../../Assets/Images/tesla-logo.png';
import { GetAllVehicleTelemetriesService, GetVehicleTelemetriesByNameService } from 'Services';
import './MapPageView.scss';

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

/**
 * This component displays a Google Map with custom markers and allows users to click on a marker
 * to get the marker info.
 */
const MapPageView = () => {
  const scriptRef = useRef(null);
  const { t } = useTranslation('Shared');
  const { theme } = useContext(ThemeContext);
  const [themeMode, setThemeMode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const getVehicleTelemetriesByNameService = useCallback(async (name) => {
    setIsLoading(true);
    setIsDialogOpen(true);

    const response = await GetVehicleTelemetriesByNameService({
      key: process.env.React_APP_VEHICLE_TELEMETRIES,
      name,
    });

    if (response && response.status && response.status === 200 && response.data) {
      const { telemetry } = response.data;

      if (telemetry) setActiveItem(telemetry);
    } else {
      showError(
        (response && response.data && response.data.message) || 'Failed to get marker info',
      );
      setActiveItem(null);
      setIsDialogOpen(false);
    }

    setIsLoading(false);
  }, []);

  const getAllVehicleTelemetriesService = useCallback(async () => {
    const response = await GetAllVehicleTelemetriesService({
      key: process.env.React_APP_VEHICLE_TELEMETRIES,
    });

    let script = null;

    if (response && response.status && response.status === 200 && response.data) {
      const { telemetries } = response.data;

      const mapRef = document.getElementById('mapRef');

      if (telemetries && !mapRef && themeMode) {
        // Load the Google Maps API script
        script = document.createElement('script');
        script.setAttribute('id', 'mapRef');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.React_APP_GOOGLE_MAPS_API}&callback=onApiLoad`;
        script.async = true;

        document.body.appendChild(script);

        // Define the `onApiLoad` function globally so the Google Maps API can call it
        window.onApiLoad = () => {
          const newMap = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 25.774966, lng: 55.96579 },
            styles: themeMode === 'dark' ? mapStyles : [],
            zoom: 10,
          });

          if (newMap) {
            const geocoder = new window.google.maps.Geocoder();

            const points = telemetries.map((item) => ({
              name: item.name || '',
              position: item.position || { lat: 0, lng: 0 },
              icon: { url: markerIcon, scaledSize: new window.google.maps.Size(150, 80) },
            }));

            points.map((marker) => {
              const markerObj = new window.google.maps.Marker({
                position: marker.position,
                map: newMap,
                icon: marker.icon,
              });

              markerObj.addListener('click', () => {
                // When a marker is clicked, get its info
                geocoder.geocode({ location: marker.position }, (results, status) => {
                  if (status === 'OK' && results[0]) {
                    getVehicleTelemetriesByNameService(marker.name);
                  }
                });
              });
            });
          }
        };

        scriptRef.current = script;
      }
    } else {
      showError((response && response.data && response.data.message) || 'Failed to get vehicles');

      const mapRef = document.getElementById('mapRef');

      if (script && mapRef) {
        document.body.removeChild(script);
        delete window.onApiLoad;
      }
    }
  }, [themeMode]);

  useEffect(() => {
    getAllVehicleTelemetriesService();
  }, [getAllVehicleTelemetriesService]);

  useEffect(() => {
    if (theme) {
      setThemeMode(theme);

      const mapRef = document.getElementById('mapRef');

      if (scriptRef && scriptRef.current && mapRef) {
        document.body.removeChild(scriptRef.current);
        delete window.onApiLoad;
      }
    }
  }, [theme, scriptRef]);

  useEffect(() => {
    return () => {
      const mapRef = document.getElementById('mapRef');

      if (scriptRef && scriptRef.current && mapRef) {
        document.body.removeChild(scriptRef.current);
        delete window.onApiLoad;
      }
    };
  }, [scriptRef]);

  return (
    <div className='maps-wrapper view-wrapper'>
      <div id='map' className='map-render-wrapper' />

      <DialogComponent
        maxWidth='xs'
        isOpen={isDialogOpen}
        onCloseClicked={handleDialogClose}
        wrapperClasses='selected-marker-dialog-wrapper'
        dialogTitle={(activeItem && activeItem.name) || ''}
        dialogContent={
          <div className='dialog-content'>
            {activeItem && !isLoading ? (
              <>
                <div className='car-logo-wrapper'>
                  <img src={teslaLogo} alt='tesla car' />
                </div>

                <div className='marker-info-wrapper'>
                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> {t('name')}:
                    </div>
                    <div className='car-name'>{activeItem.name || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> {t('engine-status')}:
                    </div>
                    <div className='car-name'>{activeItem.engineStatus || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> {t('odometer')}:
                    </div>
                    <div className='car-name'>{activeItem.odometer || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> {t('plate-no')}:
                    </div>
                    <div className='car-name'>{activeItem.plateNo || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> {t('power-supply-voltage')}:
                    </div>
                    <div className='car-name'>{activeItem.powerSupplyVoltage || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> {t('speed')}:
                    </div>
                    <div className='car-name'>{activeItem.speed || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> {t('time')}:
                    </div>
                    <div className='car-name'>
                      {moment(activeItem.timestamp).format('ddd, MMM DD, h:mm A') || 'N/A'}
                    </div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> {t('vin')}:
                    </div>
                    <div className='car-name'>{activeItem.vin || 'N/A'}</div>
                  </div>
                </div>
              </>
            ) : (
              <CircularProgress />
            )}
          </div>
        }
      />
    </div>
  );
};

export default MapPageView;
