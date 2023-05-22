const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipeSchema');

router.get('/', (req, res) => {
    Recipe.find()
        .then(result => {
            const currentUser = {
                email: 'user123',
                name: 'John Doe'
            }
            res.render('viewRecipe', { posts: result, currentUser: currentUser });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/like/:id', (req, res) => {
    const id = req.params.id;
    Recipe.findByIdAndUpdate(id, { $inc: { likes: 1 } })
        .then(result => {
            res.json({ redirect: '/viewRecipe' });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/unlike/:id', (req, res) => {
    const id = req.params.id;
    Recipe.findByIdAndUpdate(id, { $inc: { likes: -1 } })
        .then(result => {
            res.json({ redirect: '/viewRecipe' });
        })
        .catch(err => {
            console.log(err);
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Recipe.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/viewRecipe' });
        })
        .catch(err => {
            console.log(err);
        });
});
module.exports = router;