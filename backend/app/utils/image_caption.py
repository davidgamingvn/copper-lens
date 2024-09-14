import google.generativeai as genai
from PIL import Image
from config import Config
import io

# Initialize Google Generative AI Embeddings
genai.configure(api_key=Config.GOOGLE_API_KEY)
caption_model = genai.GenerativeModel('gemini-1.5-flash')

def generate_image_caption_genai(image_data):
    image = Image.open(image_data)
    generation_config = genai.types.GenerationConfig(temperature=0.4)
    user_prompt = Config.GENERATE_CAPTION_PROMPT
    caption = caption_model.generate_content(
        [user_prompt, image],
        generation_config=generation_config
    )
    return caption.text
