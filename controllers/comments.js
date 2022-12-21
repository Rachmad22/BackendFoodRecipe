const comment = require('../models/comment')
const { connect } = require('../middlewares/redis')

// READ comment by name
const getComment = async (req, res) => {
    try {
        const { name } = req.params 
        const { page, limit, sort } = req.query 

        if (name) {
            const getSelectedName = await comment.getCommentsName({ name, page, limit, sort })

            if (getSelectedName.length > 0) {
                res.status(200).json({
                    status: true,
                    message: 'data taken',
                    total: getSelectedName?.length,
                    page: page,
                    limit: limit,
                    data: getSelectedName,
                })
        } else {
            // OFFSET & LIMIT
            let getAllComm

            if (limit && page && sort) {
                getAllComm = await comment.getCommentsPagination({ limit, page, sort })
            } else {
                getAllComm = await comment.getAllComments({ sort })
            }

            if (getAllComm.length > 0) {
                res.status(200).json({
                    status: true,
                    message: 'data taken',
                    total: getAllComm?.length,
                    page: page,
                    limit: limit,
                    data: getAllComm,
                })
            } else {
                throw 'Data kosong silahkan coba lagi'
            }
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
// READ comment by comment
const getvalComment = async (req, res) => {
    try {
        const { komen } = req.params 
        const { page, limit, sort } = req.query // ?page=1&limit=5

        if (komen) {
            const getSelectedComment = await comment.getCommentsSort({ komen, page, limit, sort })

            res.status(200).json({
                status: true,
                message: 'data berhasil di ambil',
                total: getSelectedComment?.length,
                page: page,
                limit: limit,
                data: getSelectedComment,
            })
        } else {
            // OFFSET & LIMIT
            let getAllComm

            if (limit && page) {
                getAllComm = await comment.getCommentsPagination({ limit, page })
            } else {
                getAllComm = await comment.getAllComments({ sort })
            }

            if (getAllComm.length > 0) {
                res.status(200).json({
                    status: true,
                    message: 'data berhasil di ambil',
                    total: getAllComm?.length,
                    page: page,
                    limit: limit,
                    data: getAllComm,
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

// CREATE comment by name
const postComment = async (req, res) => {
    try {
        const { name, komen } = req.body

        const checkDuplicateComment = await comment.getAllComments({ komen })

        if (checkDuplicateComment.length >= 1) {
            throw { code: 401, message: 'Dont spam comment!' }
        }

        const addToDb = await comment.addNewComments({ name, komen })

        res.json({
            status: true,
            message: 'Added comment',
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

// UPDATE comments
const editComment = async (req, res) => {
    try {
        const { id } = req.params
        const { name, komen } = req.body

        const getComment = await comment.getCommentsId({ id })
console.log(getComment)
        if (getComment?.length > 0) {
            await comment.updateComments({
                name, komen, id,
                defaultValue: getComment[0], 
            })
        } else {
            throw 'User not registered'
        }

        res.json({
            status: true,
            message: 'Data edited',
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message ?? error,
            data: [],
        })
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params

        await comment.deleteComments({ id })

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

module.exports = { getComment, getvalComment, postComment, editComment, deleteComment }
