import os
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.shortcuts import redirect, get_object_or_404
from django.urls import path, reverse
from django.utils.crypto import get_random_string
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, File
import logging

# Initialize logger
logger = logging.getLogger(__name__)

# TODO: The user list should also display information about their file storage: number of files, total file size, and a link to manage these files.

class CustomUserAdmin(admin.ModelAdmin):
    # Forms used for creating and changing the user
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    
    # Fields to display in the user list
    list_display = ['id', 'username', 'first_name', 'last_name', 'email', 'storage_path',
                    'file_count', 'total_file_size', 'is_active', 'is_staff', 'is_superuser']
    
    # Fields to filter the user list
    list_filter = ['is_staff', 'is_active', 'is_superuser']
    
    # Search fields in the user list
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    # Custom fieldsets for the user model
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('storage_path',)}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('storage_path',)}),
    )
    
    # Custom methods to get file count and total file size
    def file_count(self, obj):
        return obj.get_file_count()

    def total_file_size(self, obj):
        return obj.get_total_file_size()

    # Short descriptions for the custom methods
    file_count.short_description = 'Number of Files'
    total_file_size.short_description = 'Total File Size (MB)'

    # Custom URLs for the user admin
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<int:user_id>/password/', self.admin_site.admin_view(self.reset_password), name='password'),
        ]
        return custom_urls + urls

    # Reset password for the user
    def reset_password(self, request, user_id):
        user = get_object_or_404(CustomUser, pk=user_id)
        new_password = get_random_string(length=8)
        user.set_password(new_password)
        user.save()
        messages.success(request, f'Password for user {user.username} has been reset. New password: {new_password}')
        return redirect(reverse('admin:storage_customuser_change', args=[user_id]))

# Register the CustomUser model with the admin
admin.site.register(CustomUser, CustomUserAdmin)

# FileAdmin for managing files in the admin panel
@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    # Fields to display in the file list
    list_display = ['user', 'original_name', 'size', 'upload_date', 'last_download_date', 'comment', 'file_path', 'special_link']
    
    # Filter options for files
    list_filter = ['user', 'original_name']

    # Custom method to delete a file
    def delete_model(self, request, obj):
        logger.debug("Deleting file %s", obj.original_name)
        obj.delete()  # Call delete method on the model
        self.message_user(request, "File successfully deleted.")
        logger.info("File %s successfully deleted.", obj.original_name)
