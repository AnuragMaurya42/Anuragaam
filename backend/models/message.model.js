import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    messages:{type:String, required:true},
});
export const Message = mongoose.model('Message', messageSchema);