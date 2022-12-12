const db = require('../connection')
// CREATE recipes
const addNewRecipes = async (params) => {
    const { name, ingredient, videos } = params

    return await db`
    INSERT INTO recipes (name, ingredient, videos) 
    VALUES (${name}, ${ingredient}, ${videos})
    `
}
// get recipes by ID
const getRecipesById = async (params) => {
    const { id } = params
    return await db`
      SELECT * FROM recipes WHERE id = ${id}`
}
// get all recipes with pagination
const getRecipesPagination = async (params) =>{
    const {limit, page, sort} = params
    return await db`
    SELECT * FROM recipes ${sort ? db`ORDER BY name, date_uploud DESC` : db`ORDER BY name, date_uploud ASC`
      } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}
// get all recipes without pagination
const getAllRecipes = async (params) =>{
    const {sort} = params
    return await db`
    SELECT * FROM recipes ${sort ? db`ORDER BY date_uploud DESC` : db`ORDER BY date_uploud ASC`} `
}
// READ recipes by name
const getRecipesByName = async (params) => {
    const { name, sort } = params

    return await db`
    SELECT * FROM recipes WHERE name LIKE ${"%"+name+"%"} ${sort ? db`ORDER BY name, date_uploud DESC` : db`ORDER BY name, date_uploud ASC`}`
}

// READ recipes sort by name & date
const getRecipesSort = async (params) => {
    const { sort } = params
    return await db`
    SELECT * FROM recipes ${sort ? db`ORDER BY name, date_uploud DESC` : db`ORDER BY name, date_uploud ASC`} `
}

// UPDATE recipes
const updateRecipes = async (params) => {
    const { id, name, ingredient, photo, videos, defVal } = params

    return await db`
    UPDATE recipes SET
            "name" = ${name || defVal?.name},
            "ingredient" = ${ingredient || defVal?.ingredient},
            "photo" = ${photo || defVal?.photo},
            "videos" = ${videos || defVal?.videos}
        WHERE "id" = ${id}`
}

// DELETE recipes
const deleteRecipesById = async (params) => {
    const { id } = params
    await db`DELETE FROM "public"."recipes" WHERE "id" = ${id}`
}


module.exports = {
    addNewRecipes,
    getRecipesById,
    getRecipesPagination,
    getAllRecipes,
    getRecipesByName,
    getRecipesSort,
    updateRecipes,
    deleteRecipesById}