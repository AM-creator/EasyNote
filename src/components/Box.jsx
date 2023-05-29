import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function Box(props) {
    const [isExpanded, setExpanded] = useState(false);
    const [note, setNote] = useState({
        name: "",
        description: ""
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setNote(prevNote => ({ ...prevNote, [name]: value }));
    }

    async function submitNote(event) {
        try {
            if (note.name.trim() !== "" || note.description.trim() !== "") {
                props.onAdd(note);
                setNote({
                    name: "",
                    description: ""
                });
                event.preventDefault();
            }
        } catch (error) {
            console.log("Error creating note:", error);
        }
    }


    function expand() {
        setExpanded(true);
    }

    return (
        <div>
            <form className="create-note">
                {isExpanded && (
                    <input
                        name="name"
                        onChange={handleChange}
                        value={note.name}
                        placeholder="Title"
                    />
                )}
                <textarea
                    onClick={expand}
                    name="description"
                    onChange={handleChange}
                    value={note.description}
                    placeholder="Note"
                    rows={isExpanded ? 3 : 1}
                />
                <Zoom in={isExpanded}>
                    <Fab onClick={submitNote}>
                        <AddIcon />
                    </Fab>
                </Zoom>
            </form>
        </div>
    );
}

export default Box;
