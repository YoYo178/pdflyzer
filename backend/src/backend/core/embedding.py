
class EmbeddingService:
    def __init__(self):
        self.model = None

    def _get_model(self):
        if self.model is None:
            from sentence_transformers import SentenceTransformer

            self.model = SentenceTransformer(
                "sentence-transformers/all-MiniLM-L6-v2",
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
            batch_size=8,
            show_progress_bar=False,
            convert_to_numpy=True,
            device="cpu",
        )

        return embeddings.tolist()


embedding_service = EmbeddingService()
