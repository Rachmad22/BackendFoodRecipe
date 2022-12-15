const { Validator, addCustomMessages, extend } = require('node-input-validator')

const validateCreate = (req, res, next) => {
    extend('nameNotContainPassword', ({ value }) => {
        if (req.body.name !== req.body.password) {
            return true
        }
        return false
    })

    addCustomMessages({
        'name.required': 'Nama tidak boleh kosong',
        'name.minLength': 'minimal 5 huruf',
        'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
    })

    const rules = new Validator(req.body, {
        name: 'required|minLength:5|maxLength:50|nameNotContainPassword',
        email: 'required|minLength:5|maxLength:70|email',
        phone: 'required|minLength:6|maxLength:14|phoneNumber',
        password: 'required|minLength:3|alphaNumeric',
    })

    rules.check().then(function (success) {
        if (success) {
            next()
        } else {
            res.status(400).json({
                status: false,
                message: rules.errors,
                data: [],
            })
        }
    })
}

const validateUpdate = (req, res, next) => {
    extend('nameNotContainPassword', ({ value }) => {
        if (req.body.name !== req.body.password) {
            return true
        }
        return false
    })

    addCustomMessages({
        'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
    })

    const rules = new Validator(req.body, {
        name: 'required|minLength:5|maxLength:50|nameNotContainPassword',
        email: 'required|minLength:5|maxLength:70|email',
        phone: 'required|minLength:6|maxLength:14|phoneNumber',
        password: 'required|minLength:3|alphaNumeric'
    })

    rules.check().then((success)=> {
        if (success) {
            next()
        } else {
            res.status(400).json({
                status: false,
                message: rules.errors,
                data: [],
            })
        }
    })
}

const validateRecipe = (req, res, next) => {

    const rules = new Validator(req.body, {
        name: 'required|minLength:5|maxLength:50',
        ingredient: 'required',
    })

    rules.check().then((success)=> {
        if (success) {
            next()
        } else {
            res.status(400).json({
                status: false,
                message: rules.errors,
                data: [],
            })
        }
    })
}

const validateEditRecipe = (req, res, next) => {

    const rules = new Validator(req.body, {
        name: 'minLength:5|maxLength:50'
    })

    rules.check().then((success)=> {
        if (success) {
            next()
        } else {
            res.status(400).json({
                status: false,
                message: rules.errors,
                data: [],
            })
        }
    })
}


module.exports = { validateCreate, validateUpdate, validateRecipe, validateEditRecipe }
