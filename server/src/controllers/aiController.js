import groq from "../config/groq.js";

export const generateCaption = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an Instagram content creator. Generate one engaging Instagram caption with relevant emojis and 8-12 hashtags. Return only the caption.",
        },
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
    });
    const caption = completion.choices[0]?.message?.content;

    if (!caption) {
      throw new Error("AI could not generate a caption");
    }
    res.status(200).json({
      success: true,
      caption,
    });
  } catch (error) {
    console.error("Generate caption error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const rewriteMessage = async (req, res) => {
  try {
    const { message, tone } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid message is required",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Rewrite the message in a ${tone || "friendly"} tone. Return only the rewritten message`,
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],
    });

    const rewrittenMessage = completion.choices[0]?.message?.content;

    if (!rewrittenMessage) {
      throw new Error("AI could not rewrite the message");
    }

    res.status(200).json({
      success: true,
      message: rewriteMessage,
    });
  } catch (error) {
    console.error("Rewrite message error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
