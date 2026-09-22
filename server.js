import express from "express"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js";

dotenv.config()
const app = express()
app.use(express.json())
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);


app.get("/" , (req,res,next)=>{
    res.send("lololol")
})



app.listen(process.env.PORT , ()=>{
    console.log("server running");
    
})