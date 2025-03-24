import React from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import "../../styles/RoomSelector.css";
import {
  ButtonGroup,
  Button,
  Card,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import useAuth from "../customHooks/useAuth";
import { useRooms } from "../customHooks/useRoomMeetings";
import dayjs from "dayjs"; // Import dayjs

const RoomSelector = () => {
  const [roomId, setRoomId] = useAtom(selectedRoomAtom);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const { rooms, error } = useRooms();

  if (error) return <p className="error">Failed to load rooms.</p>;
  if (!rooms) return <p className="loading">Loading rooms...</p>;

  const handleRoomSelect = (id) => {
    setRoomId(id);
    navigate("/calendar");
  };

  return (
    <Container fluid className="room-selector-container">
      <h1 className="page-title text-center">WAC Meeting Scheduler</h1>

      <div className="logout-container text-end">
        <Button onClick={handleLogout} variant="danger" size="lg">
          Logout
        </Button>
      </div>

      <div className="room-selector-content text-center my-4">
        <ButtonGroup className="room-buttons">
          {rooms.map((room) => (
            <Button
              key={room.roomId}
              variant={roomId === room.roomId ? "primary" : "outline-secondary"}
              onClick={() => handleRoomSelect(room.roomId)}
              className="room-button px-4 py-2"
            >
              {room.roomName}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <Row className="meeting-list justify-content-center g-4">
        {rooms.map((room) => (
          <Col
            key={room.roomId}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="d-flex justify-content-center"
          >
            <Card className="meeting-card-container h-100 shadow-sm">
              <Card.Body className="meeting-card-body d-flex flex-column justify-content-between">
                <Card.Title className="meeting-room-title text-center fw-bold">
                  {room.roomName}
                </Card.Title>

                <div className="meeting-details flex-grow-1 d-flex flex-column">
                  {room.meetings?.length > 0 ? (
                    room.meetings.map((meeting, index) => (
                      <div
                        key={index}
                        className="meeting-item p-2 border-bottom"
                      >
                        <strong className="meeting-title">
                          {meeting.title}
                        </strong>
                        <p className="meeting-time text-muted small">
                          {dayjs(meeting.startDateTime).format(
                            "MM/DD/YYYY, hh:mm A"
                          )}{" "}
                          - {dayjs(meeting.endDateTime).format("hh:mm A")}
                        </p>
                        <p className="meeting-host text-muted small">
                          <strong>Host:</strong> {meeting.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="no-meetings-container d-flex justify-content-center align-items-center flex-grow-1">
                      <p className="no-meetings text-center text-muted">
                        No meetings scheduled
                      </p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RoomSelector;
