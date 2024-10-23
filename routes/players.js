const { addPlayer, getAllPlayers, getPlayerById, updatePlayerById, deletePlayerById } = require('../models/playerModel');
const express = require('express');

const router = express.Router();

router.post('/spiller', (req, res) => {
    const { navn, posisjon, alder } = req.body;

    if (!navn || !posisjon || !alder || typeof alder !== 'number') {
        return res.status(400).json({ error: 'Please provide valid name, position, and age.' });
    }

    addPlayer(navn, posisjon, alder, (err, result) => {
        if (err) {
            console.error('Error adding player:', err);
            return res.status(500).json({ error: 'Failed to add player.' });
        }
        res.status(201).json({ message: 'Player added successfully' });
    });
});


router.get('/spillere', (req, res) => {
    getAllPlayers((err, results) => {
        if (err) {
            console.error('Error fetching players:', err);
            return res.status(500).json({ error: 'Failed to fetch players' });
        }
        res.status(200).json(results); 
    });
});

router.get('/spiller/:id', (req, res) => {
       const playerId = req.params.id;

    getPlayerById(playerId, (err, result) => {
        if (err) {
            console.error('Error fetching player:', err);
            return res.status(500).json({ error: 'Failed to fetch player' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json(result[0]);
    });
});

router.put('/spiller/:id', (req, res) => {
    const playerId = req.params.id;
    const { navn, posisjon, alder } = req.body;

    if (!navn || !posisjon || !alder || typeof alder !== 'number') {
        return res.status(400).json({ error: 'Please provide valid name, position, and age.' });
    }

    updatePlayerById(playerId, { navn, posisjon, alder }, (err, result) => {
        if (err) {
            console.error('Error updating player:', err);
            return res.status(500).json({ error: 'Failed to update player.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json({ message: 'Player updated successfully' });
    });
});

router.delete('/spiller/:id', (req, res) => {
    const playerId = req.params.id;

    deletePlayerById(playerId, (err, result) => {
        if (err) {
            console.error('Error deleting player:', err);
            return res.status(500).json({ error: 'Failed to delete player.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json({ message: 'Player deleted successfully' });
    });
});

module.exports = router;