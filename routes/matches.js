const express = require('express');
const { addMatch, getMatchesByTeam, getMatchesByPlayer } = require('../models/matchModel');
const router = express.Router();

router.post('/lag/kamp', (req, res) => {
    const { lagId, motstander, dato, sted } = req.body;

    if (!lagId || !motstander || !dato || !sted) {
        return res.status(400).json({ error: 'Please provide all required field.' });
    }

    addMatch(lagId, motstander, dato, sted, (err, result) => {
        if (err) {
            console.error('Error adding match:', err);
            return res.status(500).json({ error: 'Failed to register match.' });
        }
        res.status(201).json({ message: 'Match registered successfully.' });
    });
});

router.get('/lag/kamper', (req, res) => {
    const { lagId } = req.query;

    if (!lagId) {
        return res.status(400).json({ error: 'Please provide a valid team ID (lagId).' });
    }

    getMatchesByTeam(lagId, (err, results) => {
        if (err) {
            console.error('Error fetching matches:', err);
            return res.status(500).json({ error: 'Failed to fetch matches.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No matches found for this team.' });
        }

        res.status(200).json(results);
    });
});



router.get('/spiller/:id/kamper', (req, res) => {
    const playerId = req.params.id; 

    console.log('Received playerId:', playerId); 

    if (!playerId) {
        return res.status(400).json({ error: 'Please provide a valid player ID.' });
    }

    getMatchesByPlayer(playerId, (err, results) => {
        if (err) {
            console.error('Error fetching matches for player:', err);
            return res.status(500).json({ error: 'Failed to fetch matches.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No matches found for this player.' });
        }
        res.status(200).json(results); 
    });
});

module.exports = router;