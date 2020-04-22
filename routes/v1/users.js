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
 * Create a user.
 */
router.post('/', async function(req, res, next){
    console.log('create user', req.body);
    let user = new User(req.body);
    await user.save();
    return res.json({ user: user.toJSON() });
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
 * GET /v1/users/:user/item
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
 
router.post('/:user/events', async function (req, res, next) {
    console.log('****** Create Event ******', req.body);
    let event = new Event(req.body)
    event.author = req.user;
    await event.save().then(function ( ) {
        if (!req.user.events) {
            req.user.events = [];
          }
    })
    req.user.events.push(event);
    return req.user.save().then(function () {
    return res.json({ event: event.toJSON() })
    });
})


/************
 * Auth
 ***********/

/**
 * Log In
 * POST /v1/users/admin-login
 */

router.post('/admin-login', async function(req, res, next) {
    if(!req.body.email) {
        return res.status(422).json({
            success: false, 
            message: 'Email cannot be blank'
        })
    }
    let user = await User.findOne({ email: req.body.email});
    if (!user) {
        return res.status(422).json({
            success: false, 
            message: 'User does not exist'
        })
    }
    return res.json({ user: user.toJSON() });

   
})


/**
 * Log In
 * POST /v1/users/user-login
 */

router.post('/enter-code', async function(req, res, next) {
    if(!req.body.code) {
        return res.status(422).json({
            success: false, 
            message: 'Code cannot be blank'
        })
    }
    let user = await User.findOne({ code: req.body.code });
    if (!user) {
        return res.status(422).json({
            success: false, 
            message: 'User does not exist'
        })
    }
    return res.json({ user: user.toJSON() });

   
})
     




module.exports = router;