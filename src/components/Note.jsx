import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const noteStyle = {
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
  };
  
  function Note({ title, text, image, link }) {
    return (
      <Paper style={{ padding: '1rem', minHeight: '600px' }}> {/* Adjust styling as needed */}
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">{text}</Typography>
        {image && <img src={image} alt="" style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem' }} />}
        {link && <Typography variant="body2" style={{ marginTop: '1rem' }}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></Typography>}
      </Paper>
    );
  }

export default Note;
