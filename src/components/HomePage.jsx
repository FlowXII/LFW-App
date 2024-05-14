import React from 'react';
import LFWLogout from './LFWLogout';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage({ user, setUser }) {
    return (
        <div>
            <h1>Main Page</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.displayName ? user.displayName : "Guest"}!</p>
                    <Button variant="contained" color="primary" component={Link} to="/createnote">Create a note</Button>
                    <LFWLogout setUser={setUser} />
                    <Link to="/mynotes"> Go to my notes </Link>
                </div>
            ) : (
                <div>
                    <p>Welcome, Guest! You need to log in to access the note form.</p>
                    <Link to="/login">Go to Login Page</Link>
                </div>
            )}
        </div>
    );
}

export default HomePage;