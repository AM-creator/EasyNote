import React, { useState } from "react";
import { Image } from '@aws-amplify/ui-react';
import AddIcon from '@mui/icons-material/Add';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function Box(props) {
    const [isExpanded, setExpanded] = useState(false);
    const [note, setNote] = useState({
        name: "",
        description: "",
        image: null
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setNote(prevNote => ({ ...prevNote, [name]: value }));
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        setNote(prevNote => ({ ...prevNote, image: file }));
    }

    function submitNote(event) {
        event.preventDefault();

        // Check if any of the fields have content before adding the note
        if (note.name.trim() !== "" || note.description.trim() !== "" || note.image) {
            props.onAdd(note);
            setNote({
                name: "",
                description: "",
                image: null
            });
        }
    }

    function expand() {
        setExpanded(true);
    }

    return (
        <div>
            <form className="create-note">
                {isExpanded && (
                    // Input field for note title
                    <input
                        name="name"
                        onChange={handleChange}
                        value={note.name}
                        placeholder="Title"
                    />
                )}
                {/* Textarea for note description */}
                <textarea
                    onClick={expand}
                    name="description"
                    onChange={handleChange}
                    value={note.description}
                    placeholder="Note"
                    rows={isExpanded ? 3 : 1}
                />
                {note.image && (
                    // Display uploaded image
                    <Image src={URL.createObjectURL(note.image)} alt="Uploaded Image" />
                )}
                <Zoom in={isExpanded}>
                    {/* Button to submit the note */}
                    <Fab onClick={submitNote}>
                        <AddIcon />
                    </Fab>
                </Zoom>
                <label htmlFor="image-input" className="icon-wrapper">
                    {/* Icon for adding images */}
                    <InsertPhotoIcon />
                </label>
                {/* Input field for uploading images */}
                <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                />
            </form>
        </div>
    );
}

export default Box;