const account = require('../models/account')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const { connect } = require('../middlewares/redis')
const bcrypt = require('bcrypt')
const saltRounds = 10

const getUsers = async (req, res) => {
    try {
        const { name } = req.params // /data/:id
        const { page, limit, sort } = req.query // ?page=1&limit=5

        if (name) {
            const getSelectedUser = await account.getUserByName({ name })
            connect.set('data', JSON.stringify(getSelectedUser), 'ex', 10)

            res.status(200).json({
                status: true,
                message: 'Data taken',
                data: getSelectedUser,
            })
        } else {
            // OFFSET & LIMIT
            let getAllUser

            if (limit && page) {
                getAllUser = await account.getAllUsersPagination({ limit, page })
            } else {
                getAllUser = await account.getAllUsers({ sort })
            }
            connect.set('data', JSON.stringify(getAllUser), 'ex', 10)
            connect.set('total', getAllUser?.length, 'ex', 10)
            connect.set('page', page, 'ex', 10)
            connect.set('limit', limit, 'ex', 10)
            connect.set('is_paginate', "true", 'ex', 10)

            if (getAllUser?.length > 0) {
                res.status(200).json({
                    status: true,
                    message: 'Data taken',
                    total: getAllUser?.length,
                    page: page,
                    limit: limit,
                    data: getAllUser,
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

const postUsers = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body
// tidak boleh ada nama dan email yg sama
        const checkDuplicateName = await account.getUserByName({ name })

        const checkDuplicateEmail = await account.getUserByEmail({ email })

        if (checkDuplicateEmail.length >= 1 || checkDuplicateName.length >= 1) {
            throw { code: 401, message: 'Registered Name & Email' }
        }
        let file = req.files.photo
        console.log(file)
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
                // await sharp(file).jpeg({ quality: 20 }).toFile(uploadPath)

                if (err) {
                    throw 'fail to upload photo'
                }
// hash the password
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (err) {
                        throw 'fail to authentic, please try again...'
                    }

                // Store hash in your password DB.
                const addToDb = await account.addNewUsers({
                    name,
                    email,
                    phone,
                    password: hash,
                    photo: `/images/${fileName}`,
                })
                res.json({
                    status: true,
                    message: 'Added data',
                    data: addToDb,
                })
            })
            })
        } else {
            throw 'failed upload photo, format photo only !'
        }
    } catch (error) {
        res.status(error?.code ?? 500).json({
            status: false,
            message: error?.message ?? error,
            data: [],
        })
    }
}

const editUsers = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, phone, password } = req.body
        let file = req.files.photo
        let fileName = `${uuidv4()}-${file.name}`
        let uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`
        let mimeType = file.mimetype.split('/')[1]
        let allowFile = ['jpeg', 'jpg', 'png', 'webp']
        if (allowFile.find((item) => item === mimeType)) {
            file.mv(uploadPath, async (err) => {
                if (err) {
                    throw 'fail to upload photo'
                }
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (err) {
                        throw 'fail to authentic, please try again...'
                    }
                const getUser = await account.getUserById({ id })

                if (getUser?.length > 0) {
                    await account.updateUser({
                        name,
                        email,
                        phone,
                        password: hash,
                        photo: `/images/${fileName}`,
                        id,
                        defaultValue: getUser[0]
                    })
                } else {
                    throw 'ID not registered'
                }

                res.json({
                    status: true,
                    message: 'Edited data',
                })
            })
        }
        )
        }
    }catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message ?? error,
            data: [],
        })
    }
}

const deleteUsers = async (req, res) => {
    try {
        const { id } = req.params

        await account.deleteUserById({ id })

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

module.exports = { getUsers, postUsers, editUsers, deleteUsers }
