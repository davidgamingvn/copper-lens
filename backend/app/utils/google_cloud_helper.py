from google.cloud.storage import Client, transfer_manager
from flask import current_app

# initialize storage client and bucket
storage_client = Client()

def upload_pdf_to_gcs(file, filename):
    bucket = storage_client.bucket(current_app.config['GCS_BUCKET_NAME'])
    blob_name = f"PDFs/{filename}"
    blob = bucket.blob(blob_name)
    blob.upload_from_string(
        file.read(),
        content_type=file.content_type
    )
    return blob.public_url, blob_name

# Download PDF from GCS as bytes array.
# blob_name: folder_name/file_name
def download_pdf_from_gcs(filename):
    bucket = storage_client.bucket(current_app.config['GCS_BUCKET_NAME'])
    blob = bucket.blob(f"PDFs/{filename}")
    return blob.download_as_bytes()

# Download PDF from GCS as file.
def download_pdf_from_gcs_as_file(filename):
    bucket = storage_client.bucket(current_app.config['GCS_BUCKET_NAME'])
    blob = bucket.blob(f"PDFs/{filename}")
    local_path = f"./tmp/{filename}"
    with open(local_path, 'wb') as file:
        blob.download_to_file(file)
    return local_path

def upload_image_to_gcs(file, filename):
    bucket = storage_client.bucket(current_app.config['GCS_BUCKET_NAME'])
    blob = bucket.blob(f"Images/{filename}")
    blob.upload_from_string(
        file.read(),
        content_type=file.content_type
    )
    return blob.public_url