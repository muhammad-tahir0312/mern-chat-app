import Conversation from '../Models/conversation.model.js';
import Message from '../Models/message.model.js';

export const sendMessage = async (req, res) => {
    try {
        const { message: messages } = req.body;
        const receiverId = req.params.id; 
        const senderId = req.userId._id;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId, 
            message:messages
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        await conversation.save();
        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully"});
    } catch (error) {
        console.log("Theres an error in sending message", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}

export const getMessages = async (req, res)=>{
    const senderId = req.params.id;
    const receiverId = req.userId._id;
    console.log(senderId)
    console.log(receiverId)
    try {
        const conversations = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        }).populate('messages').select("password");

        if(!conversations){
            return res.status(404).json({msg: 'Conversation not found'});
        }

        res.status(200).json(conversations.messages);
        
    } catch (error) {
        console.log("Theres an error in getting message", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}