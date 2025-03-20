import React from "react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parseISO, startOfWeek, format, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { calendarViewAtom } from "../storage/calendarViewAtom";
import "../../styles/CalendarStyles.css"; // Import the styles
import useCalendarHandlers from "../customHooks/useCalendarHandlers";
import useFetchMeetings from "../customHooks/useFetchMeetings";
import EventModal from "./EventModal";
import processMeetings from "../customHooks/processMeetings";
import { useNavigate } from "react-router-dom";

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
    const meetings = useFetchMeetings();
    const roomMeetings = processMeetings(meetings);

    const navigate = useNavigate(); // Initialize navigate


    return (
        <div className="calendar-container">
            {/* Go Back Button */}
            <button onClick={() => navigate("/roomselector")} className="go-back-button">
                ← Go Back
            </button>

            <h2 className="calendar-heading">Room {selectedRoom || "Not Selected"} - Meeting Calendar</h2>

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

            {/* Event Modal */}
            <EventModal />
        </div>
    );
};

export default CalendarComponent;
