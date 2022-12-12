const express = require('express')
const app = express() 
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
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

app.use('/users', userRoutes)

app.use('/recipes', recipeRoutes)

app.use('/comments', commentRoutes)


// // CREATE new account
// app.post('/users/add', async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body

//     const addToDb = await db`
//         INSERT INTO account (name, email, password, phone) 
//         VALUES (${name}, ${email}, ${password}, ${phone})
//     `

//     res.json({
//       status: true,
//       message: 'Registration succeed',
//       data: addToDb
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })
// // READ
// // LOGIN
// app.post('/login/:email?/:password?', async (req, res) => {
//   try {
//     const { email, password } = req.params

//     if (email && password) {
//       const getSelectedUser = await db`SELECT * FROM account WHERE email = ${email}`
//       if (`${password}` === getSelectedUser[0]?.password) {
//         res.status(200).json({
//           status: true,
//           message: 'data berhasil di ambil ',
//           data: getSelectedUser[0]
//         })
//       } else {
//         throw 'email and password doesnt match !'
//       }
//     } else {
//       const getAllRecipes = await db`SELECT * FROM recipes`

//       if (getAllRecipes) {
//         res.status(200).json({
//           status: true,
//           message: 'data berhasil di ambil',
//           data: getAllRecipes
//         })
//       }
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })
// // READ
// // masuk ke profile user
// app.get('/users/:name?', async (req, res) => {
//   try {
//     const { name } = req.params
//     const { page, limit, sort } = req.query
//     if (name) {
//       const getSelectedUser = await db`SELECT * FROM account WHERE name = ${name}`
//       res.status(200).json({
//         status: true,
//         message: 'data berhasil di ambil',
//         data: getSelectedUser
//       })
//     } else {
//       let getAllUser

//       if (limit && page) {
//         getAllUser = await db`SELECT * FROM account ${
//           sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
//         } LIMIT ${limit} OFFSET ${limit * (page - 1)} `
//       } else {
//         getAllUser = await db`SELECT * FROM account ${
//           sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
//         }`
//       }

//       if (getAllUser.length > 0) {
//         res.status(200).json({
//           status: true,
//           message: 'data berhasil di ambil',
//           total: getAllUser?.length,
//           page: page,
//           limit: limit,
//           data: getAllUser,
//         })
//       } else {
//         throw 'Data kosong silahkan coba lagi'
//       }
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })

// // UPDATE profile user

// app.patch('/user/edit/:id?', async (req, res) => {
//   try {
//     const { id } = req.params
//     const { name, email, phone, password, photo } = req.body

//     const getUser = await db`SELECT * FROM account WHERE id = ${id}`

//     if (getUser) {
//       // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("")
//       await db`
//             UPDATE account SET
//             "name" = ${name || getUser[0]?.name},
//             "email" = ${email || getUser[0]?.email},
//             "phone" = ${phone || getUser[0]?.phone},
//             "password" = ${password || getUser[0]?.password},
//             "photo" = ${photo || getUser[0]?.photo}
//         WHERE "id" = ${id};
// `
//     } else {
//       throw 'ID not registered'
//     }

//     res.json({
//       status: true,
//       message: 'Data updated successfully'
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })

// //  DELETE akun user

// app.delete('/user/delete/:id?', async (req, res) => {
//   try {
//     const { id } = req.params

//     await db`DELETE FROM "public"."account" WHERE "id" = ${id}`

//     res.json({
//       status: true,
//       message: 'account has been deleted'
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })
// // CREATE recipes
// app.post('/recipes/add', async (req, res) => {
//   try {
//     const { recipe, ingredient, photo, videos } = req.body

//     const addToDb = await db`
//         INSERT INTO recipes (recipe, ingredient, photo, videos) 
//         VALUES (${recipe}, ${ingredient}, ${photo}, ${videos})
//     `

//     res.json({
//       status: true,
//       message: 'adding recipe succeed',
//       data: addToDb
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })
// // READ recipes berdasar nama
// app.get('/recipes/:recipe?', async (req, res) => {
//   try {
//     const { recipe } = req.params
//     const { page, limit, sort } = req.query

//     if (recipe) {
//       const getSelectedRecipes = await db`SELECT * FROM recipes WHERE recipe LIKE ${'%' + recipe + '%'}`
//       res.status(200).json({
//         status: true,
//         message: 'data successfully displayed',
//         data: getSelectedRecipes
//       })
//     } else {
//       let getAll

//       if (limit && page) {
//         getAll = await db`SELECT * FROM recipes ${
//           sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
//         } LIMIT ${limit} OFFSET ${limit * (page - 1)} `
//       } else {
//         getAll = await db`SELECT * FROM recipes ${
//           sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
//         }`
//       }

//       if (getAll.length > 0) {
//         res.status(200).json({
//           status: true,
//           message: 'data successfully displayed',
//           total: getAll?.length,
//           page: page,
//           limit: limit,
//           data: getAll,
//         })
//       } else {
//         throw 'Data is empty'
//       }
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// }
// )

// // pengurutan recipes bedasar nama dan tgl upload
// app.get('/recipes/sort/:recipe?', async (req, res) => {
//   try {
//     const { recipe } = req.params
//     const { sort } = req.query

//     if (recipe) {
//       const getSortedRecipes = await db`SELECT * FROM recipes WHERE recipe LIKE ${'%' + recipe + '%'} ${sort ? db`ORDER BY date_uploud DESC` : db`ORDER BY date_uploud ASC`}`

//       res.status(200).json({
//         status: true,
//         message: 'data successfully displayed',
//         data: getSortedRecipes
//       })
//     } else {
//       const getSelectedRecipes = await db`SELECT * FROM recipes ${sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`}`
//       res.status(200).json({
//         status: true,
//         message: 'data successfully displayed',
//         data: getSelectedRecipes
//       })
//     }

//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }

// }
// )
// // UPDATE recipes
// app.patch('/user/updaterecipes/:id?', async (req, res) => {
//   try {
//     const { id } = req.params
//     const { recipe, ingredient, photo, videos } = req.body

//     const getRecipes = await db`SELECT * FROM recipes WHERE id = ${id}`

//     if (getRecipes) {
//       await db`
//             UPDATE recipes SET
//             "recipe" = ${recipe || getRecipes[0]?.recipe},
//             "ingredient" = ${ingredient || getRecipes[0]?.ingredient},
//             "photo" = ${photo || getRecipes[0]?.photo},
//             "videos" = ${videos || getRecipes[0]?.videos}
//         WHERE "id" = ${id};
// `
//     } else {
//       throw 'ID not registered'
//     }

//     res.json({
//       status: true,
//       message: 'Data updated successfully'
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })
// // DELETE recipes
// app.delete('/recipes/delete/:id?', async (req, res) => {
//   try {
//     const { id } = req.params

//     await db`DELETE FROM "public"."recipes" WHERE "id" = ${id}`

//     res.json({
//       status: true,
//       message: 'account has been deleted'
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })

// // CREATE comment
// app.post('/recipes/comments', async (req, res) => {
//   try {
//     const { name, comment } = req.body

//     const addComToDb = await db`
//         INSERT INTO comments (name, comment) 
//         VALUES (${name}, ${comment})
//     `

//     res.json({
//       status: true,
//       message: 'adding comment succeed',
//       data: addComToDb
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })
// // READ mencari comment berdasar nama
// app.get('/recipes/comments/:name?', async (req, res) => {
//   try {
//     const { name } = req.params
//     const { page, limit, sort } = req.query

//     if (name) {
//       const getSelectedName = await db`SELECT * FROM comments WHERE name LIKE ${'%' + name + '%'}`
//       res.status(200).json({
//         status: true,
//         message: 'data successfully displayed',
//         data: getSelectedName
//       })
//     } else {
//       let getAll

//       if (limit && page) {
//         getAll = await db`SELECT * FROM comments ${
//           sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
//         } LIMIT ${limit} OFFSET ${limit * (page - 1)} `
//       } else {
//         getAll = await db`SELECT * FROM comments ${
//           sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
//         }`
//       }

//       if (getAll.length > 0) {
//         res.status(200).json({
//           status: true,
//           message: 'data successfully displayed',
//           total: getAll?.length,
//           page: page,
//           limit: limit,
//           data: getAll,
//         })
//       } else {
//         throw 'Data is empty'
//       }
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })

//   }
// })
// // pencarian comment berdasar comment
// app.get('/recipes/comments/user/:comment?', async (req, res) => {
//   try {
//     const { comment } = req.params

//     if (comment) {
//       const getSelectedCom = await db`SELECT * FROM comments WHERE comment LIKE ${'%' + comment + '%'}`
//       res.status(200).json({
//         status: true,
//         message: 'data successfully displayed',
//         data: getSelectedCom

//       })
//     } else {
//       const getAll = await db`SELECT * FROM comments`
//       res.status(200).json({
//         status: true,
//         message: 'data successfully displayed',
//         data: getAll
//       })
//     }

//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })

//   }
// })
// // UPDATE comment
// app.patch('/user/updatecomment/:name?', async (req, res) => {
//   try {
//     const { name } = req.params
//     const { comment } = req.body

//     const getCom = await db`SELECT * FROM comments WHERE name = ${name}`

//     if (getCom) {
//       await db`
//             UPDATE comments SET
//             "comment" = ${comment || getCom[0]?.comment}
//         WHERE "name" = ${name};
// `
//     } else {
//       throw 'ID not registered'
//     }

//     res.json({
//       status: true,
//       message: 'Data updated successfully'
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })
// // DELETE comment
// app.delete('/user/delete/:id?', async (req, res) => {
//   try {
//     const { id } = req.params

//     await db`DELETE FROM "public"."comments" WHERE "id" = ${id}`

//     res.json({
//       status: true,
//       message: 'comment has been deleted'
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: []
//     })
//   }
// })

// aku menjalankan express pada port variable diatas
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
