
from pathlib import Path

PROJECT_ROOT_DIR = Path(__file__).resolve().parents[3]
MODEL_CACHE_DIR = PROJECT_ROOT_DIR / ".models"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_BATCH_SIZE = 8


class EmbeddingService:
    def __init__(self):
        self.model = None

    def _get_model(self):
        if self.model is None:
            from sentence_transformers import SentenceTransformer

            self.model = SentenceTransformer(
                MODEL_NAME,
                cache_folder=str(MODEL_CACHE_DIR),
                device="cpu",
            )

        return self.model

    def generate(
        self,
        texts: list[str],
    ) -> list[list[float]]:
        if not texts:
            return []

        model = self._get_model()

        embeddings = model.encode(
            texts,
            batch_size=EMBEDDING_BATCH_SIZE,
            show_progress_bar=False,
            convert_to_numpy=True,
            device="cpu",
        )

        return embeddings.tolist()


embedding_service = EmbeddingService()
