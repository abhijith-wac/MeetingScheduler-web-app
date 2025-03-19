import React from "react";
import { useAtom } from "jotai";
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { ButtonGroup, Button } from "react-bootstrap";

const RoomSelector = () => {
  const [roomId, setRoomId] = useAtom(selectedRoomAtom);

  return (
    <ButtonGroup>
      <Button variant={roomId === 1 ? "primary" : "secondary"} onClick={() => setRoomId(1)}>
        Room A
      </Button>
      <Button variant={roomId === 2 ? "primary" : "secondary"} onClick={() => setRoomId(2)}>
        Room B
      </Button>
      <Button variant={roomId === 3 ? "primary" : "secondary"} onClick={() => setRoomId(3)}>
        Room C
      </Button>
    </ButtonGroup>
  );
};

export default RoomSelector;
