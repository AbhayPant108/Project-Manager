from django.test import TestCase

# Create your tests here.
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

users_data = [
    {"username": "dev_abhay", "email": "abhay@example.com", "is_verified": True, "password": "password123"},
    {"username": "sara_j", "email": "sara@example.com", "is_verified": False, "password": "password123"},
    {"username": "mike_ross", "email": "mike@pearson.com", "is_verified": True, "password": "password123"},
    {"username": "tech_lead", "email": "lead@company.org", "is_verified": True, "password": "password123"},
    {"username": "harvey_s", "email": "harvey@specter.com", "is_verified": False, "password": "password123"},
    {"username": "coder_kunal", "email": "kunal@dev.io", "is_verified": True, "password": "password123"},
    {"username": "nina_web", "email": "nina@web.com", "is_verified": False, "password": "password123"},
    {"username": "data_dan", "email": "dan@analytics.net", "is_verified": True, "password": "password123"},
    {"username": "rachel_z", "email": "rachel@law.com", "is_verified": True, "password": "password123"},
    {"username": "louis_litt", "email": "louis@litt.com", "is_verified": False, "password": "password123"},
    {"username": "donna_p", "email": "donna@firm.com", "is_verified": True, "password": "password123"},
    {"username": "katrina_b", "email": "katrina@legal.io", "is_verified": True, "password": "password123"},
    {"username": "alex_w", "email": "alex@williams.com", "is_verified": False, "password": "password123"},
    {"username": "sam_wheeler", "email": "sam@wheeler.net", "is_verified": True, "password": "password123"},
    {"username": "gretchen_b", "email": "gretchen@office.com", "is_verified": True, "password": "password123"},
]

# Mapping to instances
user_instances = [
    User(
        username=u['username'],
        email=u['email'],
        is_verified=u['is_verified'],
        password=make_password(u['password'])
    ) for u in users_data
]

# Executing the bulk create
# Using ignore_conflicts=True to safely run this multiple times
created_users = User.objects.bulk_create(user_instances, ignore_conflicts=True)

print(f"Successfully processed {len(users_data)} user records.")