require('dotenv').config()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const express = require('express')
const jwt = require('./jwt')
const database = require('./mysqlDatabase')
const app = express()
app.use(express.json())
app.use(express.static('build'))

app.use('/static', express.static(path.join(__dirname, 'public')))


app.use('/', function(req, res, next) {
  
  var origin = req.headers.origin;
	
  res.setHeader('Access-Control-Allow-Origin', origin || "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type , Authorization', 'text/javascript');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.get('/api/authorize', jwt.authorize, async (req, res) => {
const user = req.user
res.send(user)
 
})

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname,'build/index.html'))
// })

app.get('/images/:filename', (req, res)=>{
  
  const filename = req.params.filename
  console.log(filename)

  const readStream = fs.createReadStream(path.join(__dirname, 'uploads', filename))
  readStream.pipe(res)
})


app.get('/user/images/:filename', (req, res)=>{
  
  const filename = req.params.filename

  const readStream = fs.createReadStream(path.join(__dirname, 'uploads', filename))
  readStream.pipe(res)
})

app.get('/Post/Comments/images/:filename', (req, res)=>{
  
  const filename = req.params.filename
  console.log(filename)

  const readStream = fs.createReadStream(path.join(__dirname, 'uploads', filename))
  readStream.pipe(res)
})


//Create posts

app.post('/api/create_post', upload.single('image'), jwt.authorize, (req, res) => {
  
  const {filename, path} = req.file
  const post = req.body
  const user = req.user
  const img_url = `images/${filename}`
  console.log(req.file)

  database.createPost(user, post, img_url, (error, postId, post)=>{

    if (error) {
      res.send({error})
      return
    }

    post.id = postId
    res.send({
      id:postId,
      description:post.description,
      song_artist:post.song_artist,
      song_name:post.song_name,
      img_url
    }) 

  })

})

// Create a new user
app.post('/api/create_user', upload.single('image'), function(req, res) {
  
  const {filename, path} = req.file
  const img_url = `images/${filename}`
  const user = req.body

  console.log(req.file)

  database.createUser(user, img_url, (error, userId, user)=>{

    if (error) {
      res.send({error})
      return
    }

  
    user.id = userId


  const accessToken = jwt.generateToken({id: user.id, username: user.user_name, password: user.password, profile_picture: user.profile_picture, bio: user.user_bio})
  res.send({ accessToken: accessToken, user:user })
  })

})



// Get all Users
app.get('/api/users',  (req, res) => {

  database.allUsers((error, members)=>{

    if(error){
      res.send({error})
      return
    }

    res.send({members})
  })
})

//individual user
app.get('/api/user/:id',jwt.authorize, async(req, res) => {

  const userId = parseInt(req.params.id)

  database.getProfile(userId, (error, user)=>{

    if(error){
      res.send({error})
      return
    }

    res.send(user)
  })
})


//Grab users likes
app.post('/api/user/likes',jwt.authorize, async(req, res) => {

  const user = req.user


  database.usersLikes(user, (error, posts)=>{

    if(error){
      res.send({error})
      return
    }

    res.send(posts)
  })
})




//edit
app.patch('/api/user/edit', jwt.authorize, async (req, res) => {
  const userdata = req.body
  const user = req.user

  database.createEdit(user, userdata,(error, data)=>{

    if (error) {
      res.send({error})
      return
    }

    res.send({data}) 

  })



})

// Get all Posts
app.get('/api/posts',  (req, res) => {

  database.allPosts((error, posts)=>{

    if(error){
      res.send({error})
      return
    }

    res.send({posts})
  })
})

// Like a post
app.post('/api/like/:id', jwt.authorize,  (req, res) => {
  
  const user = req.user
  const postId = parseInt(req.params.id)

  database.likePost(user, postId, (error, like)=>{

    if(error){
      res.send({error})
      return
    }

    res.send({like})
  })
})

// UnLike a post
app.delete('/api/like/:id', jwt.authorize,  (req, res) => {
  
  const user = req.user
  const postId = parseInt(req.params.id)

  database.unLikePost(user, postId, (error)=>{

    if(error){
      res.send({error})
      return
    }

    res.send("post unliked")
  })
})

// Get a specific post
app.get('/api/posts/:id',  (req, res) => {

  const postId = parseInt(req.params.id)

  database.getPost(postId, (error, post)=>{

    if(error){
      res.send({error})
      return
    }

    res.send(post)
  })
})

// Login Authentication
app.post('/api/login', function(req, res) {

    const {user_name, password} = req.body
    
    // get the user from the database
    database.getUser(user_name, password, (error, user)=>{
      console.log(user)
      if(error){
        res.send(error.message)
        return
      }
      
      const accessToken = jwt.generateToken({ id:user.id, username: user.user_name })
      res.send({ accessToken: accessToken, user:user})
    })

  
})



// Post a comment
app.post('/api/comment/:id', jwt.authorize, async (req, res) => {
  const comment = req.body
  const postId = parseInt(req.params.id)
  const user = req.user

  database.createComment(user, comment, postId, (error, commentId, comment)=>{

    if (error) {
      res.send({error})
      return
    }

    comment.id = commentId
    res.send({comment: comment, user: user.id}) 

  })



})


// Get all comments from a post
app.get('/api/comments/:id',  (req, res) => {

  const postId = parseInt(req.params.id)

  database.allComments(postId, (error, comments)=>{

    if(error){
      res.send({error})
      return
    }

    res.send({comments})
  })
})




// Get Single User's Posts

app.get('/api/myposts', jwt.authorize, async(req, res)=>{
  const user = req.user

  database.MyPosts(user,(error, post)=>{

    if (error) {
      res.send({error})
      return
    }

    res.send({posts: post}) 

  })
})



// Get Others User's Posts

app.get('/api/userPosts/:id', jwt.authorize, async(req, res)=>{
 
  const userId = parseInt(req.params.id)

  database.othersPosts(userId,(error, post)=>{

    if (error) {
      res.send({error})
      return
    }

    res.send({posts: post}) 

  })
})


// Delete a post
app.delete('/api/posts/:id', jwt.authorize,  async(req, res) => {
  
  const postId = parseInt(req.params.id)
  const user = req.user

  database.DeletePost(user, postId, (error, postId, post)=>{

    if(error){
      res.send({error})
      return
    }

    res.send("post deleted")
  })
})



var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});
