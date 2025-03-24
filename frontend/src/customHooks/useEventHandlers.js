import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import { addMeeting, deleteMeeting, updateMeeting } from "../customHooks/useRoomMeetings";
import { mutate } from "swr";

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
  closeModal,
}) => {
  e.preventDefault();

  if (!selectedRoom) {
    toast.error("Please select a room first.");
    return;
  }

  if (!formData.title || !formData.startDateTime || !formData.endDateTime || !formData.teamLead || !formData.name || !formData.email || !formData.project) {
    toast.error("All fields are required.");
    return;
  }

  const startDateTime = dayjs(formData.startDateTime).utc().toISOString();
  const endDateTime = dayjs(formData.endDateTime).utc().toISOString();

  if (dayjs(endDateTime).isBefore(dayjs(startDateTime))) {
    toast.error("End time cannot be before start time.");
    return;
  }

  try {
    if (selectedItem?.id) {
      await updateMeeting(selectedRoom, selectedItem.id, {
        title: formData.title,
        startDateTime,
        endDateTime,
        teamLead: formData.teamLead,
        description: formData.description,
        project: formData.project,
        name: formData.name,
        email: formData.email,
      });
      toast.success("Meeting updated successfully!");
    } else {
      await addMeeting(selectedRoom, {
        title: formData.title,
        startDateTime,
        endDateTime,
        teamLead: formData.teamLead,
        description: formData.description,
        project: formData.project,
        name: formData.name,
        email: formData.email,
      });
      toast.success("Meeting added successfully!");
    }

    mutate(`http://localhost:5000/api/rooms/${selectedRoom}/meetings`);
    closeModal();
  } catch (error) {
    toast.error("Error saving meeting. Please try again.");
  }
};

export const handleDelete = async ({
  selectedRoom,
  selectedItem,
  closeModal,
}) => {
  if (!selectedItem?.id || !selectedRoom) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this meeting?"
  );
  if (!confirmDelete) return;

  try {
    await deleteMeeting(selectedRoom, selectedItem.id);
    toast.success("Meeting deleted successfully!");
    mutate(`http://localhost:5000/api/rooms/${selectedRoom}/meetings`);
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