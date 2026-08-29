import os
import google.generativeai as genai
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class GeminiOrchestrator:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY", "mock_key")
        genai.configure(api_key=api_key)
        # Using Gemini 1.5 Pro for complex structured output
        self.model = genai.GenerativeModel('gemini-1.5-pro-latest')

    def generate_learning_path(self, context: dict, available_nodes: list, intent: str) -> Dict[str, Any]:
        """ Uses Gemini Function Calling / Structured Output to map intent to graph nodes """
        
        prompt = f"""
        You are the core AI orchestration engine for 'DhiMārga' - a Production-Grade Personalized Learning Path Recommender.
        
        Your objective is to generate the optimal sequence of learning nodes (Milestones) for this specific student.
        
        === LEARNER CONTEXT ===
        - Target Career Goal: {context.get('target_career_goal')}
        - Current XP: {context.get('xp')}
        - Current Streak: {context.get('current_streak')} Days
        - User Query/Intent: "{intent}"
        
        === AVAILABLE UNLOCKED CAPABILITY GRAPH NODES ===
        These nodes have already passed a topological sort and prerequisite validation. You may only select from these IDs:
        {json.dumps(available_nodes, indent=2)}
        
        === INSTRUCTIONS ===
        1. Analyze the learner's career goal and their current query/intent.
        2. Select the top 3 to 5 most relevant node IDs from the available list that will progress them toward their goal.
        3. Determine a confidence score (0.0 to 1.0) for why this node matches their intent.
        4. Provide a brief reasoning for each selected node.
        5. Provide an overall strategy summary.
        
        Output MUST strictly be valid JSON matching the following schema:
        {{
            "milestones": [
                {{
                    "node_id": 123,
                    "reasoning": "This core concept builds directly into...",
                    "confidence_score": 0.95
                }}
            ],
            "overall_strategy": "The strategy focuses on backend fundamentals first..."
        }}
        """
        
        logger.info(f"Invoking Gemini 1.5 Pro for User ID {context.get('user_id')} with intent: {intent}")
        
        try:
            # Mocking the actual call to avoid needing real API key during dry-run
            # In production: 
            # response = self.model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            # return json.loads(response.text)
            
            # Simulated DhiMarga structured JSON response
            return {
                "milestones": [
                    {
                        "node_id": n['id'],
                        "reasoning": f"Aligns with goal: {context.get('target_career_goal')}. Type: {n['concept_type']}",
                        "confidence_score": 0.88
                    } for n in available_nodes[:3]
                ],
                "overall_strategy": f"Optimized path designed to accelerate the transition to {context.get('target_career_goal')} based on current XP."
            }
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            return {
                "milestones": [],
                "overall_strategy": "Fallback due to API error."
            }
