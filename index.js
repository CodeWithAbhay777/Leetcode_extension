import express from 'express';
import 'dotenv/config';
const app = express();
import OpenAI from "openai";
import { assistantLimit } from './rateLimit.js';

const PORT = process.env.PORT || 3000;

app.use(express.json());

let messages = [];

const openai = new OpenAI ({
  apiKey : process.env.API_KEY,
});


app.post('/leetcode' , assistantLimit ,async (req , res) => {
    let {task} = req.body;
    
    messages.push({ "role": "user", "content": `${task}` });

    try {

        let response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
      
            messages: messages,
      
          });

          if (response) {
            let reply = response.choices[0].message.content;
            
            res.status(200).json({success : true , msg : reply});
          }
          else {
            res.status(404).json({success : false , msg : "Data not found"});
          }

    }catch (error) {
        
        res.status(500).send({success : false , msg : "Something went wrong!"});
    }
})



app.listen(PORT , () => console.log('Server is ready'));