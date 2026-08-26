import axios from 'axios';
import { parseGoalFallback } from '../engine/goalParser';
import { routeChatAction } from '../engine/chatActionRouter';

// ─── Keys ─────────────────────────────────────────────────────────────────────
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ─── HF Config ────────────────────────────────────────────────────────────────
const HF_MODEL = 'Qwen/Qwen2.5-7B-Instruct';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// ─── Gemini Config ────────────────────────────────────────────────────────────
// Confirmed working via API probe: gemini-2.5-flash responds correctly.
// gemini-3.7-flash used as secondary if primary returns 503.
const GEMINI_PRIMARY = 'gemini-2.5-flash';
const GEMINI_SECONDARY = 'gemini-3.7-flash';

const geminiUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Shared Gemini caller with automatic model fallback.
 * Tries gemini-2.5-flash first, falls back to gemini-3.7-flash.
 */
async function callGemini(payload) {
  try {
    console.log(`[AI] Calling ${GEMINI_PRIMARY}...`);
    const res = await axios.post(geminiUrl(GEMINI_PRIMARY), payload);
    return res.data.candidates[0].content.parts[0].text;
  } catch (err) {
    const code = err.response?.data?.error?.code;
    console.warn(`[AI] ${GEMINI_PRIMARY} failed (${code}), trying ${GEMINI_SECONDARY}...`);
    const res = await axios.post(geminiUrl(GEMINI_SECONDARY), payload);
    return res.data.candidates[0].content.parts[0].text;
  }
}

// ─── AI Service ───────────────────────────────────────────────────────────────
/**
 * Priority: HuggingFace → Gemini → Deterministic keyword fallback
 */
export const aiService = {

  parseGoal: async (input) => {
    if (HF_API_KEY) {
      try {
        console.log('[AI] parseGoal → HuggingFace');
        return await callHuggingFaceGoalParse(input);
      } catch (err) {
        console.warn('[AI] HF parseGoal failed:', err.message);
      }
    }
    if (GEMINI_API_KEY) {
      try {
        console.log('[AI] parseGoal → Gemini');
        return await callGeminiGoalParse(input);
      } catch (err) {
        console.warn('[AI] Gemini parseGoal failed:', err.message);
      }
    }
    console.log('[AI] parseGoal → deterministic fallback');
    return parseGoalFallback(input);
  },

  processChat: async (message, context, dispatch) => {
    if (HF_API_KEY) {
      try {
        console.log('[AI] processChat → HuggingFace');
        return await callHuggingFaceChat(message, context, dispatch);
      } catch (err) {
        console.warn('[AI] HF processChat failed:', err.message);
      }
    }
    if (GEMINI_API_KEY) {
      try {
        console.log('[AI] processChat → Gemini');
        return await callGeminiChat(message, context, dispatch);
      } catch (err) {
        console.warn('[AI] Gemini processChat failed:', err.message);
      }
    }
    console.log('[AI] processChat → deterministic fallback');
    return handleDeterministicChat(message, context, dispatch);
  },

  evaluateAssessment: async (skillId, answers, context, dispatch) => {
    if (GEMINI_API_KEY) {
      try {
        console.log('[AI] evaluateAssessment → Gemini');
        return await callGeminiAssessmentEvaluation(skillId, answers, context, dispatch);
      } catch (err) {
        console.warn('[AI] Gemini evaluation failed:', err.message);
      }
    }
    // Fallback if AI fails
    return {
      summary: "Based on your score, we've updated your path.",
      weakTopics: ["Review needed"],
      strongTopics: ["Passed topics"]
    };
  },

  generateQuestions: async (skillId, count = 5) => {
    if (GEMINI_API_KEY) {
      try {
        console.log('[AI] generateQuestions → Gemini');
        return await callGeminiQuestionGeneration(skillId, count);
      } catch (err) {
        console.warn('[AI] Gemini question generation failed:', err.message);
      }
    }
    // Fallback deterministic questions
    return generateDeterministicQuestions(skillId, count);
  }
};

// ─── HuggingFace Implementation ───────────────────────────────────────────────

async function callHuggingFaceGoalParse(input) {
  const prompt = `<|im_start|>system
You are an expert learning advisor. Extract the user's learning goal into JSON.
Return ONLY valid JSON (no markdown) matching this schema:
{
  "targetRole": "ml_engineer" | "data_analyst" | "fullstack_dev" | "cloud_engineer",
  "deadline": "<N> weeks",
  "availableHoursPerWeek": <number>,
  "knownSkills": ["..."],
  "suspectedGaps": ["..."],
  "learningPreference": "project-based" | "video" | "interactive" | "reading",
  "customTopics": ["topic1", "topic2"]
}
Note on customTopics: Extract any specific topics, tools, architectures, or domains the user mentions that they want to learn. Leave empty if they just want the standard path.
Use sensible defaults (10 hrs/week, "video" preference) for missing fields.
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
  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  } else {
    cleaned = cleaned.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
  }

  const parsed = JSON.parse(cleaned);
  const weeks = parseInt(parsed.deadline) || 12;
  parsed.totalBudgetHours = weeks * (parsed.availableHoursPerWeek || 10);
  return parsed;
}

async function callHuggingFaceChat(message, context, dispatch) {
  const prompt = `<|im_start|>system
You are the Adaptive Learning Navigator AI. Help users manage their learning path.
User context: Goal=${context.goal?.targetRole || 'unknown'}, Path status=${context.pathStatus || 'planning'}.
Return ONLY valid JSON (no markdown):
{ "reply": "<response>", "action": { "type": "<type>", "payload": {} } | null }
Valid types: ADD_SKILL, REMOVE_SKILL, UPDATE_CONSTRAINT, TRIGGER_RECOVERY, REPLAN
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
  text = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();

  const result = JSON.parse(text);
  if (result.action) routeChatAction(result.action.type, result.action.payload, context, dispatch);
  return result.reply;
}

// ─── Gemini Implementation ────────────────────────────────────────────────────

async function callGeminiGoalParse(input) {
  const prompt = `You are an expert learning advisor. Parse the user's learning goal.
Return ONLY a valid JSON object with NO markdown fences:
{
  "targetRole": "ml_engineer" | "data_analyst" | "fullstack_dev" | "cloud_engineer",
  "deadline": "<N> weeks",
  "availableHoursPerWeek": <number>,
  "knownSkills": ["skill1"],
  "suspectedGaps": ["gap1"],
  "learningPreference": "project-based" | "video" | "interactive" | "reading",
  "customTopics": ["topic1", "topic2"]
}
Note on customTopics: Extract any specific topics, tools, architectures, or domains the user mentions that they want to learn (e.g., "LLMs", "Transformers", "Neural Networks", "React Native"). Leave empty if they just want the standard path.
Use sensible defaults for unknown fields.
User input: ${input}`;

  const text = await callGemini({
    contents: [{ parts: [{ text: prompt }] }]
  });

  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  } else {
    cleaned = cleaned.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
  }
  
  const parsed = JSON.parse(cleaned);
  const weeks = parseInt(parsed.deadline) || 12;
  parsed.totalBudgetHours = weeks * (parsed.availableHoursPerWeek || 10);
  return parsed;
}

async function callGeminiChat(message, context, dispatch) {
  const existingSkills = Object.keys(context.capabilityGraph?.nodes || {}).join(', ');
  const currentPath = (context.currentPath || []).map(n => n.skillId).join(', ');

  const prompt = `You are the Adaptive Learning Navigator AI for a personalized LMS.
User context:
- Goal role: ${context.goal?.targetRole || 'unknown'}
- Path status: ${context.pathStatus || 'planning'}
- Current path skills: ${currentPath || 'none yet'}
- Known graph skills: ${existingSkills}

Analyze the user's message and respond with ONLY valid JSON (no markdown, no fences):
{
  "reply": "<friendly concise response>",
  "action": <action object or null>
}

AVAILABLE ACTIONS — pick the most appropriate one:

1. Add a SINGLE existing skill:
   {"type": "ADD_SKILL", "payload": {"skillId": "<existing_skill_id>"}}

2. Add a NEW TOPIC with full sub-skill breakdown (use when user asks about a broad concept not in the graph, or wants to explore something deeply):
   {"type": "ADD_SUBTREE", "payload": {"topic": "<topic name>", "nodes": [
     {
       "id": "<snake_case_id>", 
       "label": "<Human Label>", 
       "category": "<category>", 
       "estimatedHours": <number>, 
       "prerequisites": ["<id>"], 
       "unlocks": ["<id>"],
       "resourceTitle": "<Title of a suggested learning resource>",
       "resourceUrl": "<URL to a real tutorial, documentation, or video>"
     },
     ... (put ALL related sub-skills, properly linked)
   ]}}
   IMPORTANT: For ADD_SUBTREE, include ALL prerequisite and unlock relationships between the new nodes. Always start from foundational nodes (prerequisites: []) and build up. Make sure to provide a valid, highly-relevant real-world URL for resourceUrl (like YouTube, official docs, or reputable tutorials) so the user actually has content to learn from.

3. Remove one or more skills from the path (e.g. if user already knows them):
   {"type": "REMOVE_SKILLS", "payload": {"skillIds": ["<skill_id_1>", "<skill_id_2>"]}}

4. Update estimated hours for a skill:
   {"type": "CONFIGURE_SKILL", "payload": {"skillId": "<skill_id>", "estimatedHours": <number>}}

5. Replan the entire path:
   {"type": "REPLAN"}

6. No action needed:
   null

RULES:
- Use ADD_SUBTREE when user mentions a broad topic like "reinforcement learning", "computer vision", "NLP", "system design", etc.
- Use ADD_SKILL only for simple, specific additions of already-known skills.
- Use REMOVE_SKILLS to remove skills. Match the exact skillIds from the current path.
- NEVER use REPLAN just to remove skills or add skills. Only use REPLAN if the user wants to start over.
- Always return exactly one action or null.

Recent Chat History:
${(context.chatHistory || []).slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User message: ${message}`;

  const text = await callGemini({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
    tools: [{ googleSearch: {} }]
  });

  let cleaned = text.trim().replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
  // Gemini sometimes wraps in a text block before/after JSON — extract the JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];

  const result = JSON.parse(cleaned);
  if (result.action) routeChatAction(result.action.type, result.action.payload, context, dispatch);
  return result.reply;
}

async function callGeminiAssessmentEvaluation(skillId, answers, context, dispatch) {
  const prompt = `You are an Adaptive Learning AI. The user just completed an assessment for the skill '${skillId}'.
Here are their answers:
${JSON.stringify(answers, null, 2)}

Here is the capability graph of available topics:
${JSON.stringify(Object.keys(context.capabilityGraph?.nodes || {}))}

Analyze their performance. What are their strong topics? What are their weak topics based on the questions they got wrong?
Based on this, you can optionally decide to dispatch ONE action to update their path. For example, if they failed a specific concept that exists in the graph, use ADD_SUBTREE to add that missing concept. 

Return ONLY valid JSON (no markdown):
{
  "summary": "<friendly message about their performance>",
  "strongTopics": ["topic1", "topic2"],
  "weakTopics": ["topic3"],
  "action": { "type": "<type>", "payload": {} } | null
}

Valid action types:
- ADD_SUBTREE (use to add remediation concepts. Payload: { nodes: [{ id: "new_id", label: "Label", prerequisites: ["entry_node_id"] }] })
- REPLAN (just replan the existing path)
- null (do nothing if they did perfectly)
`;

  const text = await callGemini({
    contents: [{ parts: [{ text: prompt }] }]
  });

  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];

  const result = JSON.parse(cleaned);
  if (result.action && result.action.type) {
    routeChatAction(result.action.type, result.action.payload, context, dispatch);
  }
  return result;
}

async function callGeminiQuestionGeneration(skillId, count) {
  const prompt = `You are an expert educator. Generate exactly ${count} assessment questions for the topic/skill '${skillId}'. 
Vary the difficulty. 
Mix the question types between:
1. "multiple_choice" (4 options)
2. "true_false" (options must be strictly ["True", "False"])
3. "scenario" (provide a 'scenario' field with a paragraph of context, then a multiple choice question about it)

Format the output strictly as a JSON array of objects. DO NOT wrap in markdown.
Example format:
[
  {
    "id": "q1",
    "type": "multiple_choice",
    "question": "What is...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "B",
    "difficulty": "medium",
    "explanation": "Because B is the right answer."
  },
  {
    "id": "q2",
    "type": "true_false",
    "question": "The sky is green.",
    "options": ["True", "False"],
    "correctAnswer": "False",
    "difficulty": "easy",
    "explanation": "The sky is blue."
  },
  {
    "id": "q3",
    "type": "scenario",
    "scenario": "You have a dataset with 50% missing values in a critical column.",
    "question": "What is the best approach?",
    "options": ["Drop column", "Impute mean", "Use a model that handles missing data", "Replace with 0"],
    "correctAnswer": "Use a model that handles missing data",
    "difficulty": "hard",
    "explanation": "Dropping loses information, mean imputation skews variance..."
  }
]
`;

  const text = await callGemini({
    contents: [{ parts: [{ text: prompt }] }]
  });

  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (jsonMatch) cleaned = jsonMatch[0];

  return JSON.parse(cleaned);
}

function generateDeterministicQuestions(skillId, count) {
  const formattedTitle = skillId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return Array.from({ length: count }).map((_, i) => ({
    id: `q_${skillId}_${i}`,
    type: 'multiple_choice',
    question: `What is the primary purpose of ${formattedTitle}? (Question ${i + 1})`,
    options: ['To increase complexity', 'To solve specific domain problems', 'To reduce performance', 'None of the above'],
    correctAnswer: 'To solve specific domain problems',
    difficulty: 'easy',
    explanation: `This is a fallback deterministic explanation for ${formattedTitle}.`
  }));
}

// ─── Deterministic Fallback ───────────────────────────────────────────────────

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
    return "I can't reliably remove skills without AI reasoning. Please use the Canvas to edit your path manually.";
  }

  return "I'm in offline fallback mode. Try 'replan my path' or 'start journey'. For full AI reasoning, ensure your VITE_GEMINI_API_KEY is set and the dev server is restarted.";
}
