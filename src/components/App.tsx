import React from 'react';
import { Ripple } from 'hang-tight-react';
import './App.css';

interface TideEntry {
  t: string;
  v: string;
  type: string;
}

interface Metadata {
  id: string;
  name: string;
  lat: string;
  lon: string;
}

interface TempData {
  t: string;
  v: string;
  f: string;
}

interface WaterTemp {
  metadata: Metadata;
  data: TempData[];
}

interface Props {
  stationValue: string;
  onStationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  tideData: TideEntry[];
  error?: string;
  temperatureData?: WaterTemp;
  lastRequestAt?: string;
  loading: boolean;
}

interface TideDateData {
  level: string;
  type: string;
}

interface DateData {
  [key: string]: TideDateData;
}

interface DataByDate {
  [key: string]: DateData;
}

const get12HourTime = (t: string) => {
  const [hours, mins] = t.split(':');
  const convertedHours = ((parseInt(hours) + 1) % 12) + 1;
  const amPm = convertedHours > 11 ? 'pm' : 'am';
  return `${hours}:${mins}${amPm}`;
};

const App: React.ComponentType<Props> = ({
  onStationChange,
  stationValue,
  onSubmit,
  tideData,
  error,
  temperatureData,
  lastRequestAt,
  loading,
}) => {
  const tideDataByDate =
    !!tideData &&
    !!tideData.length &&
    tideData.reduce((dataByDate: DataByDate, { t, v, type }) => {
      const [date, time] = t.split(' ');
      dataByDate[date] = dataByDate[date] || {};
      dataByDate[date][time] = { level: v, type };
      return dataByDate;
    }, {});

  return (
    <main>
      <h1>
        <span>Tide</span> <span>Info</span>
      </h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="station">Station</label>
        <input
          type="text"
          onChange={onStationChange}
          id="station"
          value={stationValue}
        />
        <button type="submit">Submit</button>
      </form>
      {loading ? (
        <Ripple aria-label="Fetching tide data..." />
      ) : (
        <div className="Result">
          {!!temperatureData && temperatureData.metadata && (
            <>
              <h2>{temperatureData.metadata.name}</h2>
              <p>Water temperature: {temperatureData.data[0].v}</p>
            </>
          )}
          {tideDataByDate && (
            <ul className="Result__list">
              {Object.entries(tideDataByDate).map(([date, data]) => {
                const d = new Date(date);
                return (
                  <li key={date}>
                    <div>
                      {d.getMonth()}-{d.getDate()}-{d.getFullYear()}
                    </div>
                    <ul>
                      {Object.entries(data).map(([time, tideInfo]) => (
                        <li key={`${date}${time}`}>
                          {tideInfo.type === 'H' ? 'High' : 'Low'}:{' '}
                          {get12HourTime(time)} ({tideInfo.level})
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
          {error && <p>Error: {error}</p>}
          {lastRequestAt && <em>Last request made: {lastRequestAt}</em>}
        </div>
      )}
    </main>
  );
};

export default App;
