import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, TextField, Container, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('/api/profile', { withCredentials: true });
        console.log('API Response:', response.data);
        setProfileData(response.data.data?.currentUser || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch profile data');
        }
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!profileData) return <Typography>No profile data available</Typography>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" gutterBottom>
          Welcome, {profileData.player?.gamerTag || profileData.name || 'User'}!
        </Typography>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar 
                src={profileData.images?.find(img => img.type === 'profile')?.url} 
                alt={profileData.player?.gamerTag || profileData.name || 'User'}
                sx={{ width: 200, height: 200 }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gamertag"
                  value={profileData.player?.gamerTag || ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={profileData.name || ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  value={profileData.bio || ''}
                  InputProps={{ readOnly: true }}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={profileData.location?.city || ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={profileData.location?.country || ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Birthday"
                  value={profileData.birthday || ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gender Pronoun"
                  value={profileData.genderPronoun || ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Profile;