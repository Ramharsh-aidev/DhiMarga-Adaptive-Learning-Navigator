import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Read .env
const envPath = path.resolve('.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
  console.log("No .env file found in " + envPath);
}

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

console.log("Found VITE_HF_API_KEY:", !!envVars['VITE_HF_API_KEY']);
console.log("Found VITE_GEMINI_API_KEY:", !!envVars['VITE_GEMINI_API_KEY']);

const hfKey = envVars['VITE_HF_API_KEY'];
const geminiKey = envVars['VITE_GEMINI_API_KEY'];

async function testHF() {
  if (!hfKey) return console.log("Skipping HF test, no key.");
  console.log("Testing Hugging Face...");
  try {
    const res = await axios.post(
      'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct',
      { inputs: "Hello, testing 1 2 3.", parameters: { max_new_tokens: 10 } },
      { headers: { Authorization: `Bearer ${hfKey}` } }
    );
    console.log("HF Success! Response:", res.data);
  } catch (err) {
    console.error("HF Error:", err.response ? err.response.data : err.message);
  }
}

async function testGemini() {
  if (!geminiKey) return console.log("Skipping Gemini test, no key.");
  console.log("Testing Gemini 1.5 Flash...");
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      { contents: [{ parts: [{ text: "Hello, testing 1 2 3." }] }] }
    );
    console.log("Gemini Success!");
  } catch (err) {
    console.error("Gemini Error:", err.response ? err.response.data : err.message);
  }
}

async function run() {
  await testHF();
  await testGemini();
}

run();
