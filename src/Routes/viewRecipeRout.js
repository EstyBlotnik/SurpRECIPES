const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const User = require('../models/users');
router.get('/', (req, res) => {
    Recipe.find()
        .then(result => {
            User.findOne({email: 'adi@gmail.com' })
            .then(user=>{
                res.render('viewRecipe', { posts: result,currentUser: user });
            })

            // const currentUser = {
            //     email: 'user123',
            //     name: 'John Doe'
            // }
            
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

// router.post('/like/:id', (req, res) => {
//     const id = req.params.id;
//     Recipe.findByIdAndUpdate(id, { $inc: { likes: 1 } })
//         .then(result => {
//             res.json({ success: true });
//         })
//         .catch(err => {
//             console.log(err);
//             res.json({ success: false, error: err });
//         });
// });

// router.post('/unlike/:id', (req, res) => {
//     const id = req.params.id;
//     Recipe.findByIdAndUpdate(id, { $inc: { likes: -1 } })
//         .then(result => {
//             res.json({ redirect: '/viewRecipe' });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

// router.post('/unlike/:id', (req, res) => {
//     const id = req.params.id;
//     Recipe.findByIdAndUpdate(id, { $inc: { likes: -1 } })
//         .then(result => {
//             res.json({ success: true });
//         })
//         .catch(err => {
//             console.log(err);
//             res.json({ success: false, error: err });
//         });
// });

router.post('/unlike/:id', (req, res) => {
    const id = req.params.id;
    Recipe.findByIdAndUpdate(id, { $inc: { likes: -1 } })
        .then(result => {
            // Fetch the updated recipe or any other necessary data
            Recipe.findById(id)
                .then(updatedRecipe => {
                    res.json({ recipe: updatedRecipe, redirect: '/viewRecipe' });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: 'Failed to fetch updated recipe' });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Failed to update recipe' });
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