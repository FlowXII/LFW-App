import React, { useState } from 'react';
import { Paper, TextField, Button } from '@mui/material';
import { collection, addDoc, getFirestore } from "firebase/firestore"
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


// Composant pour créer une nouvelle note
function NoteForm({ addNote, firestore, user }) {
  // État pour stocker le titre de la note
  const [title, setTitle] = useState('');

  // État pour stocker le contenu de la note
  const [newNote, setNewNote] = useState('');

  // État pour stocker l'URL de l'image optionnelle
  const [newImage, setNewImage] = useState('');

  // État pour stocker l'URL du lien optionnel
  const [newLink, setNewLink] = useState('');

  // État pour contrôler l'affichage des champs optionnels
  const [showExtras, setShowExtras] = useState(false);

  // Extract the `displayName` property out of `user`
  const username = user ? user.displayName : 'Anonymous';
  // Allows navigation
  const navigate = useNavigate();
  // Snackbar setup
  const [open, setOpen] = useState(false);

  const handleMyNotesButtonClick = () => {
    navigate('/mynotes');
  };

  // Fonction pour ajouter les notes à la collection
  const handleSubmit = async () => {
    if (newNote && title && user) {
      try {
        // Add note to external function (assuming addNote handles logic)
        addNote({ title, text: newNote, image: newImage, link: newLink });
  
        const firestore = await getFirestore(); // Wait for firestore instance

        // ID de la date actuelle en string
        const id = Date.now().toString();

        const newNoteData = {
          id: id,
          note_title: title,
          note_text: newNote,
          image: newImage,
          link: newLink,
          username : username
        };

        // Using Firestore's `setDoc` function to write the document with `title` as the ID.
        const noteRef = doc(firestore, "notes", id);
        await setDoc(noteRef, newNoteData);

        console.log('Note added successfully!');
        //Redirect
        setOpen(true);
        navigate('/mynotes');

      } catch (error) {
        console.error("Error adding note:", error);
        // Handle errors here, e.g., display an error message to the user
      } finally {
        // Reset form state regardless of success or failure
        setTitle('');
        setNewNote('');
        setNewImage('');
        setNewLink('');
      }
    }
  };
  

  return (
      <div>
        <Button variant="contained" color="primary" onClick={handleMyNotesButtonClick}> Go back to notes </Button>
        <Paper elevation={3} style={{ margin: '1rem 0', padding: '1rem' }}>
          {/* Champ de saisie pour le titre de la note */}
          <TextField
            label="Titre de la note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            style={{ margin: '1rem 0' }}
          />

          {/* Champ de saisie pour le contenu de la note */}
          <TextField
            label="Note Content"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            fullWidth
            style={{ margin: '1rem 0' }}
            multiline  // Allow for multiple lines of input
            rows={20}
          />

          {/* Bouton pour afficher/masquer les champs optionnels */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowExtras(!showExtras)}
            style={{ margin: '1rem' }}
          >
            {showExtras ? "Masquer Extras" : "Ajouter Extras (Image/Lien)"}
          </Button>

          {/* Champs optionnels pour l'image et le lien (conditionnellement affichés) */}
          {showExtras && (
            <>
              {/* Champ de saisie pour l'URL de l'image */}
              <TextField
                label="Image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                fullWidth
                placeholder="http://example.com/image.jpg"
                style={{ margin: '1rem 0' }}
              />

              {/* Champ de saisie pour l'URL du lien */}
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

        {/* Bouton pour enregistrer la nouvelle note */}
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
              Note added successfully!
            </Alert>
          </Snackbar>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ margin: '1rem 0' }}>
            Créer une nouvelle note
          </Button>
        </Paper>
      </div>
  );
}

export default NoteForm;
