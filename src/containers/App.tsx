import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import App from '../components/App';

const zeroIfy = (n: number) => (`${n}`.length === 2 ? n : `0${n}`);
const BASE_URL = 'https://tidesandcurrents.noaa.gov/api/datagetter';
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

const getCachedTideData = () => {
  const tideData = JSON.parse(localStorage.getItem('tideinfo') || '{}');
  return tideData.error ? {} : tideData;
};

// TODO: add "tide data last requested on {TIME_STAMP}"
const AppContainer: React.ComponentType = () => {
  const cachedTideData = getCachedTideData();
  const [stationValue, setStationValue] = useState(
    cachedTideData.station || tideParams.station
  );
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [tideData, setTideData] = useState(cachedTideData.predictions || []);
  const [lastRequestAt, setLastRequestAt] = useState(
    cachedTideData.lastRequestAt || null
  );
  const [temperatureData, setTemperatureData] = useState(
    cachedTideData.temperatureData || null
  );

  const onStationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStationValue(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    const date = `${new Date()}`;
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
    setLastRequestAt(date);

    // fetch the water temperature data
    const waterTempRes = await fetch(
      `${BASE_URL}?${queryString.stringify({
        ...tempParams,
        station: stationValue,
      })}`
    );
    const tempData = await waterTempRes.json();

    setTemperatureData(tempData);
    setLoading(false);

    localStorage.setItem(
      'tideinfo',
      JSON.stringify({
        station: stationValue,
        predictions: tideData.predictions,
        error,
        temperatureData: tempData,
        lastRequestAt: date,
      })
    );
  };

  return (
    <App
      onStationChange={onStationChange}
      stationValue={stationValue}
      onSubmit={onSubmit}
      tideData={tideData}
      error={error}
      temperatureData={!error && temperatureData}
      lastRequestAt={lastRequestAt}
      loading={loading}
    />
  );
};

export default AppContainer;
