const router = require('express').Router()
const {validateRecipe, validateEditRecipe} = require('../middlewares/validation')
const { validateToken } = require('../middlewares/webtoken')
const recipesController = require('../controllers/recipes')
const { useRedis } = require('../middlewares/redis')

// CREATE recipes
router.post('/add', validateToken, validateRecipe, recipesController.postRecipe)

// READ recipe with sorting name & date
router.get('/:name?', useRedis, recipesController.getRecipes )

// READ recipe by ID
router.get('/', useRedis, recipesController.getRecipesAll )


// UPDATE recipes
router.patch('/edit/:id?',validateToken, validateEditRecipe, recipesController.editRecipes)

// DELETE recipes
router.delete('/delete/:id?', validateToken, recipesController.deleteRecipes)


module.exports = router
