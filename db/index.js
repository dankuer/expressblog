/**
 * Created by Dankuer on 2016/7/31.
 */
var mongoose=require('mongoose');
var ObjectId=mongoose.Schema.Types.ObjectId;
var settings=require('../settings');
mongoose.connect(settings.url);
mongoose.model('User',new mongoose.Schema({
    username:{type:String,isRequired:true},
    password:{type:String,isRequired:true},
    email:{type:String,isRequired:true},
    avatar:{type:String}
}));
mongoose.model('Article',new mongoose.Schema({
    title:{type:String,isRequired:true},
    content:{type:String,isRequired:true},
    createAt:{type:Date,default:Date.now()},
    user:{type:ObjectId,ref:'User'}
}));
global.Model=function(modelName){
    return mongoose.model(modelName);
};