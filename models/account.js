const db = require('../connection') // import dari file ./db.js

// Get all users with pagination
const getAllUsersPagination = async (params) => {
  const { limit, page, sort } = params

  return await db`SELECT * FROM account ${sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
    } LIMIT ${limit} OFFSET ${limit * (page - 1)} `
}

// get all users without pagination
const getAllUsers = async (params) => {
  const { sort } = params

  return await db`SELECT * FROM account ${sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
    }`
}

// get selected users by id
const getUserById = async (params) => {
  const { id } = params

  return await db`
  SELECT * FROM account WHERE id = ${id}`
}
// get user by email
const getUserEmail = async (params) => {
  const { email } = params

  return await db`
      SELECT * FROM account WHERE email = ${email}
    `
}

// get selected users by name
const getUserByEmail = async (params) => {
  const { email } = params

  return await db`
      SELECT email FROM account WHERE email = ${email}
    `
}

// get selected users by name
const getUserByName = async (params) => {
  const { name } = params

  return await db`
      SELECT * FROM account WHERE name LIKE ${"%" +name+ "%"}
    `
}

// add new user to db
const addNewUsers = async (params) => {
  const { name, email, phone, password } = params

  return await db`
      INSERT INTO account (name, email, password, phone) 
      VALUES (${name}, ${email}, ${password}, ${phone})
    `
}

// update user
const updateUser = async (params) => {
  const { name, email, phone, password, photo, id, defaultValue } = params
  return await db`
    UPDATE account SET
      "name" = ${name || defaultValue?.name},
      "email" = ${email || defaultValue?.email},
      "phone" = ${phone || defaultValue?.phone},
      "password" = ${password || defaultValue?.password},
      "photo" = ${photo || defaultValue?.photo}
    WHERE "id" = ${id};
  `
}

// delete user by id
const deleteUserById = async (params) => {
  const { id } = params

  return await db`DELETE FROM "public"."account" WHERE "id" = ${id}`
}





module.exports = {
  getAllUsersPagination,
  getUserByEmail,
  getUserEmail,
  getAllUsers,
  getUserById,
  getUserByName,
  addNewUsers,
  deleteUserById,
  updateUser,
}
