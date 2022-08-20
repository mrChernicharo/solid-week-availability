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
        locale="pt-BR"
        // locale="pt-BR"
        dayCols={["mon", "tue", "wed", "thu", "fri", "sat", "sun"]}
        // dayCols={["Mon", "Tue", "Wed", "Thu", "Fri"]} // omit days if you want, order doesn't matter, repeated items don't matter
        firstDay="Mon" // first dayColumn
        palette={palette()} // light | dark
        open={isOpen()}
        minHour={7}
        // maxHour={12}
        // minHour={12}
        // maxHour={9}
        // maxHour={2}
        maxHour={24}
        // maxHour={24}
        widgetHeight={520}
        // widgetHeight={840}
        headerHeight={50}
        // headerHeight={40}
        colHeight={400}
        colMinWidth={160}
        minSnap={30}
        // onChange={(val) => console.log(val)}
      />
    </div>
  );
};

export default App;
