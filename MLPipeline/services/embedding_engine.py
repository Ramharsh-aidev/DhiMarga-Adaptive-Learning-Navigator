from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Tuple
import logging

logger = logging.getLogger(__name__)

class SemanticCache:
    def __init__(self, threshold: float = 0.85):
        logger.info("Initializing HuggingFace Sentence-Transformers...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.threshold = threshold
        # In-memory cache: List of Tuples (embedding_vector, response_data)
        # In production, this maps to pgvector or Redis
        self.cache: List[Tuple[np.ndarray, dict]] = []

    def get_embedding(self, text: str) -> np.ndarray:
        return self.model.encode(text)

    def _cosine_similarity(self, u: np.ndarray, v: np.ndarray) -> float:
        """ Calculates Sim(u,v) = (u . v) / (||u|| ||v||) as defined in architecture """
        return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))

    def search_cache(self, query: str) -> dict:
        if not self.cache:
            return None
            
        query_emb = self.get_embedding(query)
        
        best_match = None
        highest_sim = -1.0
        
        for cached_emb, cached_response in self.cache:
            sim = self._cosine_similarity(query_emb, cached_emb)
            if sim > highest_sim:
                highest_sim = sim
                best_match = cached_response
                
        if highest_sim >= self.threshold:
            logger.info(f"Semantic Cache Hit! Similarity: {highest_sim:.3f}")
            return best_match
            
        return None

    def add_to_cache(self, query: str, response: dict):
        query_emb = self.get_embedding(query)
        self.cache.append((query_emb, response))
        # Optional: Evict old items if cache gets too large
