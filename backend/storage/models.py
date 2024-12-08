import os
import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
import logging

# Initialize logger
logger = logging.getLogger(__name__)

class CustomUser(AbstractUser):
    # Storage path for user files
    storage_path = models.CharField(max_length=255,
                                    verbose_name='File Storage Location',
                                    default='')

    def save(self, *args, **kwargs):
        # Save the user and create a storage folder if not present
        super().save(*args, **kwargs)
        
        if not self.storage_path:
            self.storage_path = f'user_{self.id}_{uuid.uuid4()}'
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'uploads', self.storage_path), exist_ok=True)
            logger.info("Created folder for user %s: %s", self.username, self.storage_path)
            self.save(update_fields=['storage_path'])

    def get_file_count(self):
        # Get the total number of files uploaded by the user
        return File.objects.filter(user=self).count()

    def get_total_file_size(self):
        # Get the total file size uploaded by the user (in MB)
        return round(sum(file.size for file in File.objects.filter(user=self)) / 1024 / 1024, 2)


class File(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             verbose_name='User')
    original_name = models.CharField(max_length=255, editable=False, verbose_name='Original File Name')
    size = models.PositiveIntegerField(editable=False, verbose_name='File Size')
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name='Upload Date')
    last_download_date = models.DateTimeField(null=True, blank=True, editable=False, verbose_name='Last Download Date')
    comment = models.TextField(blank=True, verbose_name='Comment')
    file_path = models.FileField(upload_to='', verbose_name='File Path', max_length=500)
    special_link = models.CharField(max_length=255, unique=True, editable=False, verbose_name='Special Link')

    def save(self, *args, **kwargs):
        if not self.pk:
            # Generate a unique special link for the file
            self.special_link = uuid.uuid4().hex
            logger.info("Created special link for file: %s", self.special_link)

            # Assign the file path
            self.file_path.name = self.get_upload_to()

        # Ensure the user folder exists
        user_folder = os.path.join(settings.MEDIA_ROOT, 'uploads', self.user.storage_path)
        os.makedirs(user_folder, exist_ok=True)

        # Save the file model
        super().save(*args, **kwargs)

    def get_upload_to(self):
        # Generate a unique filename for the uploaded file
        unique_filename = f"{uuid.uuid4().hex}_{self.original_name}"
        return os.path.join('uploads/', self.user.storage_path, unique_filename)

    def delete(self, *args, **kwargs):
        # Delete the file and remove the physical file from storage
        if self.file_path:
            try:
                if os.path.isfile(self.file_path.path):
                    os.remove(self.file_path.path)
                    logger.info("File '%s' successfully deleted.", self.original_name)
            except Exception as e:
                logger.error("Error deleting file '%s': %s", self.original_name, str(e))
        
        # Call the delete method for the model
        super().delete(*args, **kwargs)
