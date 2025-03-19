import { useAtom } from "jotai";
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { modalStateAtom } from "../storage/modalStateAtom";
import dayjs from "dayjs";

const EventModal = () => {
  const [modalState, setModalState] = useAtom(modalStateAtom);
  const { selectedItem } = modalState;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalState((prevState) => ({
      ...prevState,
      selectedItem: {
        ...prevState.selectedItem,
        [name]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted with data: ", selectedItem);
  };

  // Handle modal close
  const closeModal = () => {
    setModalState({
      isModalOpen: false,
      selectedItem: null,
    });
  };

  return (
    <Modal
      show={modalState.isModalOpen}
      onHide={closeModal}
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedItem ? "Edit Meeting" : "New Meeting"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Meeting Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={selectedItem?.title || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Display the selected date */}
          {selectedItem?.date && (
            <Form.Group controlId="selectedDate">
              <Form.Label>Selected Date</Form.Label>
              <Form.Control
                type="text"
                name="selectedDate"
                value={dayjs(selectedItem.date).format("D MMM YYYY")} // Format the date to '19th Mar 2025'
                readOnly
              />
            </Form.Group>
          )}

          <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time" // Changed to time instead of datetime-local
              name="startTime"
              value={selectedItem?.startTime || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time" // Changed to time instead of datetime-local
              name="endTime"
              value={selectedItem?.endTime || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="teamLead">
            <Form.Label>Team Lead</Form.Label>
            <Form.Control
              type="text"
              name="teamLead"
              value={selectedItem?.teamLead || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={selectedItem?.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>

          <Form.Group controlId="project">
            <Form.Label>Project</Form.Label>
            <Form.Control
              as="select" // Make it a dropdown
              name="project"
              value={selectedItem?.project || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select a project</option> {/* Placeholder */}
              <option value="Project A">Project A</option>
              <option value="Project B">Project B</option>
              <option value="Project C">Project C</option>
            </Form.Control>
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
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
