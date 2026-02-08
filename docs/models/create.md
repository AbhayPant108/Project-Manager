# How to Create a Django Model

## The 3-Step Workflow
1. **Define:** Write the Python class in `models.py`.
2. **Make Migrations:** `python manage.py makemigrations` (Creates the plan).
3. **Migrate:** `python manage.py migrate` (Executes the plan).
4. **Fields:** `fields are properties that you want to add in your database remeber that only property with are a field instance are read by django.`(CharField,TextField etc)

## Basic Syntax
```python
class ModelName(models.Model):
    field_name = models.FieldType(options)
    
    def __str__(self):
        return self.field_name
```

