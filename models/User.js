const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    items: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    events: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
}, {timestamps: true});

UserSchema.methods.toJSON = function(){
    return {
        id: this._id,
        email: this.email,
        password: this.password,
        items: this.items,
        events: this.event,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
};

UserSchema.pre('remove', function(next){
 this.model('Item').deleteMany({ author: this._id }).exec();
 this.model('Event').deleteMany({ author: this._id }).exec();
});


mongoose.model('User', UserSchema);