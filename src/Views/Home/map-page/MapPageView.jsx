import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { showError } from 'Helpers';
import { DialogComponent } from 'Components';
import teslaLogo from '../../../Assets/Images/tesla-logo.png';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { GetAllVehicleTelemetriesService, GetVehicleTelemetriesByNameService } from 'Services';
import './MapPageView.scss';

const MapPageView = ({ google }) => {
  const [points, setPoints] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const getAllVehicleTelemetriesService = useCallback(async () => {
    const response = await GetAllVehicleTelemetriesService({
      key: process.env.React_APP_VEHICLE_TELEMETRIES,
    });
    if (response && response.status && response.status === 200 && response.data) {
      const { telemetries } = response.data;

      if (telemetries) {
        const points = telemetries.map((item) => ({
          lat: item.position.lat || 0,
          lng: item.position.lng || 0,
          name: item.name || '',
        }));

        setPoints(points);
        setCenter(points[0]);
      }
    } else {
      showError((response && response.data) || 'Failed to get vehicles');
    }
  }, []);

  const getVehicleTelemetriesByNameService = useCallback(async (name) => {
    const response = await GetVehicleTelemetriesByNameService({
      key: process.env.React_APP_VEHICLE_TELEMETRIES,
      name,
    });
    if (response && response.status && response.status === 200 && response.data) {
      const { telemetry } = response.data;

      if (telemetry) {
        setActiveItem(telemetry);
        setIsDialogOpen(true);
      }
    } else {
      showError((response && response.data) || 'Failed to get marker info');
      setActiveItem(null);
      setIsDialogOpen(false);
    }
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const containerStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  };

  useEffect(() => {
    getAllVehicleTelemetriesService();
  }, [getAllVehicleTelemetriesService]);

  return (
    <div className='maps-wrapper view-wrapper'>
      <Map zoom={10} google={google} center={center} containerStyle={containerStyle}>
        {points &&
          points.length > 0 &&
          points.map((point, index) => (
            <Marker
              position={point}
              name={point.name}
              title={point.name}
              key={`map-marker-${index + 1}`}
              onClick={() => getVehicleTelemetriesByNameService(point.name)}
            />
          ))}
      </Map>

      <DialogComponent
        maxWidth='xs'
        isOpen={isDialogOpen}
        onCloseClicked={handleDialogClose}
        wrapperClasses='selected-marker-dialog-wrapper'
        dialogTitle={(activeItem && activeItem.name) || ''}
        dialogContent={
          <div className='dialog-content'>
            {activeItem && (
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
            )}
          </div>
        }
      />
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.React_APP_GOOGLE_MAPS_API,
})(MapPageView);
