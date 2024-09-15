from google.cloud import storage
from google.oauth2 import service_account
import os


class GCSClient:
    def __init__(self, bucket_name, credentials_path=None):
        self.bucket_name = bucket_name
        if credentials_path:
            credentials = service_account.Credentials.from_service_account_file(
                credentials_path)
            self.client = storage.Client(credentials=credentials)
        else:
            self.client = storage.Client()
        self.bucket = self.client.get_bucket(self.bucket_name)

    def upload_file(self, source_file_name, destination_blob_name):
        blob = self.bucket.blob(destination_blob_name)
        blob.upload_from_filename(source_file_name)
        print(f"File {source_file_name} uploaded to {destination_blob_name}.")

    def download_file(self, source_blob_name, destination_file_name):
        blob = self.bucket.blob(source_blob_name)
        blob.download_to_filename(destination_file_name)
        print(f"Blob {source_blob_name} downloaded to {destination_file_name}.")

    def list_blobs(self, prefix=None):
        blobs = self.client.list_blobs(self.bucket_name, prefix=prefix)
        return [blob.name for blob in blobs]

    def delete_blob(self, blob_name):
        blob = self.bucket.blob(blob_name)
        blob.delete()
        print(f"Blob {blob_name} deleted.")

    def download_as_string(self, blob_name):
        blob = self.bucket.blob(blob_name)
        return blob.download_as_text()
    
    def download_as_bytes(self, blob_name):
        blob = self.bucket.blob(blob_name)
        return blob.download_as_bytes()

    def upload_from_memory(self, data, destination_blob_name):
        blob = self.bucket.blob(destination_blob_name)
        blob.upload_from_string(data)
        print(f"Data uploaded to {destination_blob_name}.")

    def upload_from_string(self, data, destination_blob_name):
        blob = self.bucket.blob(destination_blob_name)
        blob.upload_from_string(data)
        print(f"String data uploaded to {destination_blob_name}.")
