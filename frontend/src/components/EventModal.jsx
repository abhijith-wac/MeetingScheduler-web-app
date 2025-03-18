// EventModal.js
import React from "react";
import { useAtom } from "jotai";
import { Form } from "informed";
import { Modal, Button } from "react-bootstrap";
import { modalStateAtom } from "../storage/modalStateAtom";
import CustomInput from "../customFields/CustomInput";
import CustomProjectSelect from "../customFields/CustomProjectSelect";

const EventModal = () => {
  const [modalState, setModalState] = useAtom(modalStateAtom);

  const closeModal = () => {
    setModalState({ isModalOpen: false, selectedItem: null });
  };

  const handleSubmit = async (values) => {
    console.log(modalState.selectedItem ? "Updated Event:" : "New Event:", values);
    closeModal();
  };

  return (
    <Modal show={modalState.isModalOpen} onHide={closeModal} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{modalState.selectedItem ? "Edit Meeting" : "Add Meeting"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form initialValues={modalState.selectedItem || {}} onSubmit={handleSubmit}>
          <CustomInput name="title" label="Meeting Title" required />
          <CustomInput name="date" label="Meeting Date" type="date" required />
          <CustomInput name="startTime" label="Start Time" type="time" required />
          <CustomInput name="endTime" label="End Time" type="time" required />
          <CustomInput name="teamLead" label="Team Lead" required />
          <CustomInput name="description" label="Description" type="textarea" />
          <CustomProjectSelect name="project" label="Select Project" required />
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;