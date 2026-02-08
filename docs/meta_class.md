# Django Model Meta Class

The `class Meta` is an inner class used to provide configuration options (metadata) to a Model or Serializer.

## Purpose
It separates the **data definition** (fields) from the **model behavior** (ordering, names, constraints).

## Common Options
```python
class Meta:
    # Sorting
    ordering = ['name']            # A-Z
    ordering = ['-created_at']     # Newest first

    # Admin Display
    verbose_name = "Product"
    verbose_name_plural = "Products"

    # Database Constraints
    db_table = "custom_table_name"
    unique_together = ['category', 'slug'] # Prevent duplicates
    
    # Inheritance
    abstract = True # This model is just a template for other models