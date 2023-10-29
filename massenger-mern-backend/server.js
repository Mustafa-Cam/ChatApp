import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import cors from 'cors';
// const mongoose = require('mongoose');
// const Pusher = require('pusher');
// const cors = require('cors');
import mongomesages  from './mesageModel.js';
import messageController from './messageController.js'; 
// const { MongoClient, ServerApiVersion } = require('mongodb');

// app config
const app = express();
const port = process.env.PORT || 9000


const pusher = new Pusher({
    appId: "1696395",
    key: "bcb77745230887b311b1",
    secret: "7e53e5fecf9a4e087bd0",
    cluster: "ap2",  
    useTLS: true
  });
  
//   pusher.trigger("my-channel", "my-event", {
//     message: "hello world"
//   });

mongoose.connection.once('open',()=>{
    console.log('Mongoose connection')
    const changeStream = mongoose.connection.collection('Message').watch()
    changeStream.on('change',(change)=>{
        pusher.trigger("Message", "newMessage", {
            'change': change
          });
    })
})

// middleware
app.use(express.json())
app.use(cors())

// api routes
app.get('/',(req, res) => res.status(200).send("hello world"))
app.get('/retrieve/conversation', async (req, res) => {
    try {
        const data = await mongomesages.find({}); 
        data.sort((b,a)=>{return a.timestamp-b.timestamp})
        res.status(200).send(data);

    } catch (error) {
        res.status(500).send(error); 
    }
});

// app.post('/save/messages', async (req, res) => {
//     try {
//         const dbmessages = req.body; 
//         const data = await mongomesages.create(dbmessages); 
//         res.status(201).send(data);
//     } catch (error) {  
//         res.status(500).send(error);
//     }
// });

// app.post('/save/messages', async (req, res) => {
//     try {
//         const { username, message, timestamp } = req.body;
//         const newMessage = new mongomesages({ username, message, timestamp });
//         const savedMessage = await newMessage.save();
//         res.status(201).json(savedMessage);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// app.listen(port,()=>console.log(`listening on port: ${port}`))

//dbconfig

const mongoURI="mongodb+srv://Admin:1gcWF1Hlp2xOenp0@cluster0.ovrbt4o.mongodb.net/?retryWrites=true&w=majority" 
mongoose.connect(mongoURI, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
    // Router'ı kullanın
    app.use('/', messageController);
    // Web sunucusunu başlatın
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

