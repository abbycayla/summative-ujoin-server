const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Event = mongoose.model('Event');

router.param('user', function(req, res, next, id){
    User.findById(id)
    .then(function(user){
        if(!user){
            return res.sendStatus(404);
        }
        req.user = user;
        return next();
    });
});

router.param('event', function(req, res, next, id){
    Event.findById(id)
    .then(function(event){
        if(!event){
            return res.sendStatus(404);
        }
        req.event = event;
        return next();
    });
});




/**
 * Get all users
 */
router.get('/', function(req, res, next){
    console.log('get users');
    User
    .find()
    .sort({createdAt: 'desc'})
    .then(function(users){
        return res.json({
            users: users.map(function(user){
                return user.toJSON();
            })
        });
    });
    
});

/**
 * Get a user by ID.
 */
router.get('/:user', async function(req, res, next){
    console.log('get user by id');
    await req.user.populate('items').execPopulate();
    return res.json({ user: req.user.toJSON() });
});



/************
 * Entity relationships
 ***********/

/**
 * Get a user's items
 * GET /v1/users/:user/articles
 */
router.get('/:user/items', async function(req, res, next){
    let items = await Item.find({ author: req.user });
    return res.json({
        items: items.map(function(item){
            return item.toJSON();
        })
    });
}); 


/**
 * Create an item for a user.
 * POST users/:userId/events/:event/items
 */
router.post('/:user/events/:event/items', async function(req, res, next){
    if(!req.user){
        return res.status(422).json({
            success: false, message: 'User does not exist'
        });
    }
    let item = new Item (req.body);
    item.author = req.user;
    await item.save();
    item.event = req.event
    req.user.items.push(item);
    req.event.items.push(item);
    await req.user.save();
    await req.event.save();
    return res.json({ item: item.toJSON() });
});







 /**
 * Create an event for a user.
 * POST users/:userId/events
 */




/************
 * Auth
 ***********/

/**
 * Log In
 * POST /v1/users/login
 */

router.post('/login', async function(req, res, next) {
    if(!req.body.email) {
        return res.status(422).json({
            success: false, 
            message: 'Email cannot be blank'
        })
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(422).json({
            success: false, 
            message: 'User does not exist'
        })
    }
    return res.json({ user: user.toJSON() });

   
})
     




module.exports = router;