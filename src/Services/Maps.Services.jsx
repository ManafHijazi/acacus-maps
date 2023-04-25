import { HttpServices } from '../Helpers';

export const GetAllVehicleTelemetriesService = async ({ key }) => {
  const result = await HttpServices.get(
    `http://localhost:9000/api/VehicleTelemetries/All?key=${key}`,
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

export const GetVehicleTelemetriesByNameService = async ({ key, name }) => {
  const result = await HttpServices.get(
    `http://localhost:9000/api/VehicleTelemetries/Single?key=${key}&name=${name}`,
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};
