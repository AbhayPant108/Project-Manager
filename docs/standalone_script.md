# Standalone Django Scripts Guide

When you need to use the Django ORM, Models, or Settings in a separate Python script (like a data migration or a cleanup task) without running the web server.

## 1. The Setup Procedure
You must follow a strict order: Set the environment variable, then initialize the application registry.

```python
import os
import django

# 1. Provide the path to your project's settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')

# 2. Wake up Django's internal logic (ORM, Apps, etc.)
django.setup()

# 3. NOW you can safely import your models
from my_app.models import Book

def run():
    # Example ORM usage
    count = Book.objects.count()
    print(f"Current library size: {count} books")

if __name__ == "__main__":
    run()
```
# Understanding DJANGO_SETTINGS_MODULE

The line `os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')` is used to link a Python script to a specific Django project's configuration.

## 1. What does it actually do?
* **os.environ**: This is a dictionary-like object in Python that represents your computer's environment variables.
* **setdefault**: This method checks if an environment variable named `DJANGO_SETTINGS_MODULE` already exists. 
    * If it **does not** exist, it sets it to `'my_project.settings'`.
    * If it **does** exist (e.g., you set it manually in your terminal), it does nothing.
* **'my_project.settings'**: This is the Python path to your settings file. It tells Django: "Look inside the `my_project` folder for a file named `settings.py`."



---

## 2. Why is it used?
Django is designed to handle multiple environments (Development, Production, Testing). This line allows you to specify which environment the script should use.

| Scenario | Settings Path |
| :--- | :--- |
| **Development** | `my_project.settings` |
| **Production** | `my_project.settings_prod` |
| **Testing** | `my_project.settings_test` |

---

## 3. The Execution Flow
When you run a script, Django follows this sequence to load your project:

1. **Environment Variable**: Find the path to the settings file.
2. **Setup**: Initialize `django.setup()`.
3. **Registry**: Load all apps listed in `INSTALLED_APPS`.
4. **Access**: Now, any part of the script can use `from django.conf import settings`.



---

## 4. Common Errors
* **`ModuleNotFoundError`**: Usually means the path `'my_project.settings'` is wrong or your script is not in the correct folder to see the `my_project` directory.
* **`ImportError`**: If you try to access settings before this line is executed, Django will throw an error saying "Settings are not configured."

---

### Pro-Tip
In your `manage.py` and `wsgi.py` files, Django includes this line automatically. You only need to write it manually when you are creating **standalone** scripts or working with specialized tools like **Celery** or **Pytest**.