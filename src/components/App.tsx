import React from 'react';

interface TideEntry {
  t: string;
  v: string;
  type: string;
}

interface Props {
  stationValue: string;
  onStationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  tideData: TideEntry[];
}

const App: React.ComponentType<Props> = ({
  onStationChange,
  stationValue,
  onSubmit,
  tideData,
}) => (
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
    {!!tideData.length && (
      <ul>
        {tideData.map((data) => (
          <li key={data.t}>
            {data.t} / {data.v} / {data.type}
          </li>
        ))}
      </ul>
    )}
  </main>
);

export default App;
