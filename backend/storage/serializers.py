import re
import logging
from rest_framework import serializers
from .models import File, CustomUser

# Initialize logger
logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    # Fields for file count and total file size
    file_count = serializers.SerializerMethodField()
    total_file_size = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name',
                  'is_active', 'is_staff', 'is_superuser', 'storage_path',
                  'file_count', 'total_file_size']
        extra_kwargs = {'password': {'write_only': True}}  # Password should only be written

    def get_file_count(self, obj):
        # Return the file count for the user
        return obj.get_file_count()

    def get_total_file_size(self, obj):
        # Return the total file size for the user
        return obj.get_total_file_size()

    def validate_username(self, value):
        # Ensure the username matches the pattern
        if not re.match(r'^[a-zA-Z][a-zA-Z0-9]{3,19}$', value):
            raise serializers.ValidationError(
                "Username must contain only letters and digits, start with a letter, and be between 4 to 20 characters long.")
        return value

    def validate_email(self, value):
        # Validate the email format
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
            raise serializers.ValidationError("Please enter a valid email address.")
        return value

    def validate_password(self, value):
        # Validate the password strength
        if (len(value) < 6 or
                not re.search(r'[A-Z]', value) or
                not re.search(r'[0-9]', value) or
                not re.search(r'[\W_]', value)):
            raise serializers.ValidationError(
                "Password must be at least 6 characters long and contain uppercase letters, digits, and special characters.")
        return value

    def create(self, validated_data):
        # Log and create a new user
        logger.debug("Creating user with data: %s", validated_data)
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        logger.info("User '%s' successfully created.", user.username)
        return user


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'user_id', 'original_name', 'size', 'upload_date', 'last_download_date', 'comment', 'file_path', 'special_link']
        read_only_fields = ['user_id',]  # user_id should be read-only

    def create(self, validated_data):
        # Log and create a new file
        logger.debug("Creating file with data: %s", validated_data)
        return super().create(validated_data)
