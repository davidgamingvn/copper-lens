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

# Download PDF from GCS.
# blob_name: folder_name/file_name
def download_pdf_from_gcs(filename):
    bucket = storage_client.bucket(current_app.config['GCS_BUCKET_NAME'])
    blob = bucket.blob(f"PDFs/{filename}")
    return blob.download_as_bytes()

def upload_image_to_gcs(file, filename):
    bucket = storage_client.bucket(current_app.config['GCS_BUCKET_NAME'])
    blob = bucket.blob(f"Images/{filename}")
    blob.upload_from_string(
        file.read(),
        content_type=file.content_type
    )
    return blob.public_url