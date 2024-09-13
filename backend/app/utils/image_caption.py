import google.generativeai as genai
from PIL import Image
# from config import Config
import numpy as np
import torch
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Google Generative AI Embeddings
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
caption_model = genai.GenerativeModel('gemini-1.5-flash')

# Load model directly
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# nlpconnect / vit-gpt2-image-captioning
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer

vit_model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
vit_model.to(device)

max_length = 16
num_beams = 4
gen_kwargs = {"max_length": max_length, "num_beams": num_beams}

def generate_image_caption_vit(image_path):
    image = Image.open(image_path).convert("RGB")
    text = "a picture relate copper mining industry of"
    inputs = feature_extractor(images=[image], text=text, return_tensors="pt")
    outputs = vit_model.generate(inputs.pixel_values.to(device), **gen_kwargs)
    caption = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(caption)

def generate_image_caption(image_path):
    # Load and preprocess the image
    image = Image.open(image_path)
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = image.astype(np.float32)
    image = np.transpose(image, (2, 0, 1))
    image = torch.tensor(image)

    # Generate image caption
    inputs = processor(image, return_tensors="pt", padding="max_length", max_length=128, truncation=True)
    with torch.no_grad():
        outputs = model.generate(**inputs)
    caption = processor.decode(outputs[0], skip_special_tokens=True)

    return caption

def generate_image_caption_genai(image_path):
    image = Image.open(image_path)
    caption = caption_model.generate_content(['This image is from document about copper mining industry. Write a caption for it.', image])
    print(caption.text)

def generate_image_no_resize(image_path):
    image = Image.open(image_path).convert("RGB")
    text = "a picture in copper mining industry of"
    inputs = processor(images=image, text=text, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=4000)
    caption = processor.decode(outputs[0], skip_special_tokens=True)
    print(caption)

def generate_image_caption_from_url(image_url):
    image = Image.open(requests.get(url, stream=True).raw)
    print(image)
    text = "A picture that relate to mining industry"
    inputs = processor(images=image, text=text, return_tensors="pt")
    # outputs = model(**inputs)
    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=200)

    caption = processor.decode(outputs[0], skip_special_tokens=True)
    # print(caption)

path = "C:\\Users\\VienD\\PythonCode\\copper-lens\\backend\\images\\image71.png"
url = "http://images.cocodataset.org/val2017/000000039769.jpg"

generate_image_caption_vit(path)
# generate_image_caption_genai(path)
# generate_image_no_resize(path)
# generate_image_caption_from_url(url)
# caption = generate_image_caption(path)
# print(caption)