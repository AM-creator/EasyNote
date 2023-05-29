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
            // Specify the sort direction as DESC
            const apiData = await API.graphql({
                query: listNotes,
                variables: { sortDirection: 'DESC' }
            });
            const notesFromAPI = apiData.data.listNotes.items;
            setNotes(notesFromAPI);
        } catch (error) {
            console.log("Error fetching notes:", error);
        }
    }

    async function createNote(newNote) {
        try {
            const response = await API.graphql({
                query: createNoteMutation,
                variables: { input: newNote },
            });
            // Assuming the mutation returns the created note object
            const createdNote = response.data.createNote;
            const updatedNotes = [createdNote, ...notes]; // Add the new note at the beginning

            setNotes(updatedNotes);
        } catch (error) {
            console.log("Error creating note:", error);
        }
    }


    async function deleteNote(id) {
        try {
            await API.graphql({
                query: deleteNoteMutation,
                variables: { input: { id } },
            });
            setNotes(prevNotes => {
                return prevNotes.filter(noteItem => noteItem.id !== id);
            });
        } catch (error) {
            console.log("Error deleting note:", error);
            // Revert the local state back to its previous state
            fetchNotes();
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
                    name={noteItem.name}
                    description={noteItem.description}
                    onDelete={deleteNote}
                />
            ))}
            <Footer />
        </div>
    );
}

export default withAuthenticator(App);
