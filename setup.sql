CREATE DATABASE IF NOT EXISTS arbeidskrav_odd_grimholt;

USE arbeidskrav_odd_grimholt;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    navn VARCHAR(100),
    e_post VARCHAR(100),
    passord VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    navn VARCHAR(100),
    posisjon VARCHAR(100),
    alder INT
);

CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    navn VARCHAR(100) NOT NULL,       
    trener VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS team_players (
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, player_id)
);

CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lag_id INT NOT NULL,                   
    motstander VARCHAR(100) NOT NULL,      
    dato DATE NOT NULL,                    
    sted VARCHAR(100) NOT NULL,     
    FOREIGN KEY (lag_id) REFERENCES teams(id) ON DELETE CASCADE  
);

CREATE USER IF NOT EXISTS 'student'@'localhost' IDENTIFIED BY 'Rm61C64(ei(J';
GRANT ALL PRIVILEGES ON arbeidskrav_odd_grimholt.* TO 'student'@'localhost';


