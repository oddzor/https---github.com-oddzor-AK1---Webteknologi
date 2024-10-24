CREATE DATABASE IF NOT EXISTS arbeidskrav_odd_grimholt;

USE arbeidskrav_odd_grimholt;

-- Create the users table
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

INSERT INTO players (navn, posisjon, alder) VALUES 
('Odd Grimholt', 'midtbane', 20),
('Kristian Hansen', 'forsvar', 23),
('Ollie Olesen', 'angrep', 25);

CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    navn VARCHAR(100) NOT NULL,       
    trener VARCHAR(100) NOT NULL
);

INSERT INTO teams (navn, trener) VALUES 
('Tønsberg United', 'Odd Grimholt'),
('Oslo FC', 'Kristian Hansen');

CREATE TABLE IF NOT EXISTS team_players (
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, player_id)
);

INSERT INTO team_players (team_id, player_id) VALUES 
(1, 1), 
(1, 2),
(1, 3),  
(2, 2),  
(2, 3); 

-- Create the matches table
CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lag_id INT NOT NULL,                   
    motstander VARCHAR(100) NOT NULL,      
    dato DATE NOT NULL,                    
    sted VARCHAR(100) NOT NULL,     
    FOREIGN KEY (lag_id) REFERENCES teams(id) ON DELETE CASCADE  
);

INSERT INTO matches (lag_id, motstander, dato, sted) VALUES 
(1, 'Sande FC', '2024-12-15', 'Old Trafford'),
(1, 'Drammen United', '2024-12-20', 'Strømsgodset Stadion'),
(2, 'Galatasaray', '2024-12-21', 'Ullevål Stadion'),
(2, 'Gokstad FC', '2024-12-22', 'Emirates Arena');