import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:false}, // Made optional for Google users
    googleId:{type:String,required:false,unique:true,sparse:true}, // Google ID
    profilePicture:{type:String,required:false}, // Profile picture URL
    isGoogleUser:{type:Boolean,default:false}, // Flag for Google users
    cardData:{type:Object,default:{}}
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user',userSchema);
export default userModel;