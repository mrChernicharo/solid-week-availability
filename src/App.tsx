import { Component, createSignal } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import WeeklyAvailability from "./components/WeeklyAvailability/WeeklyAvailability";

const App: Component = () => {
  const [palette, setPalette] = createSignal("light");
  const [isOpen, setIsOpen] = createSignal(true);

  return (
    <div class={styles.App}>
      <h1>Weekly Availability</h1>

      <WeeklyAvailability
        locale="pt-BR"
        dayCols={["mon", "tue", "wed", "thu", "fri", "sat", "sun"]} // omit days if you want
        firstDay="mon" // first dayColumn
        palette={palette()} // light | dark
        open={isOpen()}
        minHour={7}
        maxHour={21}
        colHeight={800}
        minSnap={30}
        onChange={(val) => console.log(val)}
      />

      <div>
        <div>palette: {palette()}</div>
        <div>open: {isOpen() ? "true" : "false"}</div>
      </div>

      <button
        onClick={(e) => setPalette(palette() === "light" ? "dark" : "light")}
      >
        change palette
      </button>
      <button onClick={(e) => setIsOpen(!isOpen())}>Open</button>
    </div>
  );
};

export default App;
