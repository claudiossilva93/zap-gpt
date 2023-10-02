import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsAppPhoneNumber = process.env.WHATS_APP_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async (to: string, body: string): Promise<void> =>{
    try{
        await client.messages.create({
            to,
            from: whatsAppPhoneNumber,
            body,
        })
    }catch(error){
        console.error(`Error send messaga to ${to}: ${error}`)
    }
}

const startFlow = async(to: string, flowId: string) : Promise<void>=> {
    try{
        const executionFlow = await client.studio.v2.flows(flowId)
        .executions
        .create({
            to,
            from: whatsAppPhoneNumber as string
        });
        console.log(executionFlow)
    }catch(error){
        console.error(`Error starting flow to ${to}: ${error}`)
    }

}

export {
    sendWhatsAppMessage,
    startFlow
}