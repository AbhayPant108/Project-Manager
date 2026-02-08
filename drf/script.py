import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'practice.settings')
django.setup()

from api.project.models import Project
from api.user.models import UserProfile
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password


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

User = get_user_model()



def create_profiles():
    profiles_data = [
        {"username": "dev_abhay", "first_name": "Abhay", "last_name": "Pant", "phone_number": "+919876543210", "bio": "Full-stack dev interested in DRF and React."},
        {"username": "sara_j", "first_name": "Sara", "last_name": "Johnson", "phone_number": "+12025550111", "bio": "UI/UX Designer and CSS wizard."},
        {"username": "mike_ross", "first_name": "Mike", "last_name": "Ross", "phone_number": "+12025550122", "bio": "Legal tech enthusiast and junior developer."},
        {"username": "tech_lead", "first_name": "Jessica", "last_name": "Pearson", "phone_number": "+12025550133", "bio": "Managing lead at Pearson Hardman Tech."},
        {"username": "harvey_s", "first_name": "Harvey", "last_name": "Specter", "phone_number": "+12025550144", "bio": "Closer. I don't play the odds, I play the man."},
        {"username": "coder_kunal", "first_name": "Kunal", "last_name": "Shah", "phone_number": "+919999999999", "bio": "Founder and Fintech specialist."},
        {"username": "nina_web", "first_name": "Nina", "last_name": "Williams", "phone_number": "+442079460000", "bio": "Exploring the world of Web3."},
        {"username": "data_dan", "first_name": "Daniel", "last_name": "Hardman", "phone_number": "+12025550155", "bio": "Data Scientist focusing on predictive modeling."},
        {"username": "rachel_z", "first_name": "Rachel", "last_name": "Zane", "phone_number": "+12025550166", "bio": "Researching automation in legal workflows."},
        {"username": "louis_litt", "first_name": "Louis", "last_name": "Litt", "phone_number": "+12025550177", "bio": "You just got Litt up! Backend master."},
        {"username": "donna_p", "first_name": "Donna", "last_name": "Paulsen", "phone_number": "+12025550188", "bio": "I'm Donna. I know everything."},
        {"username": "katrina_b", "first_name": "Katrina", "last_name": "Bennett", "phone_number": "+12025550199", "bio": "Efficient. Logical. Reliable."},
        {"username": "alex_w", "first_name": "Alex", "last_name": "Williams", "phone_number": "+12025550100", "bio": "Building scalable architecture."},
        {"username": "sam_wheeler", "first_name": "Samantha", "last_name": "Wheeler", "phone_number": "+12025550110", "bio": "Senior Dev and problem solver."},
        {"username": "gretchen_b", "first_name": "Gretchen", "last_name": "Bodinski", "phone_number": "+12025550120", "bio": "Experienced office and workflow manager."},
    ]
    profile_instances = []
        
    for data in profiles_data:
        try:
            # 1. Get the user we created in the previous step
            user = User.objects.get(username=data.pop('username'))
            
            # 2. Create the profile instance
            profile_instances.append(UserProfile(user=user, **data))
        except User.DoesNotExist:
            continue

        # 3. Bulk create the profiles
    UserProfile.objects.bulk_create(profile_instances, ignore_conflicts=True)

def seed_projects_with_members():
    projects_data = [
    {
        "owner_username": "dev_abhay",
        "title": "React Dashboard",
        "description": "High-performance admin panel with feature-based architecture and dark mode support.",
        "member_usernames": ["sara_j", "mike_ross"]
    },
    {
        "owner_username": "tech_lead",
        "title": "Enterprise Cloud Migration",
        "description": "Moving Pearson Hardman's infrastructure to AWS. Involves database sharding and S3 integration.",
        "member_usernames": ["dev_abhay", "harvey_s", "donna_p"]
    },
    {
        "owner_username": "mike_ross",
        "title": "Legal Case Tracker",
        "description": "Automated system for organizing pro-bono cases and tracking court dates.",
        "member_usernames": ["rachel_z"]
    },
    {
        "owner_username": "harvey_s",
        "title": "The Closer Framework",
        "description": "A proprietary method for high-stakes negotiations and corporate takeovers.",
        "member_usernames": ["mike_ross", "donna_p", "alex_w"]
    },
    {
        "owner_username": "coder_kunal",
        "title": "Fintech Wallet API",
        "description": "Building a secure payment gateway for micro-transactions and UPI integration.",
        "member_usernames": ["dev_abhay", "nina_web"]
    },
    {
        "owner_username": "nina_web",
        "title": "Web3 Identity Bridge",
        "description": "Connecting decentralized IDs (DID) with standard Auth systems like Django and JWT.",
        "member_usernames": ["coder_kunal"]
    },
    {
        "owner_username": "rachel_z",
        "title": "Law Review Database",
        "description": "A searchable index of all historical law review journals with PDF OCR support.",
        "member_usernames": ["mike_ross", "katrina_b"]
    },
    {
        "owner_username": "louis_litt",
        "title": "Mudding Schedule Bot",
        "description": "Automation for the ultimate relaxation experience. Don't be a mock turtle!",
        "member_usernames": ["gretchen_b"]
    },
    {
        "owner_username": "sam_wheeler",
        "title": "Performance Audit Tool",
        "description": "Tracking developer velocity across different features and calculating N+1 issues.",
        "member_usernames": ["alex_w", "katrina_b"]
    },
    {
        "owner_username": "donna_p",
        "title": "Office Intelligence System",
        "description": "I'm Donna. I know who is coming and going before they do. This tracks it.",
        "member_usernames": ["gretchen_b", "harvey_s"]
    },
    {
        "owner_username": "alex_w",
        "title": "Scalable Architecture Docs",
        "description": "Internal documentation for the new microservices rollout.",
        "member_usernames": ["sam_wheeler", "tech_lead"]
    },
    {
        "owner_username": "katrina_b",
        "title": "Logic & Efficiency Protocol",
        "description": "Streamlining document review processes to save 40% more time per case.",
        "member_usernames": ["rachel_z"]
    }
]
    for data in projects_data:
        # 1. Pop the members list out so it doesn't break the Project creation
        member_usernames = data.pop('member_usernames', [])
        owner_username = data.pop('owner_username')

        try:
            owner = User.objects.get(username=owner_username)
            
            # 2. Create the Project (The owner is a ForeignKey)
            project = Project.objects.create(owner=owner, **data)

            # 3. Add Members (The ManyToMany part)
            if member_usernames:
                members = User.objects.filter(username__in=member_usernames)
                project.members.add(*members) # Use * to unpack the QuerySet
                
        except User.DoesNotExist:
            print(f"Skipping project {data['title']}: Owner not found.")

def add_task():
    from datetime import date
    from api.project.models import Task
# Mapping your provided Project IDs
    project_ids = [
    "cb22f2f3-32dd-402a-8741-07789ef4c6c3", "b3b9de0b-6b28-4409-8ec2-d6db0d211e34",
    "3ce650e2-8a7a-409d-a2ce-b428f3821413", "5d59d78e-8a1b-463f-a918-871e07840cd2",
    "b45c3604-4e3b-4c1a-95f8-f276e5a1de88", "643eaa76-c7e0-4aa0-bdca-06b948d1ef41",
    "2c73cdee-a2a0-4216-8a3b-9bdd8d4a9d9d", "6bff6dd5-8eba-4043-a8c5-12bee022c3ab",
    "944b999c-bb94-4f3d-8fcc-4cc86075676b", "dd71945b-cc14-485c-9534-384dea70bd97",
    "a2428136-640e-4ab6-8007-9a0126fce2c3", "f7c2dda0-8c2a-42d5-9e4f-87c2bed9f70b",
    "efdc086d-2380-4079-9e53-f91c49ba4e84", "bbfcc633-6ea7-4fb3-9359-62b88b0f166c"
]

# User IDs from previous turn
    user_ids = [
    "27b73bc9-033b-42bf-87f0-351d21103f9e", "fa66e945-7e9f-4dfd-ad02-e7e9882941d4",
    "137971b8-dc45-4a9f-8b02-cf17f3c36585", "e59e7a4c-af9a-44a1-bffc-e71ec38cdf9a",
    "fc5ced85-9e0c-4b09-bc9c-1297f60f6f1e", "f1fd4462-9040-4a3e-8950-2a2fa165e526",
    "00265c8c-4ee9-4ee9-9e0e-8c665fae8a10", "3c4aa529-c4fe-48f6-a856-e634b9d0f4eb",
    "3bc5ab90-e165-439c-ad27-ca8fe06ec4ee", "e5df3df0-112c-4360-9f30-e67e80ae2ce5",
    "969342f0-fdad-4184-bad7-a5364d24d26e", "1c24b807-f6f6-4ff5-b098-6f52bffec928",
    "ccfa3df9-05c9-4516-83d8-a4a5ac160681", "31eb718f-c45c-4106-b6ac-50eec5be671c",
    "337672ae-4e90-447c-9864-919336c66419", "4b60ba0b-c434-4a26-b194-0028c9d9642d",
    "c8978a23-4938-4713-b1bc-ee4c411820fe", "7e2f493c-25c5-44d0-916e-cf199aa4cba4"
]

    tasks_data = [
    {"title": "Implement WebSockets for Real-time Updates", "project": project_ids[0], "assigned_to": user_ids[0], "status": "IN_PROGRESS", "priority": "HIGH", "due_date": date(2026, 2, 25)},
    {"title": "Setup Redis Caching", "project": project_ids[1], "assigned_to": user_ids[10], "status": "INCOMPLETE", "priority": "MEDIUM", "due_date": date(2026, 3, 5)},
    {"title": "Audit AWS IAM Roles", "project": project_ids[1], "assigned_to": user_ids[5], "status": "COMPLETED", "priority": "HIGH", "due_date": date(2026, 2, 1)},
    {"title": "PDF OCR Integration for Legal Docs", "project": project_ids[6], "assigned_to": user_ids[8], "status": "IN_PROGRESS", "priority": "HIGH", "due_date": date(2026, 2, 28)},
    {"title": "Create User Onboarding Flow", "project": project_ids[4], "assigned_to": user_ids[15], "status": "INCOMPLETE", "priority": "LOW", "due_date": date(2026, 3, 10)},
    {"title": "Optimize React Bundle Size", "project": project_ids[0], "assigned_to": user_ids[0], "status": "INCOMPLETE", "priority": "MEDIUM", "due_date": date(2026, 2, 20)},
    {"title": "Setup Sentry Error Tracking", "project": project_ids[5], "assigned_to": user_ids[4], "status": "COMPLETED", "priority": "MEDIUM", "due_date": date(2026, 1, 25)},
    {"title": "Draft Negotiation Playbook", "project": project_ids[3], "assigned_to": user_ids[2], "status": "IN_PROGRESS", "priority": "HIGH", "due_date": date(2026, 2, 15)},
    {"title": "Automate Mudding Reminders", "project": project_ids[7], "assigned_to": user_ids[16], "status": "INCOMPLETE", "priority": "LOW", "due_date": date(2026, 3, 1)},
    {"title": "Build UPI Payment Webhook", "project": project_ids[4], "assigned_to": user_ids[6], "status": "IN_PROGRESS", "priority": "HIGH", "due_date": date(2026, 2, 18)},
    {"title": "Integrate DID with JWT Auth", "project": project_ids[5], "assigned_to": user_ids[5], "status": "IN_PROGRESS", "priority": "MEDIUM", "due_date": date(2026, 2, 22)},
    {"title": "Design Microservices Network Map", "project": project_ids[10], "assigned_to": user_ids[3], "status": "INCOMPLETE", "priority": "MEDIUM", "due_date": date(2026, 3, 12)},
    {"title": "Refactor Document Review Logic", "project": project_ids[11], "assigned_to": user_ids[11], "status": "COMPLETED", "priority": "HIGH", "due_date": date(2026, 2, 5)},
    {"title": "Calculate Developer Velocity Metrics", "project": project_ids[8], "assigned_to": user_ids[13], "status": "IN_PROGRESS", "priority": "MEDIUM", "due_date": date(2026, 2, 27)},
    {"title": "Office Traffic Predictive Model", "project": project_ids[9], "assigned_to": user_ids[10], "status": "INCOMPLETE", "priority": "LOW", "due_date": date(2026, 3, 15)},
    {"title": "Migrate Legacy Postgres to Aurora", "project": project_ids[1], "assigned_to": user_ids[3], "status": "IN_PROGRESS", "priority": "HIGH", "due_date": date(2026, 3, 20)},
    {"title": "Legal Case Deadline Alerts", "project": project_ids[2], "assigned_to": user_ids[8], "status": "COMPLETED", "priority": "HIGH", "due_date": date(2026, 2, 8)},
    {"title": "Dark Mode Toggle Polish", "project": project_ids[0], "assigned_to": user_ids[17], "status": "COMPLETED", "priority": "LOW", "due_date": date(2026, 2, 10)},
    {"title": "Pro-bono Document Indexing", "project": project_ids[2], "assigned_to": user_ids[2], "status": "INCOMPLETE", "priority": "MEDIUM", "due_date": date(2026, 3, 5)},
    {"title": "Negotiation Logic Unit Tests", "project": project_ids[3], "assigned_to": user_ids[12], "status": "INCOMPLETE", "priority": "MEDIUM", "due_date": date(2026, 3, 8)},
]
        
   

    try:
            for data in tasks_data:
            # 2. Create the Project (The owner is a ForeignKey)
                project_id = data.pop('project')
                assigned_id = data.pop('assigned_to')
                project = Project.objects.get(id = project_id)
                user = User.objects.get(id = assigned_id)
                Task.objects.create(**data,project = project,assigned_to = user)

            # 3. Add Members (The ManyToMany part)
            
                
    except User.DoesNotExist:
            print(f"Skipping project {data['title']}: Owner not found.")

add_task()