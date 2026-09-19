"""Lightweight RAG Knowledge Retrieval Service.

Loads structured knowledge from water_conservation.json and performs fast,
dependency-free keyword & TF-IDF style relevance scoring to retrieve the most
salient advice for user questions.
"""

import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional
from ..models.chat import SourceCitation


STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can", "could", "did", "do", "does",
    "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has",
    "have", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his",
    "how", "i", "if", "in", "into", "is", "isn't", "it", "its", "itself", "just",
    "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on",
    "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
    "own", "same", "should", "so", "some", "such", "than", "that", "the", "their",
    "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those",
    "through", "to", "too", "under", "until", "up", "very", "was", "we", "were",
    "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would",
    "you", "your", "yours", "yourself", "yourselves", "tell", "give", "much", "many"
}


class RagKnowledgeService:
    _instance: Optional["RagKnowledgeService"] = None
    _knowledge_items: List[Dict[str, Any]] = []

    def __init__(self):
        self._load_knowledge()

    @classmethod
    def get_instance(cls) -> "RagKnowledgeService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load_knowledge(self) -> None:
        json_path = Path(__file__).parent.parent / "knowledge" / "water_conservation.json"
        if not json_path.exists():
            # Fallback path if working dir differs
            alt_path = Path("backend/app/knowledge/water_conservation.json")
            if alt_path.exists():
                json_path = alt_path
        
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                self._knowledge_items = json.load(f)
        except Exception as e:
            self._knowledge_items = []

    def get_all_items(self) -> List[Dict[str, Any]]:
        return self._knowledge_items

    def _tokenize(self, text: str) -> List[str]:
        # Lowercase and extract alphanumeric words
        words = re.findall(r"\b[a-zA-Z0-9_\-]+\b", text.lower())
        return [w for w in words if len(w) > 2 and w not in STOP_WORDS]

    def search(self, query: str, top_k: int = 3) -> List[SourceCitation]:
        if not self._knowledge_items:
            self._load_knowledge()

        query_lower = query.lower()
        query_tokens = self._tokenize(query)

        scored_results: List[tuple[float, Dict[str, Any]]] = []

        for item in self._knowledge_items:
            score = 0.0
            topic_lower = item.get("topic", "").lower()
            content_lower = item.get("content", "").lower()
            keywords = [k.lower() for k in item.get("keywords", [])]

            # 1. Exact phrase matches
            if any(term in query_lower for term in keywords if len(term.split()) > 1):
                score += 8.0

            # 2. Token matches across keywords, topic, and content
            for token in query_tokens:
                # Direct keyword hit
                if any(token == k or token in k.split() for k in keywords):
                    score += 4.5
                # Topic hit
                if token in topic_lower:
                    score += 3.0
                # Content hit
                if token in content_lower:
                    score += 1.0

            # Boost if query mentions specific domain words
            domain_synonyms = {
                "shower": ["shower", "bathing", "aerator"],
                "toilet": ["toilet", "flush", "flapper", "cistern"],
                "dish": ["dish", "dishes", "dishwashing", "basin", "sink"],
                "laundry": ["laundry", "clothes", "washing machine"],
                "leak": ["leak", "leaking", "dripping", "seep"],
                "garden": ["garden", "plants", "watering", "lawn"],
                "car": ["car", "vehicle", "bike", "hosepipe"],
                "sdg": ["sdg", "sustainability", "goal 6", "un"],
                "rain": ["rain", "rainwater", "harvesting"],
                "greywater": ["greywater", "reuse", "recycled"],
            }

            for key, syns in domain_synonyms.items():
                if any(syn in query_lower for syn in syns):
                    if any(syn in topic_lower or any(syn in kw for kw in keywords) for syn in syns):
                        score += 3.5

            if score > 0:
                scored_results.append((score, item))

        # Sort by score descending
        scored_results.sort(key=lambda x: x[0], reverse=True)

        citations: List[SourceCitation] = []
        # If no scores match, take default general & sdg items
        selected_items = scored_results[:top_k] if scored_results else [
            (1.0, item) for item in self._knowledge_items[:top_k]
        ]

        for score, item in selected_items:
            # Create a crisp snippet (max 180 chars)
            content = item.get("content", "")
            snippet = content[:180] + "..." if len(content) > 180 else content
            citations.append(
                SourceCitation(
                    id=item.get("id", "kb-0"),
                    topic=item.get("topic", "Water Conservation"),
                    source=item.get("source", "Standard Guidelines"),
                    relevance_score=round(score, 2),
                    snippet=snippet,
                )
            )

        return citations
