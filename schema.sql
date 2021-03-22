DROP DATABASE IF EXISTS beat_share;
CREATE DATABASE beat_share;

-- CREATE USER 'beat_share_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MyNewPass4!';
-- GRANT ALL PRIVILEGES ON beat_share.* TO 'beat_share_user'@'localhost';

USE beat_share;

DROP TABLE IF EXISTS users; 

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255) NOT NULL,
  favourite_artist VARCHAR(255) NOT NULL,
  favourite_song VARCHAR(255) NOT NULL,
  user_bio VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS posts; 

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    poster_id INT NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    song_name VARCHAR(255) NOT NULL,
    song_artist VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (poster_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS comments; 

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) 
);


DROP TABLE IF EXISTS likes; 

CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
	user_id INT NOT NULL,
    post_id INT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);