// 1
const mysql = require('mysql')
const bcrypt = require('bcryptjs')

// 2
// LOCAL
// const dbDetails = {
//   connectionLimit : 10,
//   host     : process.env.MYSQL_HOST || 'localhost',
//   user     : process.env.MYSQL_USERNAME || 'beat_share_user',
//   password : process.env.MYSQL_PASSWORD || 'MyNewPass4!',
//   database : process.env.MYSQL_DATABASE || 'beat_share'
// }

// JAWSDB
const dbDetails = {
  connectionLimit : 10,
  host     : process.env.MYSQL_HOST || 'u6354r3es4optspf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : process.env.MYSQL_USERNAME || 'eb06q7awkdj3ix5n',
  password : process.env.MYSQL_PASSWORD || 'jrzxl1ebzw35ugry',
  database : process.env.MYSQL_DATABASE || 'vi3h30ak3urks7ul'
}

const connection = mysql.createConnection(dbDetails)



//Get all users
function allUsers(callback) {
    const query = `
      SELECT * 
      FROM users
    `
    connection.query(query, null, (error, results, fields) => {
      callback(error, results)
    })
  }

  exports.allUsers = allUsers

  //get user
  function getProfile(userId, callback) {
    const query = `
      SELECT users.id,
      users.user_name, 
      users.profile_picture,
      users.favourite_artist,
      users.favourite_song,
      users.user_bio
      FROM users
    `
    const params = [userId]

    connection.query(query, params, (error, results, fields) => {
      let x = results.filter(i => i.id === userId)
      callback(error, x)
    })
  }

exports.getProfile = getProfile

//
function createEdit(user, userdata , callback) {
  const query = `
    UPDATE users 
    SET user_name = ?, 
    profile_picture = ?,
    favourite_artist = ?,
    favourite_song = ?,
    user_bio = ? 
    WHERE id = ?
  `

    
  const params = [userdata.user_name, userdata.profile_picture, userdata.favourite_artist, userdata.favourite_song, userdata.user_bio, user.id]

  connection.query(query, params, function (error) {
    callback(error, userdata)
  })

}

exports.createEdit = createEdit

//Get all posts
function allPosts(callback) {
  const query = `
    
  SELECT
  posts.id, 
  users.user_name, 
  users.profile_picture,
  posts.img_url, 
  posts.song_name,
  posts.poster_id,
  posts.song_artist,
  posts.description, 
  COUNT(likes.post_id) as number_of_likes
  FROM posts
  JOIN users ON users.id = posts.poster_id
  LEFT JOIN likes ON posts.id = likes.post_id
  GROUP BY posts.id
  ORDER BY posts.created DESC
  LIMIT 20;
  `
  connection.query(query, null, (error, results, fields) => {
    callback(error, results)
  })
}

exports.allPosts = allPosts

// Get single user posts
function MyPosts(user, callback) {
  const query = `
     
  SELECT 
  posts.img_url, 
  posts.song_name,
  posts.id,
  posts.song_artist
  FROM posts
  JOIN users ON users.id = posts.poster_id
  WHERE poster_id = ?
  ORDER BY posts.created DESC
  `
  const params = [user.id]

  connection.query(query, params, (error, results, fields) => {
    callback(error, results)
  })
}



exports.MyPosts = MyPosts

// Get single user posts
function othersPosts(userId, callback) {
  const query = `
     
  SELECT 
  posts.img_url, 
  posts.song_name,
  posts.id,
  posts.song_artist
  FROM posts
  JOIN users ON users.id = posts.poster_id
  WHERE poster_id = ?
  ORDER BY posts.created DESC
  `
  const params = [userId]

  connection.query(query, params, (error, results, fields) => {
    callback(error, results)
  })
}



exports.othersPosts = othersPosts

// Delete a post 

function DeletePost(user, postId, callback) {
  const query = `
    DELETE FROM posts
    WHERE id = ?
  `

  const params = [postId]

  connection.query(query, params, function (error, result, fields) {
    callback(error)
  })

}

exports.DeletePost = DeletePost

 //Like a post

 function likePost(user, postId, callback) {
  const query = `
    INSERT INTO likes (post_id, user_id)
    VALUES (?, ?)
  `

    
  const params = [postId, user.id]

  connection.query(query, params, function (error, result, fields) {
    callback(error,result.insertId)
  })

}

exports.likePost = likePost

 //Like a post

 function unLikePost(user, postId, callback) {
  const query = `
    DELETE FROM likes
    WHERE post_id = ? AND
    user_id = ?
  `

  const params = [postId, user.id]

  connection.query(query, params, function (error, result, fields) {
    callback(error)
  })

}

exports.unLikePost = unLikePost

//Get specific posts
function getPost(postId, callback) {
  const query = `
    
  SELECT users.user_name,
  users.profile_picture,
  posts.poster_id,
  posts.song_name,
  posts.song_artist,
  posts.description
  FROM posts
  JOIN users ON users.id = posts.poster_id
  WHERE posts.id = ?;
  `

  const params = [postId]

  connection.query(query, params, (error, results, fields) => {
    callback(error, results)
  })
}

exports.getPost = getPost

//Get all comments
function allComments(postId, callback) {
  const query = `
    
  SELECT users.user_name,
  users.profile_picture,
  users.id,
  comments.message
  FROM comments
  JOIN users ON users.id = comments.user_id
  JOIN posts ON posts.id = comments.post_id
  WHERE post_id = ?;
  `

  const params = [postId]

  connection.query(query, params, (error, results, fields) => {
    callback(error, results)
  })
}

exports.allComments = allComments



//Login and find user

function getUser(user_name, password, callback){

  const query=`
  SELECT id, user_name, password
  FROM users
  WHERE user_name = ?
  `

  const params = [user_name]

  connection.query(query, params, (error, results, fields)=>{
    if(!results || results.length === 0){
      callback(Error("incorrect username"))
      return
    }
    const user = results[0]
    bcrypt.compare(password, user.password, (error, same)=>{
      if(error){
        callback(error)
        return
      }
      if(!same){
        callback(Error("incorrect password"))
        return
      }
      callback(null, user)
    })
  })
}

exports.getUser = getUser


//Sign up and create user

function createUser(user, img_url, callback) {
  console.log(user, img_url)

    const query = `
      INSERT INTO users (user_name, password, profile_picture, favourite_artist, favourite_song, user_bio)
      VALUES (?, ?, ?, ?, ?, ?)
    `

    bcrypt.hash(user.password, 12, (error, hashed) => {
      
      if(error) {
        callback(error)
        return
      }
      
    const params = [user.username, hashed, img_url, user.favourite_artist, user.favourite_song, user.user_bio]
  
    connection.query(query, params, function (error, result, fields) {
      callback(error,result.insertId, user)
    })
  })

}
  
 exports.createUser = createUser


 //Create Post

 function createPost(user, post , img_url, callback) {
  const query = `
    INSERT INTO posts (img_url, song_name, song_artist, description, poster_id)
    VALUES (?, ?, ?, ?, ?)
  `

    
  const params = [img_url, post.song_name, post.song_artist, post.description, user.id]

  connection.query(query, params, function (error, result, fields) {
    callback(error,result.insertId, post)
  })

}

exports.createPost = createPost



 //Create Comment

 function createComment(user, comment , postId, callback) {
  const query = `
    INSERT INTO comments (post_id, user_id, message)
    VALUES (?, ?, ?)
  `

    
  const params = [postId, user.id, comment.message]

  connection.query(query, params, function (error, result, fields) {
    callback(error,result.insertId, comment)
  })

}

exports.createComment = createComment


 //Grab users likes

 function usersLikes(user,callback) {



  const query = `
  SELECT
  posts.id as post_id
  FROM likes
  JOIN posts on posts.id = likes.post_id
  WHERE user_id = ?
  ORDER BY likes.created DESC
  `

    
  const params = [user.id]

  connection.query(query, params, function (error, result, fields) {
    callback(error,result)

  })

}

exports.usersLikes = usersLikes





