use beat_share;


-- INSERT INTO users (id, user_name, `password`, profile_picture,  favourite_artist, favourite_song)
-- VALUES
-- (1,'joele', 'codegod69', 'sdfjsaldkjsdfjl', "bobby shmurda", "Hurt"),
-- (2, 'rockymalubay', 'valorantmaster123', 'asfsdfsdf6969', "bobby shmurda", "Hurt"),
-- (3, 'kaierfle', 'participationmarks123', 'ajhdjsahkjds', "bobby shmurda", "Hurt"),
-- (4, 'justinnamoro', 'password123', 'asdfhjskdfhjksd', "bobby shmurda", "Hurt");

-- INSERT INTO posts (id, poster_id, img_url, song_name, song_artist, description)
-- VALUES
-- (2,  1,"sdfhjksdafhjkdasfh", "Bobby B", "Bobby Shmurda", "I fuckin love Billie Eilish");

-- INSERT INTO comments(id, message, post_id, user_id)
-- VALUES
-- (1, "I also love Billie Eilish", 1, 1);

INSERT INTO likes (id, post_id, user_id)
VALUES
(3, 8, 1);