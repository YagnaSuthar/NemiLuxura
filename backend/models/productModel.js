import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:Array,required:true},
    category:{type:String,default:'Mattress'},
    subCategory:{type:String,default:'General'}, // Optional field
    sizes:{type:Array,required:true},
    firmness:{type:String,required:true}, // Soft, Medium, Firm
    size:{type:String,required:true}, // Single size for filtering
    point1:{type:String,required:true}, // Feature point 1
    point2:{type:String,required:true}, // Feature point 2
    point3:{type:String,required:true}, // Feature point 3
    specifications:{type:Array,default:[]}, // Array of {key: String, value: String}
    rating:{type:Number,default:4.5},
    discount:{type:Number,default:0},
    bestseller:{type:Boolean,default:false},
    date:{type:Number,required:true}
})

// Force model recreation to ensure schema changes take effect
delete mongoose.models.product;
const productModel = mongoose.model("product",productSchema);

export default productModel;