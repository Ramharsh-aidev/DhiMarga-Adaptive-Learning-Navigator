from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

class IntentClassificationEngine:
    def __init__(self):
        logger.info("Initializing DistilBERT Intent Classifier...")
        # Using a lightweight zero-shot classification pipeline based on DistilBERT or similar
        # In a real production setup, this would be a fine-tuned DistilBERT model
        self.classifier = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
        self.candidate_labels = [
            "generate_career_path",
            "request_prerequisite_explanation",
            "request_remediation_quiz",
            "request_portfolio_project",
            "general_help"
        ]

    def classify_intent(self, text: str) -> dict:
        try:
            result = self.classifier(text, self.candidate_labels)
            top_intent = result['labels'][0]
            confidence = result['scores'][0]
            
            return {
                "intent_class": top_intent,
                "confidence_score": confidence,
                "extracted_entities": {} # Mocked entity extraction
            }
        except Exception as e:
            logger.error(f"Intent classification failed: {e}")
            return {
                "intent_class": "general_help",
                "confidence_score": 0.0,
                "extracted_entities": {}
            }
