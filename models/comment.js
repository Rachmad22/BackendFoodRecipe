const db = require('../connection')

// CREATE comments
const addNewComments = async (params) => {
    const { name, komen } = params

    return await db`
        INSERT INTO comments (name, komen) 
        VALUES (${name}, ${komen})`
}
// get comments by ID
const getCommentsId = async (params) => {
    const { id } = params
    return await db`
    SELECT * FROM comments WHERE id = ${id}`
}
// get all comments with pagination
const getCommentsPagination = async (params) =>{
    const {limit, page, sort} = params
    return await db`SELECT*FROM comments ${sort ? db`ORDER BY date DESC` : db`ORDER BY date ASC`
} LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}
// get all comments without pagination
const getAllComments = async (params) =>{
    const { komen, sort} = params
    return await db`SELECT*FROM comments WHERE komen = ${komen} ${sort ? db`ORDER BY date DESC` : db`ORDER BY date ASC`
}`
}

// READ comments by name with pagination
const getCommentsName = async (params) => {
    const { name, page, limit, sort } = params
    return await db`
    SELECT * FROM comments WHERE name LIKE ${'%' + name + '%'} ${sort ? db`ORDER BY date DESC` : db`ORDER BY date ASC`
} LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}

// READ comments by comment with pagination
const getCommentsSort = async (params) => {
    const { komen, page, limit, sort } = params
    return await db`
    SELECT * FROM comments WHERE komen LIKE ${"%" + komen + "%"} ${sort ? db`ORDER BY komen DESC` : db`ORDER BY komen ASC`
        } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}

// UPDATE comments
const updateComments = async (params) => {
    const { id, name, komen, defaultValue } = params

    return await db`
            UPDATE comments SET
            "name" = ${name || defaultValue?.name},
            "komen" = ${komen || defaultValue?.komen}
        WHERE "id" = ${id}`
}

// DELETE comments
const deleteComments = async (params) => {
    const { id } = params
    return await db`DELETE FROM "public"."comments" WHERE "id" = ${id}`
}

module.exports = {
    addNewComments,
    getCommentsId,
    getCommentsPagination,
    getAllComments,
    getCommentsName,
    getCommentsSort,
    updateComments,
    deleteComments}