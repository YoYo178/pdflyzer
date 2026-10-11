import dns.asyncresolver
import dns.resolver
from beanie import init_beanie
from pymongo import AsyncMongoClient

from backend.models.chat import Chat
from backend.models.chat_document import ChatDocument
from backend.models.document_chunk import DocumentChunk
from backend.models.message import Message
from backend.models.stored_document import StoredDocument
from backend.models.user import User
from backend.settings import settings

nameservers = ["8.8.8.8", "1.1.1.1"]

dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = nameservers
dns.asyncresolver.default_resolver = dns.asyncresolver.Resolver(configure=False)
dns.asyncresolver.default_resolver.nameservers = nameservers

db_client = AsyncMongoClient(settings.mongodb_uri)
database = db_client[settings.db_name]

async def connect_db():
    print("[MongoDB] Initializing Beanie...")
    await init_beanie(database=database, document_models=[ChatDocument, Chat, DocumentChunk, Message, StoredDocument, User])
    print("[MongoDB] Beanie initialized successfully!")
