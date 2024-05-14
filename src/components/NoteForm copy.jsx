import React, { useState } from 'react';
import { Paper, TextField, Button } from '@mui/material';
import { collection, addDoc, getFirestore } from "firebase/firestore"

// Composant pour créer une nouvelle note
function NoteForm({ addNote, firestore }) {
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

  // Fonction pour ajouter les notes à la collection
  async function add_note_to_collection(notesCollection,firestore) {
    console.log(notesCollection)
    try {
      const notesRef = collection(firestore, notesCollection); // Use firestore instance to create the reference
      const docRef = await addDoc(collection(notesCollection, "note_content"), {
        note_title: "Writing Firestore",
        note_text: "This is an in-depth test on writing into the collection",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
  
  const handleSubmit = async () => {
    if (newNote && title) {
      try {
        // Add note to external function (assuming addNote handles logic)
        addNote({ title, text: newNote, image: newImage, link: newLink });
  
        const firestore = await getFirestore(); // Wait for firestore instance
        const notesRef = collection(firestore, "notes");
        const newNoteData = {  // Create an object with user input
          note_title: title,
          note_text: newNote,
          // Add optional fields if applicable
          // image: newImage,
          // link: newLink,
        };
        await add_note_to_collection(notesRef, firestore, newNoteData);
        console.log('Note added successfully!');
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
        label="Contenu de la note"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        fullWidth
        style={{ margin: '1rem 0' }}
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
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ margin: '1rem 0' }}>
        Créer une nouvelle note
      </Button>
    </Paper>
  );
}

export default NoteForm;
