"""Tests for the lightweight RAG retrieval engine."""

from backend.app.services.rag_service import RagKnowledgeService


def test_rag_service_loads_items():
    service = RagKnowledgeService.get_instance()
    items = service.get_all_items()
    assert len(items) >= 10
    # Every item must have topic, content, source, and keywords
    for item in items:
        assert "topic" in item
        assert "content" in item
        assert "source" in item
        assert "keywords" in item
        assert isinstance(item["keywords"], list)


def test_rag_shower_query():
    service = RagKnowledgeService.get_instance()
    results = service.search("How can I save water in the shower?", top_k=3)
    assert len(results) > 0
    # Top result should mention shower or aerator
    top_topics = [r.topic.lower() for r in results]
    assert any("shower" in t or "bathing" in t for t in top_topics)


def test_rag_toilet_leak_query():
    service = RagKnowledgeService.get_instance()
    results = service.search("How do I test if my toilet has a silent leak?", top_k=3)
    assert len(results) > 0
    top_topics = [r.topic.lower() for r in results]
    assert any("leak" in t or "toilet" in t for t in top_topics)
