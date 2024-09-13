import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
    INDEX_NAME = os.getenv('INDEX_NAME')
    EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL')
<<<<<<< Updated upstream
=======
    GENERATE_CAPTION_PROMPT = os.getenv('GENERATE_CAPTION_PROMPT')
    UPLOAD_FOLDER = './uploads'
    IMAGES_FOLDER = './images'
>>>>>>> Stashed changes
    pass
