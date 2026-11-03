
const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message || "";

    if (!message.trim()) {
      return res.status(400).json({
        reply: "Pehle apna message likhiye."
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message
    });

    res.json({
      reply: response.output_text || "Jawab nahi mila."
    });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({
      reply: "AI connection nahi ho paya. CMD mein error check karein."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Aditya AI is running on port " + PORT);
});