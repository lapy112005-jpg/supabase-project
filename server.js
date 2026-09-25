import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "./middleware/auth.middleware.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
const app = express();

dotenv.config();
app.use(express.json());
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
const openapiDocument = JSON.parse(fs.readFileSync("./openapi.json", "utf-8"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.get("/", (req, res, next) => {
  res.send("lololol");
});

app.post("/signup", async (req, res, next) => {
  const { email, password, phone } = req.body;
  if (!email || !password || !password.trim()) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { phone },
    },

  });
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  return res.status(201).json({ message: "created", data });
});
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || !password.trim()) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  if (!data.session) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }
  
  return res.status(201).json(data);
});

app.get("/public/info", (req, res) => {
  return res.status(200).json({
    message: "Welcome stranger! This info is public.",
  });
});

app.get("/profile",requireAuth, async (req, res, next) => {
  res.json({users:req.user})
});


app.post("/logout",requireAuth, async (req, res, next) => {
  const {data , error} = await supabase.auth.signOut()
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.json(data)
});


app.listen(process.env.PORT, () => {
  console.log("server running");
});
