import axios from 'axios';
import { parseGoalFallback } from '../engine/goalParser';
import { routeChatAction } from '../engine/chatActionRouter';

// Environment variables
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Use Qwen or similar solid model on HF for reasoning
const HF_MODEL = 'Qwen/Qwen2.5-72B-Instruct';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

/**
 * AI Service integrating Hugging Face, Gemini fallback, and keyword fallback
 */
export const aiService = {
  
  /**
   * Parse user goal into structured GoalProfile
   */
  parseGoal: async (input) => {
    try {
      if (HF_API_KEY) {
        return await callHuggingFaceGoalParse(input);
      } else if (GEMINI_API_KEY) {
        return await callGeminiGoalParse(input);
      }
    } catch (error) {
      console.warn("AI Goal Parsing failed, using deterministic fallback.", error);
    }
    // Fallback if APIs fail or keys are missing
    return parseGoalFallback(input);
  },

  /**
   * Process a chat message from the user
   */
  processChat: async (message, context, dispatch) => {
    try {
      if (HF_API_KEY) {
        return await callHuggingFaceChat(message, context, dispatch);
      } else if (GEMINI_API_KEY) {
        return await callGeminiChat(message, context, dispatch);
      }
    } catch (error) {
      console.warn("AI Chat failed.", error);
    }
    
    // Deterministic fallback for basic chat commands
    return handleDeterministicChat(message, context, dispatch);
  }
};

// --- Hugging Face Implementations ---

async function callHuggingFaceGoalParse(input) {
  const prompt = `<|im_start|>system
You are an expert learning advisor. Extract the user's learning goal into JSON.
Return ONLY valid JSON matching this schema:
{
  "targetRole": "ml_engineer" | "data_analyst" | "fullstack_dev" | "cloud_engineer",
  "deadline": string (e.g. "10 weeks"),
  "availableHoursPerWeek": number,
  "knownSkills": [string],
  "suspectedGaps": [string],
  "learningPreference": "project-based" | "video" | "interactive" | "reading"
}
If a field is unknown, use sensible defaults (e.g. 10 hours/week, video preference).
<|im_end|>
<|im_start|>user
${input}<|im_end|>
<|im_start|>assistant
`;

  const response = await axios.post(
    HF_API_URL,
    { inputs: prompt, parameters: { max_new_tokens: 500, temperature: 0.1 } },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
  );

  let text = response.data[0].generated_text;
  text = text.substring(text.lastIndexOf('<|im_start|>assistant') + 21).trim();
  
  // Clean markdown json blocks if present
  if (text.startsWith('```json')) text = text.replace(/```json/g, '').replace(/```/g, '');
  
  const parsed = JSON.parse(text);
  
  // Calculate budget
  const weeks = parseInt(parsed.deadline) || 12;
  parsed.totalBudgetHours = weeks * (parsed.availableHoursPerWeek || 10);
  
  return parsed;
}

async function callHuggingFaceChat(message, context, dispatch) {
  // We prompt the AI to return a JSON object with { reply: "text", action: { type, payload } | null }
  const prompt = `<|im_start|>system
You are the Adaptive Learning Navigator AI. You help users manage their learning path.
User context: Goal=${context.goal?.targetRole}, Path status=${context.pathStatus}.
Analyze the user's message. Respond with a JSON object containing:
1. "reply": A friendly natural language response.
2. "action": An optional action to perform on the learning state. 
Valid actions: 
- {"type": "ADD_SKILL", "payload": {"skillId": "..."}}
- {"type": "REMOVE_SKILL", "payload": {"skillId": "..."}}
- {"type": "UPDATE_CONSTRAINT", "payload": {"field": "deadline", "value": "..."}}
- {"type": "TRIGGER_RECOVERY", "payload": {"skillId": "..."}}
- {"type": "REPLAN"}
- null
Return ONLY the JSON object.
<|im_end|>
<|im_start|>user
${message}<|im_end|>
<|im_start|>assistant
`;

  const response = await axios.post(
    HF_API_URL,
    { inputs: prompt, parameters: { max_new_tokens: 500, temperature: 0.3 } },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
  );

  let text = response.data[0].generated_text;
  text = text.substring(text.lastIndexOf('<|im_start|>assistant') + 21).trim();
  if (text.startsWith('```json')) text = text.replace(/```json/g, '').replace(/```/g, '');
  
  const result = JSON.parse(text);
  
  if (result.action) {
    routeChatAction(result.action.type, result.action.payload, context, dispatch);
  }
  
  return result.reply;
}

// --- Gemini Implementations (stubs for fallback) ---
async function callGeminiGoalParse(input) {
  // Similar to HF but using Gemini REST API format
  console.log("Using Gemini for Goal Parse");
  return parseGoalFallback(input); // Stubbing to fallback for now
}

async function callGeminiChat(message, context, dispatch) {
  console.log("Using Gemini for Chat");
  return handleDeterministicChat(message, context, dispatch); // Stubbing to fallback
}

// --- Deterministic Fallback ---
function handleDeterministicChat(message, context, dispatch) {
  const text = message.toLowerCase();
  
  if (text.includes('replan') || text.includes('update path')) {
    routeChatAction('REPLAN', null, context, dispatch);
    return "I've recalculated your learning path based on your latest progress.";
  }
  
  if (text.includes('start') || text.includes('ready')) {
    routeChatAction('START_JOURNEY', null, context, dispatch);
    return "Your journey has started! Let's get to work.";
  }
  
  if (text.includes('remove')) {
    return "I can't reliably remove skills without AI reasoning in fallback mode. Please use the Canvas to edit your path.";
  }
  
  return "I'm currently in offline fallback mode. I can understand basic commands like 'replan my path' or 'start journey', but complex reasoning requires an API key.";
}
