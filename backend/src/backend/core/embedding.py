from pathlib import Path
from sentence_transformers import SentenceTransformer

PROJECT_ROOT_DIR = Path(__file__).resolve().parents[3]
MODEL_CACHE_DIR = PROJECT_ROOT_DIR / ".models"

class EmbeddingService():
    def __init__(self):
        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2",
            cache_folder=str(MODEL_CACHE_DIR),
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