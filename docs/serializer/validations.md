# Validation Handling in Django REST Framework (DRF)

This document covers **different ways to handle validation in Django REST Framework (DRF)**, from basic field-level checks to advanced, reusable, and global validation strategies.

---

## 1. Serializer Field Validation

### 1.1 Built-in Field Validation

DRF provides automatic validation based on serializer field types.

```python
class UserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    age = serializers.IntegerField(min_value=18)
```

✔ Ensures valid email format
✔ Ensures age ≥ 18

---

### 1.2 `required`, `allow_null`, `allow_blank`

```python
name = serializers.CharField(required=True, allow_blank=False)
```

* `required=True` → field must be present
* `allow_null=True` → allows `None`
* `allow_blank=True` → allows empty string (only for CharField)

---

## 2. Field-Level Validation (`validate_<field>`)

Used to validate **a single field**.
* Remeber your validation method should return the validated value or raise a ValidationError

```python
class ProductSerializer(serializers.Serializer):
    price = serializers.FloatField()

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be positive")
        return value
```

✔ Clean and readable
✔ Best for single-field rules

---

## 3. Object-Level Validation (`validate` method)

* Used when validation depends on **multiple fields**.
* Validate the object as a whole.
* Either return the validated object or raise a Validation error.

```python
class BookingSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()

    def validate(self, data):
        if data['end_date'] < data['start_date']:
            raise serializers.ValidationError("End date must be after start date")
        return data
```

✔ Cross-field validation
✔ Runs after individual field validation

---

## 4. Validators Class

Reusable validation logic.

### 4.1 Function-Based Validator

```python
def positive_number(value):
    if value <= 0:
        raise serializers.ValidationError("Must be positive")

class ItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(validators=[positive_number])
```

---

### 4.2 Class-Based Validator

```python
class EvenNumberValidator:
    def __call__(self, value):
        if value % 2 != 0:
            raise serializers.ValidationError("Must be even")
```

✔ Reusable across serializers

---

## 5. Model Validation in DRF

### 5.1 ModelSerializer Validation

```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
```

✔ Automatically applies:

* Model field constraints
* `unique=True`
* `blank=False`, `null=False`

---

### 5.2 `Model.clean()` Method

```python
class Order(models.Model):
    quantity = models.IntegerField()

    def clean(self):
        if self.quantity <= 0:
            raise ValidationError("Quantity must be positive")
```

⚠ Works only if `full_clean()` is called (DRF does this internally)

---

## 6. Unique Validation

### 6.1 Automatic Unique Validation

```python
email = serializers.EmailField(unique=True)
```

DRF automatically checks database uniqueness.

---

### 6.2 `UniqueValidator`

```python
from rest_framework.validators import UniqueValidator

email = serializers.EmailField(
    validators=[UniqueValidator(queryset=User.objects.all())]
)
```

---

## 7. Custom Validation in Views

### 7.1 Manual Validation in APIView

```python
class LoginView(APIView):
    def post(self, request):
        if not request.data.get('username'):
            return Response({"error": "Username required"}, status=400)
```

❌ Not recommended for large projects

---

### 7.2 Validation in ViewSets (`perform_create`)

```python
def perform_create(self, serializer):
    if serializer.validated_data['amount'] < 100:
        raise ValidationError("Minimum amount is 100")
    serializer.save()
```

✔ Useful for request-context validation

---

## 8. Validation Using `is_valid()`

```python
serializer = UserSerializer(data=request.data)
serializer.is_valid(raise_exception=True)
```

* `raise_exception=True` → automatically returns 400 response

---

## 9. Nested Serializer Validation

```python
class ProfileSerializer(serializers.Serializer):
    age = serializers.IntegerField()

class UserSerializer(serializers.Serializer):
    profile = ProfileSerializer()
```

✔ Nested serializer errors are automatically propagated

---

## 10. Partial Update Validation (`PATCH`)

```python
serializer = UserSerializer(instance, data=request.data, partial=True)
```

✔ Skips required field validation for missing fields

---

## 11. Custom Error Messages

```python
name = serializers.CharField(
    error_messages={
        'blank': 'Name cannot be empty',
        'required': 'Name is required'
    }
)
```

---

## 12. Global Validation & Exception Handling

### 12.1 Custom Exception Handler

```python
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response:
        response.data['status'] = 'error'
    return response
```

```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'project.utils.custom_exception_handler'
}
```

---

## 13. Validation Error Response Format

```json
{
  "field_name": ["Error message"]
}
```

Example:

```json
{
  "email": ["This field must be unique."]
}
```

---

## 14. Best Practices

✔ Prefer serializer validation over view validation
✔ Use object-level validation for cross-field logic
✔ Keep validators reusable
✔ Avoid business logic in views
✔ Customize error messages for better UX

---

## 15. Quick Comparison

| Method            | Use Case               |
| ----------------- | ---------------------- |
| Field validation  | Single field rule      |
| Object validation | Multiple fields        |
| Validators        | Reusable logic         |
| Model validation  | DB-level rules         |
| View validation   | Request-specific logic |
| Global handler    | Unified error format   |

---

**End of Document**
