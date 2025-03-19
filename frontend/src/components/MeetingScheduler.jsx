import React from "react";
import CalendarComponent from "./CalendarComponent";
import RoomSelector from "./RoomSelector";

const MeetingScheduler = () => {
  return (
    <div>
      <RoomSelector />
      <CalendarComponent />
    </div>
  );
};

export default MeetingScheduler;
