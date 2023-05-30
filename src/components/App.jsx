import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import Box from "./Box";
import { withAuthenticator } from '@aws-amplify/ui-react';
import { API, Storage } from "aws-amplify";
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
            const apiData = await API.graphql({
                query: listNotes,
                variables: {
                    sortField: "createdAt",
                    sortDirection: 'DESC'
                }
            });

            const notesFromAPI = apiData.data.listNotes.items;
            await Promise.all(
                notesFromAPI.map(async (note) => {
                    if (note.image) {
                        const url = await Storage.get(note.name);
                        note.image = url;
                    }
                    return note;
                })
            );

            const sortedNotes = notesFromAPI.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setNotes(sortedNotes);
        } catch (error) {
            console.log("Error fetching notes:", error);
        }
    }

    async function createNote(newNote) {
        try {
            if (!!newNote.image) {
                await Storage.put(newNote.name, newNote.image); // Upload the image to storage
            }

            const response = await API.graphql({
                query: createNoteMutation,
                variables: { input: newNote },
            });

            const createdNote = response.data.createNote;

            if (!!newNote.image) {
                const url = await Storage.get(newNote.name); // Get the image URL after upload
                createdNote.image = url;
            }

            const updatedNotes = [createdNote, ...notes]; // Prepend the new note to the existing notes array
            setNotes(updatedNotes);
        } catch (error) {
            console.log("Error creating note:", error);
        }
    }

    async function deleteNote(id, name) {
        try {
            await API.graphql({
                query: deleteNoteMutation,
                variables: { input: { id } },
            });
            // Remove the associated image from storage
            await Storage.remove(name);
            setNotes(prevNotes => prevNotes.filter(noteItem => noteItem.id !== id));
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
            {notes.map((note) => (
                <Note
                    key={note.id}
                    id={note.id}
                    name={note.name}
                    description={note.description}
                    image={note.image}
                    onDelete={deleteNote}
                />
            ))}
            <Footer />
        </div>
    );
}

export default withAuthenticator(App);
