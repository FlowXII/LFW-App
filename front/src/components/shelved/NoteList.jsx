import React from 'react';
import { Grid } from '@mui/material';
import Note from './Note';

function NoteList({ notes }) {
  return (
    <Grid container spacing={2}>
      {notes.map((note, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}> {/* Adjust grid sizing as needed */}
          <Note title={note.title} text={note.text} image={note.image} link={note.link} />
        </Grid>
      ))}
    </Grid>
  );
}

export default NoteList;
