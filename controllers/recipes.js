const recipe = require('../models/recipe')
const { v4: uuidv4 } = require('uuid')
const { connect } = require('../middlewares/redis')
const { cloudinary } = require('../helper')

// READ recipes by name
const getRecipes = async (req, res) => {
    try {
        const { name } = req.params
        const { page, limit, sort } = req.query

        if (name) {
            const getSelectedRecipe = await recipe.getRecipesByName({ name, sort })
            connect.set('data', JSON.stringify(getSelectedRecipe), 'ex', 10)
            connect.set('url', req.originalUrl, 'ex', 10)

            res.status(200).json({
                status: true,
                message: 'data taken',
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
            connect.set('data', JSON.stringify(getAll), 'ex', 10)
            connect.set('total', getAll?.length, 'ex', 10)
            connect.set('page', page, 'ex', 10)
            connect.set('limit', limit, 'ex', 10)
            connect.set('url', req.originalUrl, 'ex', 10)
            connect.set('is_paginate', "true", 'ex', 10)

            if (getAll.length > 0) {
                res.status(200).json({
                    status: true,
                    message: 'data taken',
                    total: getAll?.length,
                    page: page,
                    limit: limit,
                    data: getAll,
                })
            } else {
                throw 'Data not found, try again please..'
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

// READ recipes by ID
const getRecipesAll = async (req, res) => {
    try {
        // const { id } = req.params
        const { page, limit, sort } = req.query

        if (sort) {
            const getSelectedRecipe = await recipe.getAllRecipes({ sort })
            connect.set('data', JSON.stringify(getSelectedRecipe), 'ex', 10)
            connect.set('url', req.originalUrl, 'ex', 10)

            res.status(200).json({
                status: true,
                message: 'data taken',
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
            connect.set('data', JSON.stringify(getAll), 'ex', 10)
            connect.set('total', getAll?.length, 'ex', 10)
            connect.set('page', page, 'ex', 10)
            connect.set('limit', limit, 'ex', 10)
            connect.set('url', req.originalUrl, 'ex', 10)
            connect.set('is_paginate', "true", 'ex', 10)

            if (getAll.length > 0) {
                res.status(200).json({
                    status: true,
                    message: 'data taken',
                    total: getAll?.length,
                    page: page,
                    limit: limit,
                    data: getAll,
                })
            } else {
                throw 'Data not found, try again please..'
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
        let file = req.files.photo
        let mimeType = file.mimetype.split('/')[1]
        let allowFile = ['jpeg', 'jpg', 'png', 'webp']

        // validate size image
        if (file.size > 1048576) {
            throw 'Too large file, max 1mb'
        }

        if (allowFile.find((item) => item === mimeType)) {
            cloudinary.v2.uploader.upload(
                file.tempFilePath,
                { public_id : uuidv4() },
                async (error, result)=>{
                    if(error){
                        throw 'failed to upload'
                    }
                const addToDb = await recipe.addNewRecipes({ 
                    name, ingredient,
                    photo: result.url, videos })

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
        const { name, ingredient, videos } = req.body
        let file = req.files.photo
        let mimeType = file.mimetype.split('/')[1]
        let allowFile = ['jpeg', 'jpg', 'png', 'webp']

        // validate size image
        if (file.size > 1048576) {
            throw 'Too large file, max 1mb'
        }

        if (allowFile.find((item) => item === mimeType)) {
            cloudinary.v2.uploader.upload(
                file.tempFilePath,
                { public_id : uuidv4() },
                async (error, result) => {
                    if(error){
                        throw 'failed to upload'
                    }
                const getRecipe = await recipe.getRecipesById({ id })
                if (getRecipe?.length > 0) {
                    await recipe.updateRecipes({
                        id,
                        name, ingredient,
                        photo : result.url,
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

module.exports = { getRecipes, getRecipesAll, postRecipe, editRecipes, deleteRecipes }
