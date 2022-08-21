import { Component, createEffect, createSignal, For } from "solid-js";

import WeeklyAvailability from "./components/WeeklyAvailability/WeeklyAvailability";
import { DAY_NAMES } from "./lib/constants";

const App: Component = () => {
  const [isOpen, setIsOpen] = createSignal(true);

  const [palette, setPalette] = createSignal("light");
  const [colHeight, setColHeight] = createSignal(800);
  const [colWidth, setColWidth] = createSignal(120);
  const [widgetHeight, setWidgetHeight] = createSignal(420);
  const [headerHeight, setHeaderHeight] = createSignal(50);
  const [firstDay, setFirstDay] = createSignal("Mon");
  const [minHour, setMinHour] = createSignal(0);
  const [endHour, setEndHour] = createSignal(24);
  const [cols, setCols] = createSignal(DAY_NAMES);
  const [locale, setLocale] = createSignal("en");

  // createEffect(() => {
  // });

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
          data-cy="palette_btn"
        >
          change palette
        </button>
        <button onClick={(e) => setIsOpen(!isOpen())} data-cy="open_btn">
          {isOpen() ? "Close" : "Open"}
        </button>

        <div>
          <label for="locale">locale</label>
          <select id="locale" onInput={(e) => setLocale(e.currentTarget.value)}>
            <For each={["en", "pt-BR", "de", "jpn"]}>
              {(locale) => <option>{locale}</option>}
            </For>
          </select>

          <label for="first_day">first_day</label>
          <select
            id="first_day"
            onInput={(e) => setFirstDay(e.currentTarget.value)}
          >
            <For each={DAY_NAMES}>{(day) => <option>{day}</option>}</For>
          </select>
        </div>
        <div>
          <For each={DAY_NAMES}>
            {(day, i) => (
              <>
                <input
                  id={`col_checkbox_${day}`}
                  type="checkbox"
                  checked={cols().indexOf(day) !== -1}
                  onchange={(e) => {
                    let newCols = [...cols()];
                    let dayIdx = cols().indexOf(day);
                    if (dayIdx === -1) {
                      setCols([...newCols, day]);
                    }
                    if (dayIdx >= 0) {
                      newCols.splice(dayIdx, 1);
                      setCols(newCols);
                    }
                  }}
                />
                <label for={`col_checkbox_${day}`}>{day}</label>
              </>
            )}
          </For>
        </div>

        <label for="start_hour">Start Hour</label>
        <input
          id="start_hour"
          type="number"
          value={minHour()}
          onInput={(e) => {
            setMinHour(+e.currentTarget.value);
          }}
        />

        <label for="end_hour">End Hour</label>
        <input
          id="end_hour"
          type="number"
          value={endHour()}
          onInput={(e) => setEndHour(+e.currentTarget.value)}
        />

        <div>
          <label for="col_height">col_height</label>
          <input
            id="col_height"
            type="number"
            value={colHeight()}
            onInput={(e) => setColHeight(+e.currentTarget.value)}
          />

          <label for="widget_height">widget_height</label>
          <input
            id="widget_height"
            type="number"
            value={widgetHeight()}
            onInput={(e) => setWidgetHeight(+e.currentTarget.value)}
          />

          <label for="header_height">header_height</label>
          <input
            id="header_height"
            type="number"
            value={headerHeight()}
            onInput={(e) => setHeaderHeight(+e.currentTarget.value)}
          />

          <label for="col_width">col_width</label>
          <input
            id="col_width"
            type="number"
            value={colWidth()}
            onInput={(e) => setColWidth(+e.currentTarget.value)}
          />
        </div>
      </div>

      <WeeklyAvailability
        locale={locale()}
        // locale="pt-BR"
        dayCols={cols()} // omit days if you want, order doesn't matter, repeated items don't matter
        // dayCols={["Mon", "Tue", "Wed", "Thu", "Fri"]}
        firstDay={firstDay()} // first dayColumn
        palette={palette()} // light | dark
        open={isOpen()}
        minHour={minHour()}
        maxHour={endHour()}
        widgetHeight={widgetHeight()}
        headerHeight={headerHeight()}
        colHeight={colHeight()}
        colMinWidth={colWidth()}
        minSnap={30}
        // onChange={(val) => console.log(val)}
      />
    </div>
  );
};

export default App;
