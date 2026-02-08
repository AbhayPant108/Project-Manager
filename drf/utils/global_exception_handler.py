from rest_framework.views import exception_handler
from utils.api_response import ApiResponse
from rest_framework.exceptions import ValidationError,APIException
from sqlite3 import IntegrityError


def global_exception_handler(exc,context):
    try:
        response = exception_handler(exc,context)
        if isinstance(exc,ValidationError):
            response.data = {
                    'errors': response.data,
                    'message':'Validation error occured for submitted data.',
                    'status_code':response.status_code,
                    'success':response.status_code < 400
                }
        elif isinstance(exc,APIException):
            response.data = {
                    'errors': None,
                    'message':response.data.get('detail'),
                    'status_code':response.status_code,
                    'success':response.status_code < 400
                }
        return response

    except :
        return ApiResponse(message="A server error occurred",status=500)