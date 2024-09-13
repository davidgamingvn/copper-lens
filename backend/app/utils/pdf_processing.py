from PyPDF2 import PdfReader
from spire.pdf.common import *
from spire.pdf import *
from PIL import Image
import io
import json
from .gcs_client import GCSClient
from .image_caption import generate_image_caption_genai
import concurrent.futures


gcs_client = GCSClient('sparkchallenge_images',
                       credentials_path='app/utils/gcs_client/credentials.json')


def extract_text_from_pdf(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + '\n'
    return text


def extract_images_from_pdf(pdf_file, filename, images_folder):
    doc = PdfDocument()
    doc.LoadFromFile(pdf_file)

    # Create a PdfImageHelper object
    image_helper = PdfImageHelper()
    index = 0
    captions = []

    for i in range(doc.Pages.Count):
        images_info = image_helper.GetImagesInfo(doc.Pages[i])
        for j in range(len(images_info)):
            image_info = images_info[j]
            local_image_path = os.path.join(
                images_folder, f"{filename}_{index}.png")
            image_info.Image.Save(local_image_path)

            # Upload image to GCS
            gcs_image_path = f"Images/{filename}_{index}.png"
            gcs_client.upload_file(local_image_path, gcs_image_path)
            print(f"Uploaded {gcs_image_path} to GCS")

            caption = generate_image_caption_genai(local_image_path)
            print(f"Generated caption: {caption}")

            captions.append({
                "name": f"{filename}_{index}.png",
                "caption": caption
            })

            # Clean up local image file
            os.remove(local_image_path)
            index += 1

    update_captions_json(captions)
    doc.Close()


def update_captions_json(new_captions):
    # Try to download existing captions.json
    try:
        existing_json = gcs_client.download_as_string("captions.json")
        existing_captions = json.loads(existing_json)
    except Exception:
        # If file doesn't exist or there's an error, start with an empty list
        existing_captions = {"captions": []}

    # Update existing captions with new ones
    existing_captions["captions"].extend(new_captions)

    # Remove duplicates based on image name
    unique_captions = {
        caption["name"]: caption for caption in existing_captions["captions"]}
    existing_captions["captions"] = list(unique_captions.values())

    # Upload updated JSON back to GCS
    updated_json = json.dumps(existing_captions, indent=2)
    gcs_client.upload_from_string(updated_json, "captions.json")
    print("Updated captions.json in GCS")
