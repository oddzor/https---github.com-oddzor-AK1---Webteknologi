const express = require('express');
const { updateTeam, addTeamPlayers, removeTeamPlayers, getTeamWithPlayers, getAllTeams, deleteTeam } = require('../models/teamModel');
const { getPlayerById } = require('../models/playerModel'); 
const router = express.Router();


router.post('/lag', (req, res) => {
    const { navn, trener, spillere } = req.body;

    if (!navn || !trener || !Array.isArray(spillere) || spillere.length === 0) {
        return res.status(400).json({ error: 'Please provide a valid team name, coach, and a list of player IDs.' });
    }


    addTeam(navn, trener, (err, result) => {
        if (err) {
            console.error('Error creating team:', err);
            return res.status(500).json({ error: 'Failed to create team.' });
        }

        const teamId = result.insertId;  

        const playerValidationPromises = spillere.map(playerId => {
            return new Promise((resolve, reject) => {
                getPlayerById(playerId, (err, result) => {
                    if (err || result.length === 0) {
                        reject(`Player with ID ${playerId} not found.`);
                    } else {
                        resolve();
                    }
                });
            });
        });

        Promise.all(playerValidationPromises)
            .then(() => {
                console.log('Associating the following players with the team:', spillere);
                addTeamPlayers(teamId, spillere, (err) => {
                    if (err) {
                        console.error('Error associating players with team:', err);
                        return res.status(500).json({ error: 'Failed to associate players with team.' });
                    }
                    res.status(201).json({ message: 'Team created and players associated successfully.' });
                });
            })
            .catch(errorMessage => {
                return res.status(400).json({ error: errorMessage });
            });
    });
});

router.get('/lag', (req, res) => {
    getAllTeams((err, results) => {
        if (err) {
            console.error('Error fetching teams:', err);
            return res.status(500).json({ error: 'Failed to fetch teams.' });
        }
        res.status(200).json(results);
    });
});

router.get('/lag/:id', (req, res) => {
    const teamId = req.params.id;

    getTeamWithPlayers(teamId, (err, results) => {
        if (err) {
            console.error('Error fetching team details:', err);
            return res.status(500).json({ error: 'Failed to fetch team details.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }
        const team = {
            id: results[0].team_id,
            navn: results[0].team_name,
            trener: results[0].coach,
            spillere: results.map(result => ({
                id: result.player_id,
                navn: result.player_name,
                posisjon: result.player_position,
                alder: result.player_age
            }))
        };

        res.status(200).json(team);
    });
});

router.put('/lag/:id', (req, res) => {
    const teamId = req.params.id;
    const { navn, trener, spillere } = req.body;

    // Validate input
    if (!navn || !trener || !Array.isArray(spillere) || spillere.length === 0) {
        return res.status(400).json({ error: 'Please provide valid team name, coach, and a list of player IDs.' });
    }


    updateTeam(teamId, { navn, trener }, (err, result) => {
        if (err) {
            console.error('Error updating team:', err);
            return res.status(500).json({ error: 'Failed to update team details.' });
        }


        removeTeamPlayers(teamId, (err) => {
            if (err) {
                console.error('Error removing existing players from team:', err);
                return res.status(500).json({ error: 'Failed to remove existing players.' });
            }

            const playerValidationPromises = spillere.map(playerId => {
                return new Promise((resolve, reject) => {
                    getPlayerById(playerId, (err, result) => {
                        if (err || result.length === 0) {
                            reject(`Player with ID ${playerId} not found.`);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            Promise.all(playerValidationPromises)
                .then(() => {
                    addTeamPlayers(teamId, spillere, (err) => {
                        if (err) {
                            console.error('Error associating players with team:', err);
                            return res.status(500).json({ error: 'Failed to associate players with team.' });
                        }
                        res.status(200).json({ message: 'Team updated successfully with new players.' });
                    });
                })
                .catch(errorMessage => {
                    return res.status(400).json({ error: errorMessage });
                });
        });
    });
});

router.delete('/lag/:id', (req, res) => {
    const teamId = req.params.id;

    deleteTeam(teamId, (err, result) => {
        if (err) {
            console.error('Error deleting team:', err);
            return res.status(500).json({ error: 'Failed to delete team.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team deleted successfully.' });
    });
});

module.exports = router;