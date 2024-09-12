import os
from PyPDF2 import PdfReader
from spire.pdf.common import *
from spire.pdf import *

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

    for i in range(doc.Pages.Count):
        images_info = image_helper.GetImagesInfo(doc.Pages[i])
        # Get the images and save them as image files
        for j in range(len(images_info)):
            image_info = images_info[j]
            output_file = os.path.join(images_folder, f"{filename}_{index}.png")
            image_info.Image.Save(output_file)
            index += 1

    doc.Close()