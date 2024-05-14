import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Typography, Button } from '@mui/material';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

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

    // Adding a stub for handleEditButtonClick - to be implemented
    const handleEditButtonClick = (noteId) => {
        console.log(`Edit button clicked for note: ${noteId}`);
    };

    return (
        <div>
            {notes.map((note, index) => (
                <Card key={index} style={{ margin: '1rem' }}>
                    <CardHeader title={note.note_title} />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {note.note_text}
                            </Typography>
                            {note.image && (
                                <img src={note.image} alt={note.note_title} style={{ width: '100%', height: 'auto' }} />
                            )}
                            {note.link && (
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Link: <a href={note.link}>{note.link}</a>
                                </Typography>
                            )}
                        <Button color='primary' onClick={() => handleEditButtonClick(note.id)}>Edit</Button>
                    </CardContent>          
                </Card>
            ))}
        </div>
    );
}

export default MyNotes;