import { SideBarContainer } from "./styles";

const SideBar = (props) => {
  console.log("SideBarProps", { ...props });

  return (
    <SideBarContainer
      theme={props.theme}
      palette={props.palette}
      height={props.colHeight}
      colWidth={props.colWidth / 2}
    >
      {/* <For each={props.cols}>
    {(col: string) => <div class="weekday">{col}</div>}
  </For> */}
    </SideBarContainer>
  );
};

export default SideBar;
