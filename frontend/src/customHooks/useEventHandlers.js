import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import { addMeeting, deleteMeeting, updateMeeting } from "../customHooks/useRoomMeetings";
import { mutate } from "swr";
import { isTimeOverlapping, validateFormData } from "../../utils/formHandling";


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
  meetings,
}) => {
  e.preventDefault();

  if (!selectedRoom) {
    toast.error("Please select a room first.");
    return;
  }

  const { startDateTime, endDateTime } = validateFormData(formData);
  if (!startDateTime) return;

  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);

  if (isTimeOverlapping(start, end, meetings)) {
    toast.error("This time slot is already taken.");
    return;
  }

  try {
    if (selectedItem?.id) {
      await updateMeeting(selectedRoom, selectedItem.id, {
        ...formData,
        startDateTime,
        endDateTime,
      });
      toast.success("Meeting updated successfully!");
    } else {
      await addMeeting(selectedRoom, {
        ...formData,
        startDateTime,
        endDateTime,
      });
      toast.success("Meeting added successfully!");
    }

    mutate(`https://meetingscheduler-web-app.onrender.com/api/rooms/${selectedRoom}/meetings`);
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
    mutate(`https://meetingscheduler-web-app.onrender.com/api/rooms/${selectedRoom}/meetings`);
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