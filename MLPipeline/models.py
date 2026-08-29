from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum

class Role(str, Enum):
    STUDENT = "STUDENT"
    MENTOR = "MENTOR"
    ADMIN = "ADMIN"

class LearnerContext(BaseModel):
    user_id: int
    email: str
    role: Role
    xp: int
    current_streak: int
    target_career_goal: Optional[str] = Field(default="Full-Stack Developer", description="The career path the student wants to pursue")

class IntentRequest(BaseModel):
    query: str
    learner_context: LearnerContext

class IntentResponse(BaseModel):
    intent_class: str
    confidence_score: float
    extracted_entities: Dict[str, Any]

class GraphNodeDTO(BaseModel):
    id: int
    title: str
    description: str
    concept_type: str = Field(..., description="e.g., CORE, ADVANCED, PRACTICAL")
    estimated_minutes: int
    xp_reward: int
    prerequisite_ids: List[int] = []

class PathGenerationRequest(BaseModel):
    learner: LearnerContext
    available_graph_nodes: List[GraphNodeDTO]
    completed_node_ids: List[int]
    query_intent: Optional[str] = "Generate optimal learning path"

class GeneratedPathMilestone(BaseModel):
    node_id: int
    reasoning: str
    confidence_score: float

class PathGenerationResponse(BaseModel):
    milestones: List[GeneratedPathMilestone]
    overall_strategy: str
    cached_hit: bool = False

