const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    body: String,
    //create reference to the author
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }
}, {timestamps: true});

ItemSchema.methods.toJSON = function(){
    let item = {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        //  author: this.author.toJSON()
    };

    if(this.author){
        item.author = this.author.toJSON();
    }
    
    return item;

};

mongoose.model('Item', ItemSchema);