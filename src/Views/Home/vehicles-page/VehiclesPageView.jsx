import React, { useCallback, useEffect, useState } from 'react';
import { showError } from 'Helpers';
import { Inputs, TablesComponent } from 'Components';
import { GetAllVehicleTelemetriesService } from 'Services';
import './VehiclesPageView.scss';

const VehiclesPageView = () => {
  const [timer, setTimer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [localSearchValue, setLocalSearchValue] = useState('');
  const [filter, setFilter] = useState({
    query: '',
    page: 0,
    pageSize: 10,
  });

  const onPageIndexChanged = (event, newIndex) => {
    setFilter((items) => ({ ...items, page: +newIndex }));
  };

  const onPageSizeChanged = (event) => {
    const { value } = event.target;

    setFilter((items) => ({ ...items, pageSize: +value }));
    setFilter((items) => ({ ...items, page: 0 }));
  };

  const getAllVehicleTelemetriesService = useCallback(async () => {
    const response = await GetAllVehicleTelemetriesService({
      key: process.env.React_APP_VEHICLE_TELEMETRIES,
    });
    if (response && response.status && response.status === 200 && response.data) {
      const { telemetries } = response.data;

      if (telemetries) setVehicles(telemetries);
    } else {
      showError((response && response.data) || 'Failed to get vehicles');
    }
  }, []);

  useEffect(() => {
    getAllVehicleTelemetriesService();
  }, [getAllVehicleTelemetriesService]);

  return (
    <div className='vehicles-wrapper view-wrapper'>
      <Inputs
        inputPlaceholder='Search'
        value={localSearchValue}
        idRef='vehiclesSearchInputId'
        wrapperClasses='search-wrapper'
        startAdornment={<span className='mdi mdi-magnify' />}
        onInputChanged={(event) => {
          const { value } = event.target;
          setLocalSearchValue(value);

          clearTimeout(timer);
          const newTimer = setTimeout(() => {
            setFilter((items) => ({ ...items, query: value, page: 0 }));
          }, 500);
          setTimer(newTimer);
        }}
      />

      <TablesComponent
        headerData={[
          {
            id: 1,
            label: 'Name',
            input: 'name',
            isSortable: true,
          },
          {
            id: 2,
            label: 'PlateNo',
            input: 'plateNo',
            isSortable: true,
          },
          {
            id: 3,
            label: 'Speed',
            input: 'speed',
            isSortable: true,
          },
          {
            id: 4,
            label: 'Time',
            input: 'timestamp',
            isDate: true,
            isSortable: true,
          },
          {
            id: 5,
            label: 'Power Supply Voltage',
            input: 'powerSupplyVoltage',
            isSortable: true,
          },
          {
            id: 6,
            label: 'Engine Status',
            input: 'engineStatus',
            isSortable: true,
          },
        ]}
        pageIndex={filter.page || 0}
        pageSize={filter.pageSize || 0}
        onPageSizeChanged={onPageSizeChanged}
        onPageIndexChanged={onPageIndexChanged}
        data={
          (vehicles && filter.query
            ? vehicles.filter((item) =>
                item.name.toLowerCase().includes(filter.query.toLowerCase()),
              )
            : vehicles) || []
        }
        totalItems={(vehicles && vehicles.length) || 0}
      />
    </div>
  );
};

export default VehiclesPageView;
