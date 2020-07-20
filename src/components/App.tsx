import React from 'react';

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
      {!!temperatureData && (
        <>
          <h2>{temperatureData.metadata.name}</h2>
          <p>Water temperature: {temperatureData.data[0].v}</p>
        </>
      )}
      {tideDataByDate && (
        <ul>
          {Object.entries(tideDataByDate).map(([date, data]) => {
            return (
              <li key={date}>
                <div>{date}</div>
                <ul>
                  {Object.entries(data).map(([time, tideInfo]) => (
                    <li key={`${date}${time}`}>
                      <div>{tideInfo.type === 'H' ? 'High' : 'Low'}</div>
                      <div>{get12HourTime(time)}</div>
                      <div>{tideInfo.level}</div>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p>Some shit went wrong: {error}</p>}
    </main>
  );
};

export default App;
