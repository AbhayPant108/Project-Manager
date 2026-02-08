from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# The industry standard way to register a custom User
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Add your custom fields (like is_verified) to the admin forms
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('is_verified',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Info', {'fields': ('is_verified',)}),
    )
    list_display = ['email', 'username', 'is_staff', 'is_verified']