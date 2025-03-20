import React, { useEffect } from "react";
import { useAtom } from "jotai";
import "../../styles/RoomSelector.css"; // Import the styles
import { useNavigate } from "react-router-dom";
import { ButtonGroup, Button, Card, Row, Col, Container } from "react-bootstrap";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { roomsAtom } from "../storage/roomsAtom";
import { getAllRooms } from "../customHooks/useRoomMeetings";
import useAuth from "../customHooks/useAuth";

// ✅ Function to Format Date
const formatMeetingDate = (isoDate, startTime, endTime) => {
    const dateObj = new Date(isoDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return `${formattedDate} (${startTime} - ${endTime})`;
};

const RoomSelector = () => {
    const [roomId, setRoomId] = useAtom(selectedRoomAtom);
    const [rooms, setRooms] = useAtom(roomsAtom);
    const navigate = useNavigate();
    const { handleLogout } = useAuth();


    useEffect(() => {
        const fetchRooms = async () => {
            const data = await getAllRooms();
            setRooms(data);
        };
        fetchRooms();
    }, []);

    const handleRoomSelect = (id) => {
        setRoomId(id);
        navigate("/calendar");
    };

    return (
      <Container fluid className="room-selector-container">
      <h1 className="page-title">WAC Meeting</h1>
      <div className="logout-container">
        <Button onClick={handleLogout} variant="danger">Logout</Button>
      </div>

      <div className="room-selector-content">
        {/* Room Selection Buttons */}
        <ButtonGroup className="room-buttons">
          {rooms.map((room) => (
            <Button
              key={room.roomId}
              variant={roomId === room.roomId ? "primary" : "outline-secondary"}
              onClick={() => handleRoomSelect(room.roomId)}
              className="room-button"
            >
              {room.roomName}
            </Button>
          ))}
        </ButtonGroup>

        {/* Meeting Cards - All Rooms in the Same Row */}
        <Row className="meeting-list">
          {rooms.map((room) => (
            <Col key={room.roomId} xs={12} md={4} className="meeting-card">
              <Card className="meeting-card-container">
                <Card.Body className="meeting-card-body">
                  <Card.Title className="meeting-room-title">{room.roomName}</Card.Title>
                  {room.meetings.length > 0 ? (
                    room.meetings.map((meeting, index) => (
                      <div key={index} className="meeting-item">
                        <strong className="meeting-title">{meeting.title}</strong>
                        <small className="meeting-time">
                          {meeting.date} | {meeting.startTime} - {meeting.endTime}
                        </small>
                        <br />
                        <small className="meeting-host">
                          <strong>Host:</strong> {meeting.name}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p className="no-meetings">No meetings scheduled</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
    );
};

export default RoomSelector;
