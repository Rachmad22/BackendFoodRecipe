require('dotenv').config()
const Redis = require('ioredis')

const connect = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
});
const useRedis = async (req, res, next) => {
    try {
        const is_paginate = await connect.get('is_paginate')
        const data = await connect.get('data')
        const total = await connect.get('total')
        const limit = await connect.get('limit')
        const page = await connect.get('page')
        const url = await connect.get('url')
        const matchUrl = url === req.originalUrl

        if (matchUrl && data) {
            res.status(200).json({
                status: true,
                redis: true,
                message: 'data berhasil di ambil',
                data: JSON.parse(data),
            })
            if (is_paginate) {
                res.status(200).json({
                    status: true,
                    redis: true,
                    message: 'data berhasil di ambil',
                    total: total,
                    page: page,
                    limit: limit,
                    data: JSON.parse(data),
                })
            }
        } else {
            next()
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

module.exports = { useRedis, connect }
