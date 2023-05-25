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
        const apiData = await API.graphql({ query: listNotes });
        const notesFromAPI = apiData.data.listNotes.items;
        setNotes(notesFromAPI);
    }

    async function createNote(event) {
        const form = new FormData(event.target);
        const data = {
            name: form.get("title"),
            description: form.get("content"),
        };

        // Create the note in the backend
        await API.graphql({
            query: createNoteMutation,
            variables: { input: data },
        });

        fetchNotes();
        event.target.reset();
    }

    async function deleteNote({ id }) {
        const newNotes = notes.filter((note) => note.id !== id);
        setNotes(newNotes);
        await API.graphql({
            query: deleteNoteMutation,
            variables: { input: { id } },
        });
    }

    return (
        <div>
            <Header />
            <button className="App-signout-button" onClick={signOut}>Sign Out</button>
            <Box onAdd={createNote} />
            {notes.map((noteItem, index) => {
                return (
                    <Note
                        key={index}
                        id={index}
                        title={noteItem.title}
                        content={noteItem.content}
                        onDelete={deleteNote}
                    />
                );
            })}
            <Footer />
        </div>
    );
}

export default withAuthenticator(App);
