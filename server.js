import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
const app = express();

dotenv.config();
app.use(express.json());
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

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

app.get("/profile", async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  res.json({data})
});
app.listen(process.env.PORT, () => {
  console.log("server running");
});
