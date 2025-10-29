import fs from "fs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
   const publicKey = process.env.JWT_PUBLIC_KEY;
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token)
      return res.status(401).json({ error: "Missing Authorization header" });

    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "thinkytimes-gpt",
      audience: "guardian-webhook",
    });

    console.log("✅ Verified JWT:", payload);
    console.log("📦 Webhook body:", req.body);

    return res.status(200).json({
      ok: true,
      message: "Thinkytimes GPT received webhook successfully.",
    });
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid JWT" });
  }
}
