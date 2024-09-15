import google.generativeai as genai
from PIL import Image
from config import Config
import io

# Initialize Google Generative AI Embeddings
genai.configure(api_key=Config.GOOGLE_API_KEY)
caption_model = genai.GenerativeModel('gemini-1.5-pro')
generation_config = genai.types.GenerationConfig(temperature=0.4)
user_prompt = Config.GENERATE_CAPTION_PROMPT

def generate_image_caption_genai(image_data):
    image = Image.open(image_data)
    caption = None
    while not caption:
        caption = caption_model.generate_content(
            [user_prompt, image],
            generation_config=generation_config
        )

    # Check if the response contains valid parts
    if caption and caption.text:
        return caption.text
    return "No caption generated"
