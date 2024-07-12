const express = require('express');
const router = express.Router();
const protectedMiddleware = require('../middleware/protectedMiddleware'); // Correctly assuming this is the authentication middleware

// Adjusted protected route to match the expected endpoint '/protected/token'
router.get('/token', protectedMiddleware, (req, res) => {
    // Access user data from req.userData set by the protectedMiddleware
    const userData = req.userData;
    
    // Respond with some protected data
    res.json({
        message: 'You have accessed a protected route!',
        userData: userData
    });
});

module.exports = router;