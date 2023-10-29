import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import Message from './mesageModel.js'; // Model dosyasının yolunu düzeltmek gerekebilir

const router = express.Router();
const pusher = new Pusher({
    appId: "1696395",
    key: "bcb77745230887b311b1",
    secret: "7e53e5fecf9a4e087bd0",
    cluster: "ap2",
    useTLS: true
  });
router.post('/save/messages', async (req, res) => {
    try {
        const { username, message, timestamp } = req.body;
        const newMessage = new Message({ username, message, timestamp });
        const savedMessage = await newMessage.save();

        pusher.trigger('Message', 'newMessage', {
            username: savedMessage.username,
            message: savedMessage.message,
            timestamp: savedMessage.timestamp
        });

        
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
