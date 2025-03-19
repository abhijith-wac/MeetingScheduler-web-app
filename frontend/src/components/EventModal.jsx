import { useAtom } from "jotai";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { modalStateAtom } from "../storage/modalStateAtom";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { meetingsAtom } from "../storage/meetingsAtom";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { addMeeting, deleteMeeting, getMeetings, updateMeeting } from "../customHooks/useRoomMeetings";

const EventModal = () => {
  const [modalState, setModalState] = useAtom(modalStateAtom);
  const [selectedRoom] = useAtom(selectedRoomAtom);
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  const { isModalOpen, selectedItem } = modalState;

  const [formData, setFormData] = useState({
    title: "",
    date: "",  // ✅ Added date field
    startTime: "",
    endTime: "",
    teamLead: "",
    description: "",
    project: "",
  });

  // 🟢 Load selected meeting data into the form
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        title: selectedItem.title || "",
        date: selectedItem.start ? dayjs(selectedItem.start).format("YYYY-MM-DD") : "", // ✅ Extract date
        startTime: selectedItem.start ? dayjs(selectedItem.start).format("HH:mm") : "",
        endTime: selectedItem.end ? dayjs(selectedItem.end).format("HH:mm") : "",
        teamLead: selectedItem.teamLead || "",
        description: selectedItem.description || "",
        project: selectedItem.project || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 Submit Meeting Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      toast.error("Please select a room first.");
      return;
    }

    // ✅ Ensure date is extracted properly
    const formattedDate = formData.date || (selectedItem?.start ? dayjs(selectedItem.start).format("YYYY-MM-DD") : "");
    if (!formattedDate) {
      toast.error("Meeting date is required.");
      return;
    }

    const startDateTime = dayjs(`${formattedDate} ${formData.startTime}`);
    const endDateTime = dayjs(`${formattedDate} ${formData.endTime}`);

    if (endDateTime.isBefore(startDateTime)) {
      toast.error("End time cannot be before start time.");
      return;
    }

    try {
      if (selectedItem?._id) {
        // ✅ Include `date` when updating
        await updateMeeting(selectedRoom, selectedItem._id, {
          ...formData,
          date: formattedDate,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        });
        toast.success("Meeting updated successfully!");
      } else {
        // ✅ Include `date` when creating a new meeting
        await addMeeting(selectedRoom, {
          ...formData,
          date: formattedDate,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        });
        toast.success("Meeting added successfully!");
      }

      const updatedMeetings = await getMeetings(selectedRoom);
      setMeetings(updatedMeetings);
      closeModal();
    } catch (error) {
      toast.error("Error saving meeting. Please try again.");
    }
  };

  // 🛑 Delete Meeting
  const handleDelete = async () => {
    if (!selectedItem?._id || !selectedRoom) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this meeting?");
    if (!confirmDelete) return;

    try {
      await deleteMeeting(selectedRoom, selectedItem._id);
      toast.success("Meeting deleted successfully!");

      // Refresh calendar meetings
      const updatedMeetings = await getMeetings(selectedRoom);
      setMeetings(updatedMeetings);
      closeModal();
    } catch (error) {
      toast.error("Error deleting meeting.");
    }
  };

  const closeModal = () => {
    setModalState({ isModalOpen: false, selectedItem: null });
    setFormData({
      title: "",
      date: "", // ✅ Reset date field
      startTime: "",
      endTime: "",
      teamLead: "",
      description: "",
      project: "",
    });
  };

  return (
    <Modal show={isModalOpen} onHide={closeModal} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedItem?._id ? "Edit Meeting" : "New Meeting"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Meeting Title</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="date">
            <Form.Label>Meeting Date</Form.Label>
            <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="teamLead">
            <Form.Label>Team Lead</Form.Label>
            <Form.Control type="text" name="teamLead" value={formData.teamLead} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} rows={3} />
          </Form.Group>

          <Form.Group controlId="project">
            <Form.Label>Project</Form.Label>
            <Form.Control as="select" name="project" value={formData.project} onChange={handleChange} required>
              <option value="">Select a project</option>
              <option value="Project A">Project A</option>
              <option value="Project B">Project B</option>
              <option value="Project C">Project C</option>
            </Form.Control>
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            {selectedItem?._id && (
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
