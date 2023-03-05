const { Validator, addCustomMessages, extend } = require('node-input-validator')

const validateCreateUser = (req, res, next) => {
  const rules = new Validator(req.body, {
    name: "required|regex:^[a-zA-Z_ ]+$|minLength:5",
    phone: "required|phoneNumber|minLength:11|maxLength:14",
    email: "required|email|minLength:5|maxLength:70",
    password: "required|minLength:8|alphaNumeric",
    photo: "nullable",
  });

  rules.check().then(function (success) {
    if (success) {
      next();
    } else {
      res.status(404).json({
        status: false,
        message: rules.errors,
        data: [],
      });
    }
  });
};

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
        name: 'minLength:5|maxLength:50|nameNotContainPassword',
        email: 'minLength:5|maxLength:70|email',
        phone: 'minLength:6|maxLength:14|phoneNumber',
        photo: 'required|size:1mb',
        password: 'minLength:3|alphaNumeric'
    })

    rules.check().then((success) => {
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

    rules.check().then((success) => {
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

    rules.check().then((success) => {
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

const validateLogin = (req, res, next) => {
    const rules = new Validator(req.body, {
        email: 'required|email',
        password: 'required',
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


module.exports = { validateCreateUser, validateUpdate, validateRecipe, validateEditRecipe, validateLogin }
