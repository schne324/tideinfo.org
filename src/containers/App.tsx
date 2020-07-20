import React, { useState } from 'react';
import queryString from 'query-string';
import App from '../components/App';

const BASE_URL = 'https://tidesandcurrents.noaa.gov/api/datagetter';
const zeroIfy = (n: number) => (`${n}`.length === 2 ? n : `0${n}`);
const d = new Date();
const tomorrow = new Date(d);
tomorrow.setDate(tomorrow.getDate() + 1);
const defaultParams = {
  station: '9410170', // San Diego Bay
  datum: 'MLLW',
  units: 'english',
  time_zone: 'LST_LDT',
  format: 'json',
};
const tideParams = {
  ...defaultParams,
  product: 'predictions',
  format: 'json',
  application: 'tideinfo', // NOS.COOPS.TAC.COOPSMAP
  interval: 'hilo',
  begin_date: `${d.getFullYear()}${zeroIfy(d.getMonth())}${zeroIfy(
    d.getDate()
  )}`,
  end_date: `${tomorrow.getFullYear()}${zeroIfy(tomorrow.getMonth())}${zeroIfy(
    tomorrow.getDate()
  )}`,
};
const tempParams = {
  ...defaultParams,
  station: '9410170',
  date: 'latest',
  product: 'water_temperature',
  application: 'tideinfo',
  interval: '',
};

const AppContainer: React.ComponentType = () => {
  const [stationValue, setStationValue] = useState(tideParams.station);
  const [error, setError] = useState();
  const [tideData, setTideData] = useState([]);
  const [temperatureData, setTemperatureData] = useState();
  const onStationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStationValue(e.target.value);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // fetch the tide data
    const tideRes = await fetch(
      `${BASE_URL}?${queryString.stringify({
        ...tideParams,
        station: stationValue,
      })}`
    );
    const tideData = await tideRes.json();
    setTideData(tideData.predictions);
    setError(tideData.error ? tideData.error.message : '');

    // fetch the water temperature data
    const waterTempRes = await fetch(
      `${BASE_URL}?${queryString.stringify({
        ...tempParams,
        station: stationValue,
      })}`
    );
    setTemperatureData(await waterTempRes.json());
  };
  console.log({ temperatureData });
  return (
    <App
      onStationChange={onStationChange}
      stationValue={stationValue}
      onSubmit={onSubmit}
      tideData={tideData}
      error={error}
      temperatureData={temperatureData}
    />
  );
};

export default AppContainer;
