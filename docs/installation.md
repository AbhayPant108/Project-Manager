# Django REST Framework (DRF) Core Concepts

## 1. Installation & Setup
To start using DRF, install the package and register it in your Django settings.

* **Install:** `pip install djangorestframework`
* **Register:** Add `'rest_framework'` to `INSTALLED_APPS` in `settings.py`.

---

## 2. The Request Object
The DRF `Request` object wraps the standard Django `HttpRequest` to provide better support for programmatic APIs.

### Key Attributes
| Attribute | Description |
| :--- | :--- |
| `request.data` | Handles parsed content (JSON/Forms) for POST, PUT, PATCH. |
| `request.query_params` | Accesses URL parameters (e.g., `/api?search=python`). |
| `request.method` | The HTTP verb (GET, POST, etc.). |
| `request.user` | The authenticated user object. |

> **Pro-Tip:** If your IDE doesn't show `.method`, use type hinting: `def my_view(request: HttpRequest):`.



---

## 3. The Response Object
DRF uses a `Response` object that performs content negotiation (returning JSON for code and HTML for browsers).

### Creating a Professional Wrapper
Using a custom class ensures every API response follows the same schema, making it easier for frontend developers to handle.

```python
from rest_framework.response import Response

class StandardResponse(Response):
    """
    Custom wrapper to ensure consistent JSON structure.
    """
    def __init__(self, data=None, message="", status=None, success=True):
        styled_data = {
            "success": success,
            "message": message,
            "data": data,
        }
        super().__init__(data=styled_data, status=status)