const account = require('../models/account')
const { v4: uuidv4 } = require('uuid')
const { connect } = require('../middlewares/redis')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { cloudinary } = require('../helper')

const getUsers = async (req, res) => {
    try {
        const { name } = req.params // /data/:id
        const { page, limit, sort } = req.query // ?page=1&limit=5

        if (name) {
            const getSelectedUser = await account.getUserByName({ name })
            connect.set('data', JSON.stringify(getSelectedUser), 'ex', 10)
            connect.set('url', req.originalUrl, 'ex', 10)

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
            connect.set('url', req.originalUrl, 'ex', 10)
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

const createUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body

        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    throw 'Authentication process failed, please try again'
                }

                const addToDb = await account.addUser({
                    name,
                    email,
                    password: hash,
                    phone,
                })

                res.json({
                    status: true,
                    message: 'Data added successfully',
                    data: addToDb
                })
            })
        })
    }
    catch (error) {
        res.status(error?.code ?? 500).json({
            status: false,
            message: error?.message ?? error,
            data: []
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
        if (file !== null) {
            let mimeType = file.mimetype.split('/')[1]
            let allowFile = ['jpeg', 'jpg', 'png', 'webp']
            // validate size image
            if (file.size > 1048576) {
                throw 'Too large file, max 1mb'
            }
            if (allowFile.find((item) => item === mimeType)) {
                cloudinary.v2.uploader.upload(
                    file.tempFilePath,
                    { public_id: uuidv4() },
                    function (error, result) {
                        if (error) {
                            throw 'failed to upload'
                        }
                        // hash the password
                        bcrypt.hash(password, saltRounds, async (err, hash) => {
                            if (err) {
                                throw 'fail to authentic, please try again...'
                            }
                            const addToDb = await account.addNewUsers({
                                name,
                                email,
                                phone,
                                password: hash,
                                photo: result.url,
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
        }
        if (!file) {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                const add = await account.addUser({
                    name,
                    email,
                    phone,
                    password: hash,
                })
                if (err) {
                    throw 'fail to authentic, please try again...'
                }
                res.json({
                    status: true,
                    message: 'added data',
                    data: add
                })
            })
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
    const { id } = req.params;
    const { name, phone, email, password } = req.body;

    // Check the user id, is there or not
    const checkUser = await user.getUserById({ id });

    if (checkUser.length === 0) {
      throw { code: 401, message: `User with id ${id} doesn't exist` };
    }

    // Check phone number, whether already used or not
    if (phone) {
      const checkPhone = await user.getUserPhone({ phone });
      if (checkPhone.length >= 1) {
        throw { code: 401, message: "Number already in use" };
      }
    }

    // Check email, whether already used or not
    if (email) {
      const checkEmail = await user.getUserEmail({ email });

      if (checkEmail.length >= 1) {
        throw { code: 401, message: "Email already in use" };
      }
    }

    const getUser = await user.getUserById({ id });

    if (req.files && req.files.photo) {
      const file = req.files.photo;

      const mimeType = file.mimetype.split("/")[1];

      const allowedFile = ["jpg", "png", "jpeg", "webp"];

      if (allowedFile.find((item) => item === mimeType)) {
        cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { public_id: uuidv4() },
          function (error, result) {
            if (error) {
              throw "Photo upload failed";
            }

            bcrypt.genSalt(saltRounds, (err, salt) => {
              bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                  throw "Authentication process failed, please try again";
                }

                const addToDbPhoto = await user.editUserPhoto({
                  id,
                  name,
                  phone,
                  email,
                  password: hash,
                  photo: result.url,
                  getUser,
                });

                res.json({
                  status: true,
                  message: "User edited successful",
                  data: addToDbPhoto,
                });
              });
            });
          }
        );
      } else {
        throw {
          code: 401,
          message: "Upload failed, only photo format input",
        };
      }
    } else {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            throw "Authentication process failed, please try again";
          }

          const addToDb = await user.editUser({
            id,
            name,
            phone,
            email,
            password: hash,
            getUser,
          });

          res.json({
            status: true,
            message: "User edited successful",
            data: addToDb,
          });
        });
      });
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

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

module.exports = { getUsers, postUsers, editUsers, deleteUsers, createUser }
