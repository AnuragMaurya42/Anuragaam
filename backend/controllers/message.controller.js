// chat karne ke liye banane ja rahe hai
import { Conversation } from "../models/conversation.model.js";
import { getReceiverSocketId ,io} from "../socket/socket.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  console.log("send message wala call hu hai");

  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: message } = req.body; // Request se textMessage le rahe hai

    console.log("serId hai ye =", senderId);
    console.log("reciever id = ", receiverId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      // Agar conversation nahi hai toh naya conversation banao
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Yaha `message` key ka use kiya, jo model mein defined hai
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message, // Yaha `message` hai `messages` nahi
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    // Real-time ke liye socket.io use kar rahe hai
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("receiver ki socet id" , receiverSocketId);
    

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    // Do user ke beech ki conversation find karni hai
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation)
      return res.status(200).json({ success: true, messages: [] });

    return res
      .status(200)
      .json({ success: true, messages: conversation?.messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
