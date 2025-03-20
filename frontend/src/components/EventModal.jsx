import React, { useState, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import "../../styles/ModalStyles.css"; // Import the styles
import { Modal, Button, Form } from "react-bootstrap";
import { modalStateAtom } from "../storage/modalStateAtom";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { meetingsAtom } from "../storage/meetingsAtom";
import { logAuth } from "../storage/authAtom";

import {
  formatDateForDisplay,
  handleChange,
  handleSubmit,
  handleDelete,
  closeModalHandler,
} from "../customHooks/useEventHandlers.js";

const EventModal = () => {
  const [modalState, setModalState] = useAtom(modalStateAtom);
  const [selectedRoom] = useAtom(selectedRoomAtom);
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  const { isModalOpen, selectedItem } = modalState;
  const loginInfo = useAtomValue(logAuth);

  // ✅ Initialize form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    teamLead: "",
    description: "",
    project: "",
    name: "",
    email: "",
  });

  // ✅ Single useEffect for both loginInfo & selectedItem
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      name: loginInfo?.user?.name || "",
      email: loginInfo?.user?.email || "",
      title: selectedItem?.title || "",
      date: formatDateForDisplay(selectedItem?.date),
      startTime: selectedItem?.startTime || "",
      endTime: selectedItem?.endTime || "",
      teamLead: selectedItem?.teamLead || "",
      description: selectedItem?.description || "",
      project: selectedItem?.project || "",
    }));
  }, [loginInfo, selectedItem]);

  return (
    <Modal
  show={isModalOpen}
  onHide={() => closeModalHandler(setModalState, setFormData, loginInfo)}
  centered
  backdrop="static"
  size="lg"
  className="custom-modal" // Apply new styles
>
  <Modal.Header closeButton>
    <Modal.Title>{selectedItem?._id ? "Edit Meeting" : "New Meeting"}</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form
      onSubmit={(e) =>
        handleSubmit({
          e,
          formData,
          selectedRoom,
          selectedItem,
          setMeetings,
          closeModal: () =>
            closeModalHandler(setModalState, setFormData, loginInfo),
        })
      }
    >
      <Form.Group controlId="title">
        <Form.Label>Meeting Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => handleChange(e, formData, setFormData)}
          required
        />
      </Form.Group>

      <Form.Group controlId="date">
        <Form.Label>Meeting Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) => handleChange(e, formData, setFormData)}
          required
        />
      </Form.Group>

      <Form.Group controlId="startTime">
        <Form.Label>Start Time</Form.Label>
        <Form.Control
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={(e) => handleChange(e, formData, setFormData)}
          required
        />
      </Form.Group>

      <Form.Group controlId="endTime">
        <Form.Label>End Time</Form.Label>
        <Form.Control
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={(e) => handleChange(e, formData, setFormData)}
          required
        />
      </Form.Group>

      <Form.Group controlId="teamLead">
        <Form.Label>Team Lead</Form.Label>
        <Form.Control
          type="text"
          name="teamLead"
          value={formData.teamLead}
          onChange={(e) => handleChange(e, formData, setFormData)}
          required
        />
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={(e) => handleChange(e, formData, setFormData)}
          rows={3}
        />
      </Form.Group>

      <Form.Group controlId="project">
        <Form.Label>Project</Form.Label>
        <Form.Control
          as="select"
          name="project"
          value={formData.project}
          onChange={(e) => handleChange(e, formData, setFormData)}
          required
        >
          <option value="">Select a project</option>
          <option value="Project A">Project A</option>
          <option value="Project B">Project B</option>
          <option value="Project C">Project C</option>
        </Form.Control>
      </Form.Group>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => closeModalHandler(setModalState, setFormData, loginInfo)}
        >
          Cancel
        </Button>
        {selectedItem?._id && (
          <Button
            variant="danger"
            onClick={() =>
              handleDelete({
                selectedRoom,
                selectedItem,
                setMeetings,
                closeModal: () =>
                  closeModalHandler(setModalState, setFormData, loginInfo),
              })
            }
          >
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
