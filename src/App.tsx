import { Component, createSignal } from "solid-js";

import WeeklyAvailability from "./components/WeeklyAvailability/WeeklyAvailability";

const App: Component = () => {
  const [palette, setPalette] = createSignal("light");
  const [isOpen, setIsOpen] = createSignal(true);

  return (
    <div>
      <h1>Weekly Availability</h1>

      <div>
        <div>palette: {palette()}</div>
        <div>open: {isOpen() ? "true" : "false"}</div>
      </div>

      <button
        onClick={(e) => setPalette(palette() === "light" ? "dark" : "light")}
      >
        change palette
      </button>
      <button onClick={(e) => setIsOpen(!isOpen())}>
        {isOpen() ? "Close" : "Open"}
      </button>

      <WeeklyAvailability
        locale="pt-BR"
        dayCols={["mon", "tue", "wed", "thu", "fri", "sat", "sun"]} // omit days if you want
        firstDay="sat" // first dayColumn
        palette={palette()} // light | dark
        open={isOpen()}
        minHour={7}
        maxHour={21}
        colHeight={800}
        headerHeight={40}
        colMinWidth={120}
        minSnap={30}
        onChange={(val) => console.log(val)}
      />
    </div>
  );
};

export default App;
