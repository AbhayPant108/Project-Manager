# Exception Handling in DRF

By default, the standard `exception_handler` provided by Django REST Framework (DRF) only catches exceptions that inherit from `rest_framework.exceptions.APIException`, as well as Django's `Http404` and `PermissionDenied`.

It does not catch standard Python errors such as `ValueError`, `KeyError`, or `ZeroDivisionError`, nor does it catch Database errors like `IntegrityError`. When these errors occur, the default handler returns `None`, causing Django to trigger a standard 500 error page.

## How to Catch Non-DRF Errors

To handle standard Python and Database errors, you need to modify the exception handler to check if the response is `None`. This allows you to catch all exceptions effectively.
# Global Exception Handler in Django REST Framework

```python
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError  # Example of a non-DRF error

def global_exception_handler(exc, context):
    # 1. Ask DRF to try handling it first
    response = exception_handler(exc, context)

    # 2. If response is None, it's a non-DRF error (Python or DB error)
    if response is None:
        if isinstance(exc, IntegrityError):
            return Response({
                "status": "error",
                "message": "Database conflict: This record already exists.",
                "errors": str(exc)
            }, status=status.HTTP_409_CONFLICT)
            
        # Handle all other unexpected Python crashes
        return Response({
            "status": "error",
            "message": "A server-side error occurred.",
            "errors": str(exc) if settings.DEBUG else "Internal Server Error"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 3. If it is a DRF error, just wrap it as we did before
    response.data = {
        "status": "error",
        "message": "API Error",
        "errors": response.data
    }

    return response
```
| Error Type | Example | Caught by Default? | Caught by Custom Handler? |
| --- | --- | --- | --- |
| DRF Errors | "ValidationError, NotAuthenticated" | Yes | Yes |
| Django Built-ins | "Http404, PermissionDenied" | Yes | Yes |
| Python Errors | "ZeroDivisionError, KeyError" | No (returns None) | Yes (if you add the if response is None check) |
| Database Errors | "IntegrityError, OperationalError" | No (returns None) | Yes (if you add the if response is None check) |

# Important: Security Warning

When catching non-DRF errors like `ValueError` or `DatabaseError`:

1. **In Development:** It is helpful to send `str(exc)` (the error message) to your frontend so you can debug quickly.

2. **In Production:** Never send the raw error string to the user. It might reveal your database structure, table names, or secret keys. Use a generic message like "An unexpected error occurred."

## Summary Checklist

1. `exception_handler(exc, context)` handles the "known" API errors.

2. The `if response is None:` block handles the "unknown" Python/System errors.

3. This ensures that your frontend always receives a JSON response and never an ugly HTML 500 error page.