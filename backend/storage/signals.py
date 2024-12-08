import os
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
import logging

# Initialize logger
logger = logging.getLogger(__name__)

# Signal to create a directory for a user when a new CustomUser is created
@receiver(post_save, sender=CustomUser)
def create_user_directory(sender, instance, created, **kwargs):
    # Check if the user is newly created and has a storage_path
    if created and instance.storage_path:
        # Create a directory for the user in the uploads folder
        user_directory = os.path.join(settings.MEDIA_ROOT, 'uploads', instance.storage_path)
        os.makedirs(user_directory, exist_ok=True)
        # Log the directory creation
        logger.info("Created a directory for user %s: %s", instance.username, instance.storage_path)
