const db = require('../db');

function addMatch(lagId, motstander, dato, sted, callback) {
    const sql = 'INSERT INTO matches (lag_id, motstander, dato, sted) VALUES (?, ?, ?, ?)';
    db.query(sql, [lagId, motstander, dato, sted], callback);  
}

function getMatchesByTeam(lagId, callback) {
    const sql = 'SELECT * FROM matches WHERE lag_id = ?';
    db.query(sql, [lagId], callback); 
}

function getMatchesByPlayer(playerId, callback) {
    const sql = `
        SELECT matches.id, matches.lag_id, matches.motstander, matches.dato, matches.sted
        FROM matches
        INNER JOIN team_players ON team_players.team_id = matches.lag_id
        WHERE team_players.player_id = ?
    `;

    db.query(sql, [playerId], callback); 
}

module.exports = { addMatch, getMatchesByTeam, getMatchesByPlayer };
