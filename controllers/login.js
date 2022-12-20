require('dotenv').config()
const bcrypt = require('bcrypt')
const account = require('../models/account')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const checkEmail = await account.getUserEmail({ email })

        // kalo check email isinya tidak ada
        if (checkEmail?.length === 0) {
            throw 'Email not registered'
        }

        // compare password inputan dgn password di table 
        bcrypt.compare(password, checkEmail[0].password, (err, result) => {
            try {
                if (err) {
                    throw { code: 500, message: 'Server failure' }
                }
                
                // untuk buat token
                const token = jwt.sign(
                    {
                        id: checkEmail[0]?.id,
                        name: checkEmail[0]?.name,
                        email: checkEmail[0]?.email,
                        iat: new Date().getTime(),
                    },
                    process.env.JWT_KEY
                )

                if (result) {
                    res.status(200).json({
                        status: true,
                        message: 'login succeed',
                        data: {
                            token,
                        },
                    })
                } else {
                    throw { code: 400, message: 'Wrong password' }
                }
            } catch (error) {
                res.status(error?.code ?? 500).json({
                    status: false,
                    message: error?.message ?? error,
                    data: [],
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message ?? error,
            data: [],
        })
    }
}

module.exports = { login }
