import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { ButtonGroup, Button, Card, Row, Col } from "react-bootstrap";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { roomsAtom } from "../storage/roomsAtom";
import { getAllRooms } from "../customHooks/useRoomMeetings";

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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: "1200px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <ButtonGroup className="mb-3 w-100">
          {rooms.map((room) => (
            <Button
              key={room.roomId}
              variant={roomId === room.roomId ? "primary" : "secondary"}
              onClick={() => handleRoomSelect(room.roomId)}
              className="mx-1"
            >
              {room.roomName}
            </Button>
          ))}
        </ButtonGroup>

        <Row className="mb-3 justify-content-center">
          {rooms.map((room) => (
            <Col
              key={room.roomId}
              xs={12}
              md={4}
              className="d-flex mb-3 justify-content-center"
            >
              <Card className="w-100 h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-3" style={{ fontSize: "1.25rem" }}>
                    {room.roomName}
                  </Card.Title>
                  {room.meetings.length > 0 ? (
                    room.meetings.map((meeting, index) => (
                      <div key={index} className="mb-2">
                        <strong style={{ fontSize: "1rem" }}>
                          {meeting.title}
                        </strong>{" "}
                        -{" "}
                        {formatMeetingDate(
                          meeting.date,
                          meeting.startTime,
                          meeting.endTime
                        )}
                        <br />
                        <small style={{ fontSize: "0.875rem" }}>
                          <strong>Host:</strong> {meeting.name}
                        </small>
                      </div>
                    ))
                  ) : (
                    <span>No meetings scheduled</span>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default RoomSelector;
