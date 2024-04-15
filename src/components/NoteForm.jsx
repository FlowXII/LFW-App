import React, { useState } from 'react';
import { Paper, TextField, Button } from '@mui/material';

function NoteForm({ addNote }) {
  const [title, setTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newLink, setNewLink] = useState('');
  const [showExtras, setShowExtras] = useState(false);

  const handleSubmit = () => {
    if (newNote && title) {
      addNote({ title, text: newNote, image: newImage, link: newLink });
      setTitle('');
      setNewNote('');
      setNewImage('');
      setNewLink('');
    }
  };

  return (
    <Paper elevation={3} style={{ margin: '1rem 0', padding: '1rem' }}>
      <TextField
        label="Titre de la note"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        style={{ margin: '1rem 0' }}
      />
      <TextField
        label="Contenu de la note"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        fullWidth
        style={{ margin: '1rem 0' }}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setShowExtras(!showExtras)}
        style={{ margin: '1rem' }}
      >
        {showExtras ? "Hide Extras" : "Add Extras (Image/Link)"}
      </Button>
      {showExtras && (
        <>
          <TextField
            label="Image URL"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            fullWidth
            placeholder="http://example.com/image.jpg"
            style={{ margin: '1rem 0' }}
          />
          <TextField
            label="Link"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            fullWidth
            placeholder="http://example.com"
            style={{ margin: '1rem 0' }}
          />
        </>
      )}
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ margin: '1rem 0' }}>
        Créer une nouvelle note
      </Button>
    </Paper>
  );
}

export default NoteForm;
