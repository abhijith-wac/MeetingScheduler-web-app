import dayjs from "dayjs";

export const validateStartTime = (value) => {
  if (!value) return "Start time is required.";

  const selectedTime = dayjs(value);
  const now = dayjs();

  // Round current time to the next nearest 15-minute interval
  const nextAvailableTime = now.add(15 - (now.minute() % 15), "minute").startOf("minute");

  if (selectedTime.isBefore(nextAvailableTime)) {
    return `Start time must be after ${nextAvailableTime.format("YYYY-MM-DD HH:mm")}`;
  }

  return undefined; // No errors
};

export const validateEndTime = (value, values) => {
  if (!value) return "End time is required.";

  const startTime = values.startTime;
  if (!startTime) return "Select a start time first.";

  const selectedEndTime = dayjs(value);
  const selectedStartTime = dayjs(startTime);

  if (selectedEndTime.isBefore(selectedStartTime.add(15, "minute"))) {
    return "End time must be at least 15 minutes after the start time.";
  }

  return undefined; // No errors
};
