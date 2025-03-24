import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateForDisplay = (date) =>
  date ? dayjs(date).format("YYYY-MM-DD") : "";

export const isTimeOverlapping = (start, end, meetings) => {
  if (!Array.isArray(meetings)) return false; 
  return meetings.some((meeting) => {
    const meetingStart = dayjs(meeting.startDateTime);
    const meetingEnd = dayjs(meeting.endDateTime);

    return (
      (start.isBefore(meetingEnd) && end.isAfter(meetingStart)) ||
      (start.isBefore(meetingStart) && end.isAfter(meetingStart)) ||
      (start.isBefore(meetingEnd) && end.isAfter(meetingEnd))
    );
  });
};

export const validateFormData = (formData) => {
  if (
    !formData.title ||
    !formData.startDateTime ||
    !formData.endDateTime ||
    !formData.teamLead ||
    !formData.name ||
    !formData.email ||
    !formData.project
  ) {
    toast.error("All fields are required.");
    return false;
  }

  const startDateTime = dayjs(formData.startDateTime).utc().toISOString();
  const endDateTime = dayjs(formData.endDateTime).utc().toISOString();

  if (dayjs(endDateTime).isBefore(dayjs(startDateTime))) {
    toast.error("End time cannot be before start time.");
    return false;
  }

  return { startDateTime, endDateTime };
};
