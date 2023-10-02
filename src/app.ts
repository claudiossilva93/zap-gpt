import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sendWhatsAppMessage, startFlow } from "./services/twilio";
import dotenv from "dotenv";
import { getOpenAICompletion } from "./services/openai";

const app = express();
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())

dotenv.config();

app.post('/chat/send', async (req, res)=>{
    const {to, body}  = req.body;
    try{
        await sendWhatsAppMessage(`whatsapp:${to}`, body)
        res.status(200).json({success: true, body})
    }catch(error){
        res.status(500).json({success:false, error})
    }
})

app.post('/chat/receive', async (req, res)=>{
    console.log(req);
    const twilioRequestBody  = req.body;
    const messageBody = twilioRequestBody.Body;
    const to = twilioRequestBody.From;
    try{
        const completion = await getOpenAICompletion(messageBody);
        await sendWhatsAppMessage(to, completion)
        res.status(200).json({success: true, completion})
    }catch(error){
        res.status(500).json({success:false, error})
    }
})

app.post('/flow/fluig', async (req, res)=>{
    const twilioRequestBody  = req.body;
    const to = twilioRequestBody.to;
    try{
        await startFlow(to, 'FW402b764c238776c5a34925c8f6ce4b61');
        res.status(200).json({success: true})
    }catch(error){
        res.status(500).json({success:false, error})
    }
})

const port = process.env.PORT || 3000;

app.listen(port,() => { console.log('Server started')  })