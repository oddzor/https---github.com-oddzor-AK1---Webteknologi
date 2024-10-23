const db = require("../db");

function addTeam(navn, trener, callback) {
  const sql = "INSERT INTO teams (navn, trener) VALUES (?, ?)";
  db.query(sql, [navn, trener], callback);
}

function getAllTeams(callback) {
    const sql = 'SELECT * FROM teams';
    db.query(sql, callback);  
}

function addTeamPlayers(teamId, playerIds, callback) {
  const values = playerIds.map((playerId) => [teamId, playerId]);

  console.log("Inserting the following values into team_players:", values);

  const sql = "INSERT INTO team_players (team_id, player_id) VALUES (?, ?)";

  const promises = values.map((value) => {
    return new Promise((resolve, reject) => {
      db.query(sql, value, (err, result) => {
        if (err) {
          console.error("Error inserting into team_players:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  Promise.all(promises)
    .then((results) => callback(null, results))
    .catch((err) => callback(err));
}
function getTeamWithPlayers(teamId, callback) {
  const sql = `
        SELECT teams.id AS team_id, teams.navn AS team_name, teams.trener AS coach, 
               players.id AS player_id, players.navn AS player_name, players.posisjon AS player_position, players.alder AS player_age
        FROM teams
        LEFT JOIN team_players ON teams.id = team_players.team_id
        LEFT JOIN players ON team_players.player_id = players.id
        WHERE teams.id = ?`;

  db.query(sql, [teamId], callback);
}

function updateTeam(teamId, teamData, callback) {
    const { navn, trener } = teamData;
    const sql = 'UPDATE teams SET navn = ?, trener = ? WHERE id = ?';
    db.query(sql, [navn, trener, teamId], callback); 
}


function removeTeamPlayers(teamId, callback) {
    const sql = 'DELETE FROM team_players WHERE team_id = ?';
    db.query(sql, [teamId], callback);  
}


function addTeamPlayers(teamId, playerIds, callback) {
    const values = playerIds.map(playerId => [teamId, playerId]);
    const sql = 'INSERT INTO team_players (team_id, player_id) VALUES ?';
    db.query(sql, [values], callback);  
}

function deleteTeam(teamId, callback) {
    const sql = 'DELETE FROM teams WHERE id = ?';
    db.query(sql, [teamId], callback);
}


module.exports = { updateTeam, removeTeamPlayers, addTeamPlayers, getTeamWithPlayers, addTeam, getAllTeams, deleteTeam };
