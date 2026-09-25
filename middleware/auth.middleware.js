import { supabase } from "../server.js";

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }
  const {data , error} = await supabase.auth.getUser(token)
  if(error){
    return res.status(401).json(error.message)
  }
  req.user = data.user
  next()
};
