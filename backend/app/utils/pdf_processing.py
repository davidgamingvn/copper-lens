import os
import io
from PyPDF2 import PdfReader
from spire.pdf.common import *
from spire.pdf import *
from google.cloud import storage
from .google_cloud_helper import download_pdf_from_gcs, upload_image_to_gcs

# Used for local storage
def extract_text_from_pdf(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + '\n'
    return text

# Used for GCS storage
def extract_text_from_pdf_gcs(filename):
    pdf_content_bytes = download_pdf_from_gcs(filename)
    pdf_file = io.BytesIO(pdf_content_bytes)
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + '\n'
    return text

# Used for GCS storage
def extract_images_from_pdf_gcs(filename):
    pdf_content_bytes = download_pdf_from_gcs(filename)
    pdf_file = io.BytesIO(pdf_content_bytes)
    doc = PdfDocument(io.BytesIO(pdf_content_bytes))
    # doc.LoadFromStream(pdf_file)

    # Create a PdfImageHelper object
    image_helper = PdfImageHelper()
    index = 0

    for i in range(doc.Pages.Count):
        images_info = image_helper.GetImagesInfo(doc.Pages[i])
        # Get the images and save them as image files
        for j in range(len(images_info)):
            image_info = images_info[j]
            # Create an in-memory bytes buffer
            img_byte_arr = io.BytesIO()
            image_info.Image.Save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)  # Move to the beginning of the BytesIO buffer

            # Upload the image to GCS
            url = upload_image_to_gcs(img_byte_arr, f"{filename}_{index}.png")
            print(f"Uploaded image {index} to {url}")

            # Create a blob and upload the image
            # blob_name = f"Images/{filename}_{index}.png"
            # blob = storage.Client().bucket("sparkchallenge_images").blob(blob_name)
            # blob.upload_from_file(img_byte_arr, content_type="image/png")

            # print(f"Uploaded image {index} to {blob_name}")
            index += 1

    doc.Close()

# Used for local storage
def extract_images_from_pdf(pdf_file, filename, images_folder):
    doc = PdfDocument()
    doc.LoadFromFile(pdf_file)

    # Create a PdfImageHelper object
    image_helper = PdfImageHelper()
    index = 0

    for i in range(doc.Pages.Count):
        images_info = image_helper.GetImagesInfo(doc.Pages[i])
        # Get the images and save them as image files
        for j in range(len(images_info)):
            image_info = images_info[j]
            output_file = os.path.join(images_folder, f"{filename}_{index}.png")
            image_info.Image.Save(output_file)
            index += 1

    doc.Close()