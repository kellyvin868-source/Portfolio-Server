const axios=require('axios');
require('dotenv').config();
const getBotId=async(r)=>{



 const BOT_TOKEN=process.env.BOT_TOKEN
    try {
       
        const url=`https://api.telegram.org/bot${BOT_TOKEN}`
        const response=await axios.get(`${url}/getUpdates`);
        const chatId=response.data.result[0].message.chat.id
       
        console.log(chatId);

        
    } catch (error) {
         console.log(BOT_TOKEN)
        console.error(error.message)
        
    }
}

const sendBotMessage=async(text)=>{
     const BOT_TOKEN=process.env.BOT_TOKEN
     const chatId=process.env.CHAT_ID
    const url=`https://api.telegram.org/bot${BOT_TOKEN}`
    try {

        const response=await axios.post(`${url}/sendMessage`,{
            text:text,
            chat_id:chatId
        })
        const res=response.data;
      
        
    } catch (error) {
        console.error(error.message)
          console.log(error)
        
    }


}

module.exports={
    getBotId,
    sendBotMessage
}