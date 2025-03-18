import { useAtom } from "jotai";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { ButtonGroup, Button, Container } from "react-bootstrap";

const RoomSelector = () => {
  const [selectedRoom, setSelectedRoom] = useAtom(selectedRoomAtom);

  return (
    <Container className="text-center my-3">
      <h2>Select a Room</h2>
      <ButtonGroup>
        {["Room 1", "Room 2", "Room 3"].map((room) => (
          <Button
            key={room}
            variant={selectedRoom === room ? "primary" : "secondary"}
            onClick={() => setSelectedRoom(room)}
            aria-pressed={selectedRoom === room}
          >
            {room}
          </Button>
        ))}
      </ButtonGroup>
    </Container>
  );
};

export default RoomSelector;
