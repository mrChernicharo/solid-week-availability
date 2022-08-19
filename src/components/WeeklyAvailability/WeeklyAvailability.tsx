import { createEffect, onMount, Show } from "solid-js";
import { useTheme } from "solid-styled-components";
import { getLocaleWeekDays, getOrderedWeekDays } from "../../lib/helpers";
import { Container } from "./styles";

const WeeklyAvailability = (props) => {
  const theme = useTheme();

  console.log(props.locale, getOrderedWeekDays(props.firstDay, props.dayCols));

  return (
    <Show when={props.open}>
      <Container theme={theme} palette={props.palette}>
        <div>WeeklyAvailability</div>
      </Container>
    </Show>
  );
};

export default WeeklyAvailability;
