import React, { useState } from 'react';
import queryString from 'query-string';
import App from '../components/App';

const BASE_URL = 'https://tidesandcurrents.noaa.gov/api/datagetter';

const AppContainer: React.ComponentType = () => {
  const [stationValue, setStationValue] = useState('');
  const [station, setStation] = useState('');
  const [tideData, setTideData] = useState([]);
  const onStationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStationValue(e.target.value);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStation(stationValue);
    const res = await fetch(
      `${BASE_URL}?date=today&station=9410170&product=predictions&interval=hilo&units=english&datum=STND&time_zone=lst&format=json`
    );
    const json = await res.json();
    console.log('JSON: ', json);
    setTideData(json.predictions);
  };

  return (
    <App
      onStationChange={onStationChange}
      stationValue={stationValue}
      onSubmit={onSubmit}
      tideData={tideData}
    />
  );
};

export default AppContainer;
