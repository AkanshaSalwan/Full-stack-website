const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    country: {
      type: String,
      default:null
    },
    streetAddressLine1:{
      type: String,
      default:null,
    },
    streetAddressLine2:{
      type: String,
      default:null,
    },
    townCity:{
      type: String,
      default:null,
    },
    state:{
      type: String,
      default:null,
    },
    postCode:{
      type: Number,
      default:null,
    }
  });
  

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
    },
    images:[
        {
            type:String,
            required:true
        }
    ],
    isAdmin:{
        type: Boolean,
        default: false,
    },
    address:addressSchema
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
