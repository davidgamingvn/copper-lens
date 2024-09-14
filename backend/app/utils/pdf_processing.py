from PyPDF2 import PdfReader
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from spire.pdf.common import *
from spire.pdf import *
import json
import uuid
from .image_caption import generate_image_caption_genai

def extract_text_from_pdf(pdf_file, filename, gcs_client):
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + '\n'

    # Filter the extracted text
    filtered_text = filter_text(text)
    bullets = {
        "id": str(uuid.uuid4()),
        "name": filename,
        "text": 
            [filtered_text[0], filtered_text[1], filtered_text[2]]
    }

    update_bullets_json([bullets], gcs_client)
    # Need a full text for detailed analysis
    return text


def extract_images_from_pdf(pdf_file, filename, images_folder, gcs_client):
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

    update_captions_json(captions, gcs_client)
    doc.Close()
    return captions


def filter_text(text):
    # load the model
    llm = ChatGoogleGenerativeAI(model='gemini-pro', temperature=0.4)

    # set up a prompt
    prompt = PromptTemplate(
        input_variables=['text'],
        template=''' You are given this text:"{text}".
            I want to filter out only the most important information from the text.
            Ignore any unnecessary details and provide me with a concise summary.
            Please filter out the information and provide me with the filtered information.
            Give me the filtered information in 3 bullet points.
        '''
    )

    # create a chain
    chain = LLMChain(llm=llm, prompt=prompt, verbose=False)
    response = chain.invoke(input={'text': text})
    

    # process text
    text = response['text']
    text = text.split('\n')
    return text


def update_bullets_json(new_bullets, gcs_client):
    # Try to download existing bullets.json
    try:
        existing_json = gcs_client.download_as_string("bullets.json")
        existing_bullets = json.loads(existing_json)
    except Exception:
        # If file doesn't exist or there's an error, start with an empty list
        existing_bullets = {"bullets": []}

    # Update existing bullets with new ones
    existing_bullets["bullets"].extend(new_bullets)

    # Remove duplicates based on bullet text
    unique_bullets = {
        tuple(bullet["text"]): bullet for bullet in existing_bullets["bullets"]}
    existing_bullets["bullets"] = list(unique_bullets.values())

    # Upload updated JSON back to GCS
    updated_json = json.dumps(existing_bullets, indent=2)
    gcs_client.upload_from_string(updated_json, "bullets.json")
    print("Updated bullets.json in GCS")


def update_captions_json(new_captions, gcs_client):
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
