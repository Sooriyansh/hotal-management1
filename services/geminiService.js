const { GoogleGenerativeAI } = require("@google/generative-ai");
const hotelKnowledge = require("./hotelKnowledge");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

async function getConciergeReply(message) {
  const prompt = `
${hotelKnowledge}

Customer Question:
${message}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

module.exports = { getConciergeReply };