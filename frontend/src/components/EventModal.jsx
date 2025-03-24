import React, { useState, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { mutate } from "swr";
import "../../styles/ModalStyles.css";
import { Modal, Button, Form } from "react-bootstrap";
import { modalStateAtom } from "../storage/modalStateAtom";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { logAuth } from "../storage/authAtom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  closeModalHandler,
  handleSubmit,  // Ensure this is imported from your custom hook
  handleDelete,
} from "../customHooks/useEventHandlers";

dayjs.extend(utc);
dayjs.extend(timezone);

const EventModal = () => {
  const [modalState, setModalState] = useAtom(modalStateAtom);
  const [selectedRoom] = useAtom(selectedRoomAtom);
  const loginInfo = useAtomValue(logAuth);
  const { isModalOpen, selectedItem } = modalState;

  const [formData, setFormData] = useState({
    title: "",
    startDateTime: "",
    endDateTime: "",
    teamLead: "",
    description: "",
    project: "",
    name: loginInfo?.user?.name || "",
    email: loginInfo?.user?.email || "",
  });

  useEffect(() => {
    setFormData({
      title: selectedItem?.title || "", 
      startDateTime: selectedItem?.startDateTime
        ? dayjs(selectedItem.startDateTime).format("YYYY-MM-DDTHH:mm")
        : "", 
      endDateTime: selectedItem?.endDateTime
        ? dayjs(selectedItem.endDateTime).format("YYYY-MM-DDTHH:mm")
        : "", 
      teamLead: selectedItem?.teamLead || "", 
      description: selectedItem?.description || "", 
      project: selectedItem?.project || "", 
      name: loginInfo?.user?.name || "", 
      email: loginInfo?.user?.email || "", 
    });
  }, [selectedItem, loginInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal
      show={isModalOpen}
      onHide={() => closeModalHandler(setModalState, setFormData, loginInfo)}
      centered
      backdrop="static"
      size="lg"
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedItem?.id ? "Edit Meeting" : "New Meeting"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit({
              e,
              formData,
              selectedRoom,
              selectedItem,
              updateMeetings: () =>
                mutate(`/api/rooms/${selectedRoom}/meetings`),
              closeModal: () =>
                closeModalHandler(setModalState, setFormData, loginInfo),
            });
          }}
        >
          <Form.Group controlId="title">
            <Form.Label>Meeting Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="startDateTime">
            <Form.Label>Start Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startDateTime"
              value={formData.startDateTime || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="endDateTime">
            <Form.Label>End Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDateTime"
              value={formData.endDateTime || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="teamLead">
            <Form.Label>Team Lead</Form.Label>
            <Form.Control
              type="text"
              name="teamLead"
              value={formData.teamLead || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>

          <Form.Group controlId="project">
            <Form.Label>Project</Form.Label>
            <Form.Control
              as="select"
              name="project"
              value={formData.project || ""}
              onChange={handleChange}
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
              onClick={() =>
                closeModalHandler(setModalState, setFormData, loginInfo)
              }
            >
              Cancel
            </Button>

            {selectedItem?.id && (
              <Button
                variant="danger"
                onClick={() =>
                  handleDelete({
                    selectedRoom,
                    selectedItem,
                    updateMeetings: () =>
                      mutate(`/api/rooms/${selectedRoom}/meetings`),
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
