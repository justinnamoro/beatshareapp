SELECT id, 
user_name, 
`password`, 
profile_picture
FROM users
WHERE id;



SELECT posts.id, 
users.user_name, 
posts.img_url, 
posts.description, 
comments.message,
comments.user_id
FROM posts
JOIN users ON users.id = posts.user_id
LEFT JOIN likes ON posts.id = likes.post_id
LEFT JOIN comments ON posts.id = comments.post_id
ORDER BY posts.created DESC
LIMIT 20;

    
  // SELECT posts.id, 
  // users.user_name, 
  // users.profile_picture,
  // posts.img_url, 
  // posts.song_name,
  // posts.song_artist,
  // posts.description,
  // posts.poster_id
  // FROM posts
  // JOIN users ON users.id = posts.poster_id
  // ORDER BY posts.created DESC





SELECT posts.id,
posts.description, 
posts.img_url,
comments.message, 
users.user_name, 
users.profile_picture,
likes.user_id
FROM posts
JOIN users ON users.id = posts.user_id
LEFT JOIN likes ON posts.id = likes.id
LEFT JOIN comments ON posts.id = comments.post_id
WHERE posts.id = 2;