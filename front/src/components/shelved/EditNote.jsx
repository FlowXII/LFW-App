import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, getFirestore, setDoc, deleteDoc } from 'firebase/firestore';
import { Button, TextField, Paper } from '@mui/material';

function EditNote() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [title, setTitle] = useState('');
    const [newNote, setNewNote] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newLink, setNewLink] = useState('');

    // Using useEffect to fetch the note based on id
    useEffect(() => {
        const fetchNote = async () => {
            const db = getFirestore();
            const noteDoc = doc(db, 'notes', id);
            const noteSnap = await getDoc(noteDoc);

            if (noteSnap.exists()) {
                setNote(noteSnap.data());
                setTitle(noteSnap.data().note_title);
                setNewNote(noteSnap.data().note_text);
                setNewImage(noteSnap.data().image);
                setNewLink(noteSnap.data().link);
            } else {
                console.log('No such note!');
                // handle here like setting state to represent error state
            }
        };
        fetchNote();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const db = getFirestore();
        const noteRef = doc(db, 'notes', id);
        const newNoteData = {
            id: id,
            note_title: title,
            note_text: newNote,
            image: newImage,
            link: newLink,
        };
        await setDoc(noteRef, newNoteData); // persist the changes
        console.log('Note updated successfully!');
        navigate('/mynotes'); // navigate back to MyNotes
    };
    
    // New function to handle deleting note
    const handleDelete = async() => {
        const db = getFirestore();
        const noteRef = doc(db, 'notes', id);
        await deleteDoc(noteRef);
        console.log('Note deleted successfully!');
        navigate('/mynotes');
    };

    return (
        <Paper elevation={3} style={{ margin: '1rem 0', padding: '1rem' }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    style={{ margin: '1rem 0' }}
                />
                <TextField
                    label="Note Content"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    fullWidth
                    style={{ margin: '1rem 0' }}
                    multiline
                    rows={4}
                />
                <TextField
                    label="Image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    fullWidth
                    style={{ margin: '1rem 0' }}
                />
                <TextField
                    label="Link"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    fullWidth
                    style={{ margin: '1rem 0' }}
                />
                <Button variant="contained" color="primary" type="submit" style={{ margin: '1rem 0' }}>
                    Save Note
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDelete} style={{ margin: '1rem 0' }}>
                    Delete Note
                </Button>
            </form>
        </Paper>
    );
}

export default EditNote;