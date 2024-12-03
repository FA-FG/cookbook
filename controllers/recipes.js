// invoke the router functionality from hte express framework
const router = require('express').Router()


const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');




router.get('/', async (req, res) => {
  const recipes = await Recipe.find().populate('owner');
  res.render('recipes/index.ejs', { recipes });
});

// router.get('/', async (req, res) => {
//   res.render('recipes/index.ejs');
// });



router.get('/new', async (req, res)=>{
  res.render('recipes/new.ejs')
})


// router.post('/', async (req, res) => {
//   req.body.owner = req.session.user._id;
//   await Recipe.create(req.body);
//   res.redirect('/recipes');
// })


const Ingredient = require('../models/ingredient'); // Import the Ingredient model

router.post('/', async (req, res) => {
  try {
    // Get ingredient names from the input field
    // Split by commas and trim spaces
    const ingredientNames = req.body.ingredients.split(',').map(name => name.trim()); 
    const ingredientIds = [];

    // Look up each ingredient by name and get the ObjectId
    for (let name of ingredientNames) {
      let ingredient = await Ingredient.findOne({ name: name });

      if (!ingredient) {
        // If the ingredient doesn't exist, create a new one
        ingredient = await Ingredient.create({ name: name });
  
      }
      // Push the ObjectId of the found or newly created ingredient
      ingredientIds.push(ingredient._id); 
    }

    // Add the ingredients to the recipe body
    req.body.ingredients = ingredientIds;

    // Ensure the logged-in user is set as the owner
    req.body.owner = req.session.user._id;

    // Create the recipe with the populated ingredients
    const newRecipe = await Recipe.create(req.body);

    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  
  }
});



router.get('/:recipeId', async (req, res) => {
  try {
    const populatedrecipes = await Recipe.findById(
      req.params.recipeId
    ).populate('owner')
    .populate('ingredients')

    res.render('recipes/show.ejs', {
      recipe: populatedrecipes,
 
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (recipe.owner.equals(req.session.user._id)) {
      await recipe.deleteOne();
      res.redirect('/recipes');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
})


router.get('/:recipeId/edit', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId)
    .populate('ingredients')
    res.render('recipes/edit.ejs', {
      recipe: currentRecipe,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})



// router.put('/:recipeId', async (req, res) => {
  
//   try {
//     const currentRecipe = await Recipe.findById(req.params.recipeId);
//     if (currentRecipe.owner.equals(req.session.user._id)) {
//       await currentRecipe.updateOne(req.body);
//       res.redirect('/recipes');
//     } else {
//       res.send("You don't have permission to do that.");
//     }
//   } catch (error) {
//     console.log(error);
//     res.redirect('/');
//   }
// })

router.put('/:recipeId', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
    
    // Check if the logged-in user is the owner of the recipe
    if (currentRecipe.owner.equals(req.session.user._id)) {
      
      // Process ingredients if they are updated
      if (req.body.ingredients) {
        const ingredientNames = req.body.ingredients.split(',').map(name => name.trim());
        const ingredientIds = [];

        for (let name of ingredientNames) {
          let ingredient = await Ingredient.findOne({ name: name });
          if (!ingredient) {
            // If ingredient doesn't exist, create it
            ingredient = await Ingredient.create({ name: name });
            console.log(`Ingredient created: ${name}`);
          }
          ingredientIds.push(ingredient._id); // Push ingredient ObjectId
        }

        req.body.ingredients = ingredientIds; // Replace ingredients with their ObjectIds
      }

      // Update the recipe (this will include ingredients and other fields)
      await currentRecipe.updateOne(req.body);
      
      res.redirect(`/recipes/${currentRecipe._id}`); // Redirect to the updated recipe page

    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});









module.exports = router;