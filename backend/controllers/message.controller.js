// chat karne ke liye banane ja rahe hai 
import {Conversation} from '../models/conversation.model.js';
import { getReceiverSocketId } from '../socket/socket.js';

export const sendMessage = async(req , res)=>{

    try {

 const senderId = req.id;
 const receiverId = req.params.id;

 const {message} = req.body;

 let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
 });

 if(!conversation){
    //create a new convertation or should we start the conversation

conversation = await Conversation.create({
    participants: [senderId, receiverId],
});

 }

 const Message = await Message.create({
    senderId,
    receiverId,
    message,
    });

if(conversation) conversation.messages.push(Message._id);

await Promise.all([Message.save(), conversation.save()]);

// implement socket.io to send message to the receiver in real time 

const receiverSocketId = getReceiverSocketId(receiverId);

if(receiverSocketId){
    io.to(receiverSocketId).emit('newMessage ' , conversation);
}
        

return res.status(200).json({message: 'Message sent successfully'});

    } 
    catch (error) {
        console.log(error);
    }

}


export const getMessages = async(req , res)=>{

    try {
        
 const senderId = req.id;
    const receiverId = req.params.id;

// do user ke beech ki conversation ko find karna hai

 const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
    })

    if(!conversation) return res.status(200).json({success:true , messages: []});

    return res.status(200).json({success:true , messages: conversation?.message});

    } catch (error) {
        console.log(error);

    }


}
