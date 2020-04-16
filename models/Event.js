const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    id: String,
    title: String,
    body: String,
    code: String,
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
}, {timestamps: true});

EventSchema.methods.toJSON = function(){
    let item = {
        id: this.id,
        title: this.title,
        body: this.body,
        items: this.items,
        code: this.code,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        //  author: this.author.toJSON()
    };

    if(this.author){
        item.author = this.author.toJSON();
    }
    
    return item;

};

mongoose.model('Event', EventSchema);