import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useAtom } from "jotai";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parseISO, startOfWeek, format, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { calendarViewAtom } from "../storage/calendarViewAtom";
import "../../styles/CalendarStyles.css";
import useCalendarHandlers from "../customHooks/useCalendarHandlers";
import EventModal from "./EventModal";
import { useNavigate } from "react-router-dom";
import { useMeetings } from "../customHooks/useRoomMeetings";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const { handleSelectSlot, handleSelectEvent } = useCalendarHandlers();
  const navigate = useNavigate();

  const { meetings, isLoading, isError } = useMeetings(selectedRoom);


  if (isLoading) return <p className="loading-message">Loading meetings...</p>;
  if (isError) return <p className="error-message">Failed to load meetings</p>;

  const roomMeetings = meetings.map((meeting) => ({
    id: meeting._id,
    title: meeting.title,
    start: dayjs(meeting.startDateTime).toDate(),
    end: dayjs(meeting.endDateTime).toDate(),
  }));

  return (
    <div className="calendar-container">
      <button onClick={() => navigate("/roomselector")} className="go-back-button">
        ← Go Back
      </button>

      <h2 className="calendar-heading">
        {selectedRoom ? `Room ${selectedRoom} - Meeting Calendar` : "Select a Room"}
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
        className="custom-calendar"
        components={{
          event: ({ event }) => (
            <div className="event-style">
              {event.title} {dayjs(event.start).format("HH:mm")} - {dayjs(event.end).format("HH:mm")}
            </div>
          ),
        }}
      />

      <EventModal />
    </div>
  );
};

export default CalendarComponent;
