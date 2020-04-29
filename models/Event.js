const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
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
    let event = {
        id: this._id,
        title: this.title,
        body: this.body,
        items: this.items,
        code: this.code,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        //  author: this.author.toJSON()
    };

    if(this.author){
        event.author = this.author.toJSON();
    }
    
    return event;

};

mongoose.model('Event', EventSchema);