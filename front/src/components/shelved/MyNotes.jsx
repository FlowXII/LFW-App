import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Typography, Button } from '@mui/material';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function MyNotes() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const firestore = getFirestore();
            const notesCollection = collection(firestore, 'notes');
            const noteSnapshot = await getDocs(notesCollection);
            const noteList = noteSnapshot.docs.map(doc => ({
                id: doc.id, // Store document ID to enable editing
                ...doc.data()
            }));
            setNotes(noteList);
        };

        fetchNotes();
    }, []);

    const navigate = useNavigate();
    const handleEditButtonClick = (noteId) =>{
        navigate(`/editnote/${noteId}`);
    };

    const handleNewButtonClick = () => {
        navigate('/createnote');
    };

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Your Notes
            </Typography>
            <Button variant="contained" color="primary" onClick={handleNewButtonClick}> Create a New Note </Button>
            {notes.map((note, index) => (
                <Card key={index} style={{ margin: '1rem' }}>
                    <CardHeader title={note.note_title} />
                    <CardContent>
                        <Button variant="contained" color='primary' onClick={() => handleEditButtonClick(note.id)}>Check and Edit</Button>
                    </CardContent>          
                </Card>
            ))}
        </div>
    );
}

export default MyNotes;