from sentence_transformers import SentenceTransformer

class EmbeddingService():
    def __init__(self):
        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )
        
    def generate(
        self,
        texts: list[str]
    ) -> list[list[float]]:
        embeddings = self.model.encode(
            texts,
            batch_size=32,
            show_progress_bar=False
        )
        
        return embeddings.tolist()
    
embedding_service = EmbeddingService()