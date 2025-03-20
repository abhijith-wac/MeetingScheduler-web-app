import React from "react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parseISO, startOfWeek, format, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { calendarViewAtom } from "../storage/calendarViewAtom";
import { Button } from "react-bootstrap";
import useAuth from "../customHooks/useAuth";
import useCalendarHandlers from "../customHooks/useCalendarHandlers";
import useFetchMeetings from "../customHooks/useFetchMeetings";
import EventModal from "./EventModal";
import processMeetings from "../customHooks/processMeetings";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = () => {
  const [selectedRoom] = useAtom(selectedRoomAtom);
  const [calendarView, setCalendarView] = useAtom(calendarViewAtom);
  const { handleLogout } = useAuth();
  const { handleSelectSlot, handleSelectEvent } = useCalendarHandlers();
  const meetings = useFetchMeetings();
  const roomMeetings = processMeetings(meetings);

  return (
    <div className="p-4">
      <Button onClick={handleLogout}>Logout</Button>
      <h2 className="text-xl font-bold mb-4">
        Room {selectedRoom || "Not Selected"} - Meeting Calendar
      </h2>
      <Calendar
        localizer={localizer}
        events={roomMeetings}
        startAccessor="start"
        endAccessor="end"
        selectable
        view={calendarView}
        onView={setCalendarView}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 800 }}
        components={{
          event: ({ event }) => (
            <div
              style={{ backgroundColor: "gray", opacity: 0.7, padding: "4px" }}
            >
              {event.title} {dayjs(event.start).format("HH:mm")} -{" "}
              {dayjs(event.end).format("HH:mm")}
            </div>
          ),
        }}
      />

      <EventModal />
    </div>
  );
};

export default CalendarComponent;
