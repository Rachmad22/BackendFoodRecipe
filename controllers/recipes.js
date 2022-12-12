const recipe = require('../models/recipe')

// READ recipes by name
const getRecipes = async (req, res) => {
    try {
        const { name } = req.params 
        const { page, limit, sort } = req.query 

        if (name) {
            const getSelectedRecipe = await recipe.getRecipesByName({ name, sort })

            res.status(200).json({
                status: true,
                message: 'data berhasil di ambil',
                total: getSelectedRecipe.length,
                data: getSelectedRecipe,
            })
        } else {
            // OFFSET & LIMIT
            let getAll

            if (sort && limit && page) {
                getAll = await recipe.getRecipesPagination({ sort, limit, page })
            } else {
                getAll = await recipe.getRecipesSort({ sort })
            }

            if (getAll.length > 0) {
                res.status(200).json({
                    status: true,
                    message: 'data berhasil di ambil',
                    total: getAll?.length,
                    page: page,
                    limit: limit,
                    data: getAll,
                })
            } else {
                throw 'Data kosong silahkan coba lagi'
            }
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message ?? error,
            data: [],
        })
    }
}

const postRecipe = async (req, res) => {
    try {
        const { name, ingredient, videos } = req.body

        const checkDuplicateName = await recipe.getRecipesByName({ name })

        if (checkDuplicateName.length >= 1) {
            throw { code: 401, message: 'Registered Name' }
        }

        const addToDb = await recipe.addNewRecipes({ name, ingredient, videos })

        res.json({
            status: true,
            message: 'Adding Recipe succeed',
            data: addToDb,
        })
    } catch (error) {
        res.status(error?.code ?? 500).json({
            status: false,
            message: error?.message ?? error,
            data: [],
        })
    }
}

const editRecipes = async (req, res) => {
    try {
        const { id } = req.params
        const { name, ingredient, photo, videos } = req.body

        const getRecipe = await recipe.getRecipesById({ id })
        if (getRecipe) {
            await recipe.updateRecipes({
                name, ingredient, photo, videos,
                defVal: getRecipe[0],
            })
        } else {
            throw 'ID not registered'
        }
        
        res.json({
            status: true,
            message: 'Recipe Edited',
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message ?? error,
            data: [],
        })
    }
}

const deleteRecipes = async (req, res) => {
    try {
        const { id } = req.params

        await recipe.deleteRecipesById({ id })

        res.json({
            status: true,
            message: 'deleted',
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message ?? error,
            data: [],
        })
    }
}

module.exports = { getRecipes, postRecipe, editRecipes, deleteRecipes }
