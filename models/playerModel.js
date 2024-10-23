const db = require('../db');


function addPlayer(navn, posisjon, alder, callback) {
    const sql = 'INSERT INTO players (navn, posisjon, alder) VALUES (?, ?, ?)';
    db.query(sql, [navn, posisjon, alder], callback); 
}

function getAllPlayers(callback) {
    const sql = 'SELECT * FROM players';
    db.query(sql, callback);  
}

function getPlayerById(playerId, callback) {
    const sql = 'SELECT * FROM players WHERE id = ?';
    db.query(sql, [playerId], callback);
}

function updatePlayerById(playerId, playerData, callback) {
    const { navn, posisjon, alder } = playerData;
    const sql = 'UPDATE players SET navn = ?, posisjon = ?, alder = ? WHERE id = ?';
    db.query(sql, [navn, posisjon, alder, playerId], callback);
}

function deletePlayerById(playerId, callback) {
    const sql = 'DELETE FROM players WHERE id = ?';
    db.query(sql, [playerId], callback); 
}

module.exports = { addPlayer, getAllPlayers, getPlayerById, updatePlayerById, deletePlayerById };