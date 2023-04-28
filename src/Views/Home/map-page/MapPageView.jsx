import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { showError } from 'Helpers';
import { DialogComponent } from 'Components';
import { CircularProgress } from '@mui/material';
import markerIcon from '../../../Assets/Images/marker.png';
import teslaLogo from '../../../Assets/Images/tesla-logo.png';
import { GetAllVehicleTelemetriesService, GetVehicleTelemetriesByNameService } from 'Services';
import './MapPageView.scss';

/**
 * This component displays a Google Map with custom markers and allows users to click on a marker
 * to get the marker info.
 */
const MapPageView = () => {
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

      if (telemetries) {
        // Load the Google Maps API script
        script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.React_APP_GOOGLE_MAPS_API}&callback=onApiLoad`;
        script.async = true;

        document.body.appendChild(script);

        // Define the `onApiLoad` function globally so the Google Maps API can call it
        window.onApiLoad = () => {
          const newMap = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 25.774966, lng: 55.96579 },
            zoom: 10,
          });

          if (newMap) {
            const geocoder = new window.google.maps.Geocoder();

            const points = telemetries.map((item) => ({
              name: item.name || '',
              position: item.position || { lat: 0, lng: 0 },
              icon: { url: markerIcon, scaledSize: new window.google.maps.Size(150, 90) },
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
      }
    } else {
      showError((response && response.data) || 'Failed to get vehicles');
      document.body.removeChild(script);
      delete window.onApiLoad;
    }
  }, []);

  useEffect(() => {
    getAllVehicleTelemetriesService();
  }, [getAllVehicleTelemetriesService]);

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
                      <span className='mdi mdi-circle mr-2' /> Name:
                    </div>
                    <div className='car-name'>{activeItem.name || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> Engine Status:
                    </div>
                    <div className='car-name'>{activeItem.engineStatus || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> Odometer:
                    </div>
                    <div className='car-name'>{activeItem.odometer || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> PlateNo:
                    </div>
                    <div className='car-name'>{activeItem.plateNo || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> Power Voltage:
                    </div>
                    <div className='car-name'>{activeItem.powerSupplyVoltage || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> Speed:
                    </div>
                    <div className='car-name'>{activeItem.speed || 'N/A'}</div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> Time:
                    </div>
                    <div className='car-name'>
                      {moment(activeItem.timestamp).format('ddd, MMM DD, h:mm A') || 'N/A'}
                    </div>
                  </div>

                  <div className='info-wrapper'>
                    <div className='item-label mr-2'>
                      <span className='mdi mdi-circle mr-2' /> VIN:
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
