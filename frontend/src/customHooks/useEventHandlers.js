import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import {
  addMeeting,
  deleteMeeting,
  updateMeeting,
} from "../customHooks/useRoomMeetings";
import { mutate } from "swr";
import { isTimeOverlapping, validateFormData } from "../../utils/formHandling";

dayjs.extend(utc);
dayjs.extend(timezone);

// Utility to format the date for display
export const formatDateForDisplay = (date) =>
  date ? dayjs(date).format("YYYY-MM-DD") : "";

// Utility to handle form input changes
export const handleChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// Function to handle form submission (adding or updating a meeting)
export const handleSubmit = async ({
  e,
  formData,
  selectedRoom,
  selectedItem,
  closeModal,
  meetings,
}) => {
  e.preventDefault();

  if (!selectedRoom) return toast.error("Please select a room first.");

  const { startDateTime, endDateTime } = validateFormData(formData);
  if (!startDateTime) return;

  if (isTimeOverlapping(dayjs(startDateTime), dayjs(endDateTime), meetings)) {
    return toast.error("This time slot is already taken.");
  }

  try {
    await handleMeetingOperation(selectedRoom, selectedItem?.id, {
      ...formData,
      startDateTime,
      endDateTime,
    });

    mutate(
      `https://meetingscheduler-web-app.onrender.com/api/rooms/${selectedRoom}/meetings`
    );
    closeModal();
  } catch {
    toast.error("Error saving meeting. Please try again.");
  }
};

const handleMeetingOperation = async (roomId, meetingId, meetingData) => {
  if (meetingId) {
    await updateMeeting(roomId, meetingId, meetingData);
    toast.success("Meeting updated successfully!");
  } else {
    await addMeeting(roomId, meetingData);
    toast.success("Meeting added successfully!");
  }
};

// Function to handle deleting a meeting
export const handleDelete = async ({
  selectedRoom,
  selectedItem,
  closeModal,
}) => {
  // If no item or room is selected, do nothing
  if (!selectedItem?.id || !selectedRoom) return;

  // Confirm the deletion from the user
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this meeting?"
  );
  if (!confirmDelete) return;

  try {
    // Attempt to delete the meeting
    await deleteMeeting(selectedRoom, selectedItem.id);
    toast.success("Meeting deleted successfully!");

    // Refresh the meeting data after deletion
    mutate(
      `https://meetingscheduler-web-app.onrender.com/api/rooms/${selectedRoom}/meetings`
    );

    // Close the modal after successful deletion
    closeModal();
  } catch (error) {
    toast.error("Error deleting meeting.");
  }
};

// Function to handle closing the modal and resetting the form data
export const closeModalHandler = (setModalState, setFormData, loginInfo) => {
  setModalState({ isModalOpen: false, selectedItem: null });
  setFormData({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    teamLead: "",
    description: "",
    project: "",
    name: loginInfo?.user?.name || "",
    email: loginInfo?.user?.email || "",
  });
};
