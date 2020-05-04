const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');

const Event = mongoose.model('Event');
const User = mongoose.model('User');

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



// router.param('user', function(req, res, next, id){
//     User.findById(id)
//     .then(function(user){
//         if(!user){
//             return res.sendStatus(404);
//         }
//         req.user = user;
//         return next();
//     });
// });

// /**
//  * Get an event by code
//  * GET /v1/events/code/:code
//  */
// router.get('/code/:code', async function(req, res, next){
//     // let events = await Event.find({ event: req.event.title });
//     // return res.json({
//     //     events: events.map(function(event){
//             return res.json ({event: req.event.toJSON()})        
//                 // })
//     // });
// }); 

/********** CREATE AN EVENT **********/

// router.post('/', async function (req, res, next) {
//     console.log('****** Create Event ******', req.body);
//     let event = new Project(req.body)
//     await event.save()
//     return res.json({ event: event.toJSON() })
// })

//---------- END ----------//

/********** DELETE AN EVENT **********/

// router.delete('/:event', async function (req, res, next) {
//     console.log('***** Event Deleted *****');
//     await Event.findByIdAndRemove(req.item.id)
//     return res.sendStatus(204)
// })




module.exports = router;