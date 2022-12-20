const recipe = require('../models/recipe')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

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
        const { name, ingredient, photo, videos } = req.body

        const checkDuplicateName = await recipe.getRecipesByName({ name })

        if (checkDuplicateName.length >= 1) {
            throw { code: 401, message: 'Registered Name' }
        }
        let file = req.files.photo
        let fileName = `${uuidv4()}-${file.name}`
        let uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`
        let mimeType = file.mimetype.split('/')[1]
        let allowFile = ['jpeg', 'jpg', 'png', 'webp']

        // validate size image
        if (file.size > 1048576) {
            throw 'Too large file, max 1mb'
        }

        if (allowFile.find((item) => item === mimeType)) {
            // Use the mv() method to place the file somewhere on your server
            file.mv(uploadPath, async function (err) {
                if (err) {
                    throw 'fail to upload photo'
                }
                const addToDb = await recipe.addNewRecipes({ name, ingredient, photo: `/images/${fileName}`, videos })

                res.json({
                    status: true,
                    message: 'Adding Recipe succeed',
                    data: addToDb,
                })
            }
            )
        }
    }
    catch (error) {
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
        let file = req.files.photo
        let fileName = `${uuidv4()}-${file.name}`
        let uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`
        let mimeType = file.mimetype.split('/')[1]
        let allowFile = ['jpeg', 'jpg', 'png', 'webp']

        // validate size image
        if (file.size > 1048576) {
            throw 'Too large file, max 1mb'
        }

        if (allowFile.find((item) => item === mimeType)) {
            file.mv(uploadPath, async (err) => {
                if (err) {
                    throw 'fail to upload photo'
                }
                const getRecipe = await recipe.getRecipesById({ id })
                if (getRecipe?.length > 0) {
                    await recipe.updateRecipes({
                        id,
                        name, ingredient,
                        photo : `/images/${fileName}`,
                        videos,
                        defVal: getRecipe[0],
                    })
                } else {
                    throw 'ID not registered'
                }

                res.json({
                    status: true,
                    message: 'Recipe Edited',
                })
            })
        }
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
