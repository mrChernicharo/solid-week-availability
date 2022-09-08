import { Component, createEffect, createSignal, For } from "solid-js";

import WeeklyAvailability from "./components/WeeklyAvailability/WeeklyAvailability";
import { WEEKDAYS } from "./lib/constants";
import { IPalette, IWeekday } from "./lib/types";

const App: Component = () => {
  const [isOpen, setIsOpen] = createSignal(true);

  const [palette, setPalette] = createSignal<IPalette>("dark");
  const [colHeight, setColHeight] = createSignal(800);
  const [colWidth, setColWidth] = createSignal(120);
  const [widgetHeight, setWidgetHeight] = createSignal(420);
  const [headerHeight, setHeaderHeight] = createSignal(50);
  const [firstDay, setFirstDay] = createSignal<IWeekday>("Mon");
  const [minHour, setMinHour] = createSignal(6);
  const [endHour, setEndHour] = createSignal(16);
  const [cols, setCols] = createSignal(WEEKDAYS);
  const [locale, setLocale] = createSignal("pt-BR");

  const [value, setValue] = createSignal({});

  // createEffect(() => {
  // });

  return (
    <main>
      <section class="controls" style={{ "text-align": "center" }}>
        <h1>Weekly Availability</h1>

        <div>
          <div>
            <button data-cy="palette_btn" onClick={(e) => setPalette(palette() === "light" ? "dark" : "light")}>
              {palette() === "light" ? "Dark" : "Light"} mode
            </button>
            palette: {palette()}
          </div>
          <div>
            <button data-cy="open_btn" onClick={(e) => setIsOpen(!isOpen())}>
              {isOpen() ? "Close" : "Open"}
            </button>
            open: {isOpen() ? "true" : "false"}
          </div>
        </div>

        <div>
          <label for="locale">locale</label>
          <select id="locale" value={locale()} onChange={(e) => setLocale(e.currentTarget.value)}>
            <For each={["en", "pt-BR", "de", "it", "fr", "jpn"]}>{(locale) => <option>{locale}</option>}</For>
          </select>

          <label for="first_day">first_day</label>
          <select id="first_day" value={firstDay()} onChange={(e) => setFirstDay(e.currentTarget.value as IWeekday)}>
            <For each={WEEKDAYS}>{(day) => <option>{day}</option>}</For>
          </select>
        </div>

        <div>
          <For each={WEEKDAYS}>
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
          style={{ width: "60px" }}
          value={minHour()}
          onChange={(e) => {
            setMinHour(+e.currentTarget.value);
          }}
        />

        <label for="end_hour">End Hour</label>
        <input
          id="end_hour"
          type="number"
          style={{ width: "60px" }}
          value={endHour()}
          onChange={(e) => setEndHour(+e.currentTarget.value)}
        />

        <div>
          <label for="col_height">col_height</label>
          <input
            id="col_height"
            type="number"
            style={{ width: "60px" }}
            value={colHeight()}
            onChange={(e) => setColHeight(+e.currentTarget.value)}
          />

          <label for="widget_height">widget_height</label>
          <input
            id="widget_height"
            type="number"
            style={{ width: "60px" }}
            value={widgetHeight()}
            onChange={(e) => setWidgetHeight(+e.currentTarget.value)}
          />

          <label for="header_height">header_height</label>
          <input
            id="header_height"
            type="number"
            style={{ width: "60px" }}
            value={headerHeight()}
            onChange={(e) => setHeaderHeight(+e.currentTarget.value)}
          />

          <label for="col_width">col_width</label>
          <input
            id="col_width"
            type="number"
            style={{ width: "60px" }}
            value={colWidth()}
            onChange={(e) => setColWidth(+e.currentTarget.value)}
          />
        </div>
      </section>

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
        onChange={(val) => setValue(val)}
      />
      <div>
        <pre>{JSON.stringify(value(), null, 2)}</pre>
      </div>
    </main>
  );
};

export default App;
