import React, { useState } from "react";
import { useAtom } from "jotai";
import { Form } from "informed";
import { Modal, Button } from "react-bootstrap";
import { modalStateAtom } from "../storage/modalStateAtom";
import CustomInput from "../customFields/CustomInput";
import CustomProjectSelect from "../customFields/CustomProjectSelect";

const EventModal = () => {
  const [modalState, setModalState] = useAtom(modalStateAtom); // Use the atom directly
  const [isUpdating, setIsUpdating] = useState(false);

  // Close the modal when called
  const closeModal = () => {
    setModalState({ isModalOpen: false, selectedItem: null });
  };

  // If there is a selectedItem, populate initial values, otherwise provide empty values
  const initialValues = modalState.selectedItem || {
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    teamLead: "",
    participants: "",
    description: "",
    project: "",
  };

  // Handle form submission for adding or updating an event
  const handleSubmit = async (values) => {
    setIsUpdating(true);

    try {
      if (modalState.selectedItem) {
        // Update event logic (replace with actual API call to update event)
        console.log("Updated Event:", values);
        // Call your API to update the event here
      } else {
        // Add new event logic (replace with actual API call to add event)
        console.log("New Event:", values);
        // Call your API to add the new event here
      }
      closeModal();
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsUpdating(false);
    }
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
          {modalState.selectedItem ? "Edit Meeting" : "Add Meeting"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          initialValues={initialValues} // Pass the initial values to the Form component
          onSubmit={handleSubmit}
          focusOnInvalid={true}
        >
          <CustomInput
            name="title"
            label="Meeting Title"
            required
          />
          <CustomInput
            name="date"
            label="Meeting Date"
            type="date"
            required
          />
          <CustomInput
            name="startTime"
            label="Start Time"
            type="time"
            required
          />
          <CustomInput
            name="endTime"
            label="End Time"
            type="time"
            required
          />
          <CustomInput
            name="teamLead"
            label="Team Lead"
            required
          />
          <CustomInput
            name="description"
            label="Description"
            type="textarea"
          />
          <CustomProjectSelect
            name="project"
            label="Select Project"
            required
          />
          <Modal.Footer className="modal-footer">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
