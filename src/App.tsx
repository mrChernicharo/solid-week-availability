import { Component, createSignal } from "solid-js";

import WeeklyAvailability from "./components/WeeklyAvailability/WeeklyAvailability";

const App: Component = () => {
  const [palette, setPalette] = createSignal("light");
  const [isOpen, setIsOpen] = createSignal(true);

  return (
    <div>
      <div style={{ "text-align": "center" }}>
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
      </div>

      <WeeklyAvailability
        locale="en"
        // locale="pt-BR"
        dayCols={["mon", "tue", "wed", "thu", "fri", "sat", "sun"]} // omit days if you want
        firstDay="mon" // first dayColumn
        palette={palette()} // light | dark
        open={isOpen()}
        minHour={7}
        maxHour={21}
        // minHour={0}
        // maxHour={23}
        widgetHeight={420}
        // widgetHeight={840}
        headerHeight={40}
        colHeight={800}
        colMinWidth={120}
        minSnap={30}
        onChange={(val) => console.log(val)}
      />
    </div>
  );
};

export default App;
