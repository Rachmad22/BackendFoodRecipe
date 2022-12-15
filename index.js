const express = require('express')
const app = express() 
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const fileUpload = require('express-fileupload')
const path = require('path')

const port = 5000

const userRoutes = require('./routes/users')
const recipeRoutes = require('./routes/recipe')
const commentRoutes = require('./routes/comment')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// use helmet
app.use(helmet())

// use xss clean
app.use(xss())

// cors for everyone
app.use(cors())

// use middleware for grant access upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)

// grant access for public
app.use('/images', express.static(path.join(__dirname, 'public')))


app.use('/users', userRoutes)

app.use('/recipes', recipeRoutes)

app.use('/comments', commentRoutes)


// menjalankan express pada port variable diatas
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
