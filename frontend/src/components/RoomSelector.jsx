import React from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { selectedRoomAtom } from "../storage/selectedRoomAtom";
import { ButtonGroup, Button } from "react-bootstrap";

const RoomSelector = () => {
    const [roomId, setRoomId] = useAtom(selectedRoomAtom);
    const navigate = useNavigate(); // Create navigate function

    const handleRoomSelect = (id) => {
        setRoomId(id); // Set selected room globally
        navigate("/calendar"); // Redirect to calendar page
    };

    return (
        <ButtonGroup>
            <Button variant={roomId === 1 ? "primary" : "secondary"} onClick={() => handleRoomSelect(1)}>
                Private Room
            </Button>
            <Button variant={roomId === 2 ? "primary" : "secondary"} onClick={() => handleRoomSelect(2)}>
                Public Room
            </Button>
            <Button variant={roomId === 3 ? "primary" : "secondary"} onClick={() => handleRoomSelect(3)}>
                Chat Room
            </Button>
        </ButtonGroup>
    );
};

export default RoomSelector;
