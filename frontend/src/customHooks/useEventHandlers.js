import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import {
  addMeeting,
  deleteMeeting,
  getMeetings,
  updateMeeting,
} from "../customHooks/useRoomMeetings";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateForDisplay = (date) =>
  date ? dayjs(date).format("YYYY-MM-DD") : "";

export const handleChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

export const handleSubmit = async ({
  e,
  formData,
  selectedRoom,
  selectedItem,
  setMeetings,
  closeModal,
}) => {
  e.preventDefault();
  if (!selectedRoom) {
    toast.error("Please select a room first.");
    return;
  }

  const formattedDate = formData.date;
  if (!formattedDate) {
    toast.error("Meeting date is required.");
    return;
  }

  const startDateTime = dayjs.tz(
    `${formattedDate} ${formData.startTime}`,
    "YYYY-MM-DD HH:mm",
    "UTC"
  );
  const endDateTime = dayjs.tz(
    `${formattedDate} ${formData.endTime}`,
    "YYYY-MM-DD HH:mm",
    "UTC"
  );

  if (endDateTime.isBefore(startDateTime)) {
    toast.error("End time cannot be before start time.");
    return;
  }

  try {
    if (selectedItem?._id) {
      await updateMeeting(selectedRoom, selectedItem._id, {
        ...formData,
        date: formattedDate,
      });
      toast.success("Meeting updated successfully!");
    } else {
      await addMeeting(selectedRoom, { ...formData, date: formattedDate });
      toast.success("Meeting added successfully!");
    }

    const updatedMeetings = await getMeetings(selectedRoom);
    setMeetings(updatedMeetings);
    closeModal();
  } catch (error) {
    toast.error("Error saving meeting. Please try again.");
  }
};

export const handleDelete = async ({
  selectedRoom,
  selectedItem,
  setMeetings,
  closeModal,
}) => {
  if (!selectedItem?._id || !selectedRoom) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this meeting?"
  );
  if (!confirmDelete) return;

  try {
    await deleteMeeting(selectedRoom, selectedItem._id);
    toast.success("Meeting deleted successfully!");

    const updatedMeetings = await getMeetings(selectedRoom);
    setMeetings(updatedMeetings);
    closeModal();
  } catch (error) {
    toast.error("Error deleting meeting.");
  }
};

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
