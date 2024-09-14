import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Google Generative AI Embeddings
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
caption_model = genai.GenerativeModel('gemini-1.5-flash')


def generate_image_caption_genai(image_path):
    image = Image.open(image_path)
    # Create a generation config with the specified temperature
    generation_config = genai.types.GenerationConfig(
        temperature=0.4
    )
    user_prompt = "This image is from document about Arizona copper mining industry. Write a caption for it."
    caption = caption_model.generate_content(
        [user_prompt, image],
        generation_config=generation_config)
    print(caption.text)

# def process_images_in_folder():

# path = "C:\\Users\\VienD\\PythonCode\\copper-lens\\backend\\images\\image71.png"
path = "C:\\Users\\VienD\\PythonCode\\copper-lens\\backend\\images\\2013-02-0532_water_consumption.pdf_3.png"
url = "http://images.cocodataset.org/val2017/000000039769.jpg"

generate_image_caption_genai(path)
# print(caption)