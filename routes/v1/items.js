const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');

const Item = mongoose.model('Item');
const User = mongoose.model('User');

router.param('item', function(req, res, next, id){
    Item.findById(id)
    .then(function(item){
        if(!item){
            return res.sendStatus(404);
        }
        req.item = item;
        return next();
    });
});

/********** GET ALL ITEMS **********/

router.get('/', function (req, res, next) {
    console.log('***** Get Items *****')
    Item
        .find()
        // .populate('author')
        // .sort({ createdAt: 'desc' })
        .then(function (item) {
            return res.json({
                item: item.map(function (item) {
                    return item.toJSON()
                })
            })
        })
})

//---------- END ----------//

/********** CREATE AN ITEM **********/

router.post('/', async function (req, res, next) {
  console.log('****** Create Item ******', req.body);
  let item = new Item(req.body)
  await item.save()
  return res.json({ item: item.toJSON() })
})


//---------- END ----------//

/********** DELETE AN ITEM **********/

// router.delete('/:item', async function (req, res, next) {
//     console.log('***** Item Deleted *****');
//     await Item.findByIdAndRemove(req.item.id)
//     return res.sendStatus(204)
// })

//---------- END ----------//
/********** GET AN ITEM BY ID **********/

router.get('/:item', function (req, res, next) {
    console.log('***** Item by id *****')
    return res.json({ item: req.item.toJSON() })
})

//---------- END ----------//



module.exports = router;