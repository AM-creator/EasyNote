import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import Box from "./Box";
import { withAuthenticator } from '@aws-amplify/ui-react';
import { API } from "aws-amplify";
import { listNotes } from "../graphql/queries";
import {
    createNote as createNoteMutation,
    deleteNote as deleteNoteMutation,
} from "../graphql/mutations";

function App({ signOut }) {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        try {
            const apiData = await API.graphql({ query: listNotes });
            const notesFromAPI = apiData.data.listNotes.items;
            setNotes(notesFromAPI);
        } catch (error) {
            console.log("Error fetching notes:", error);
        }
    }

    async function createNote(newNote) {
        try {
            await API.graphql({
                query: createNoteMutation,
                variables: { input: newNote },
            });
            fetchNotes();
        } catch (error) {
            console.log("Error creating note:", error);
        }
    }

    async function deleteNote({ id }) {
        const newNotes = notes.filter((note) => note.id !== id);
        setNotes(newNotes);
        try {
            await API.graphql({
                query: deleteNoteMutation,
                variables: { input: { id } },
            });
        } catch (error) {
            console.log("Error deleting note:", error);
        }
    }

    return (
        <div>
            <Header />
            <button className="App-signout-button" onClick={signOut}>Sign Out</button>
            <Box onAdd={createNote} />
            {notes.map((noteItem) => (
                <Note
                    key={noteItem.id}
                    id={noteItem.id}
                    title={noteItem.name}
                    content={noteItem.description}
                    onDelete={deleteNote}
                />
            ))}
            <Footer />
        </div>
    );
}

export default withAuthenticator(App);
