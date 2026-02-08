from rest_framework.response import Response

class ApiResponse(Response):
    
    def __init__(self, 
                data=None,
                message=None,
                errors=None,
                status=None, 
                template_name=None, 
                headers=None, 
                content_type=None,
                ):

        styled_data = {
            'errors': None if isinstance(errors,dict) and errors == {} else errors,
            'message':message,
            'data':data ,
            'status':status,
            'success':status is None or status < 400
        }
        if data is None :
            styled_data.pop('data')
        if status < 400 or status is None:
            styled_data.pop('errors') 


        super().__init__(
                        data=styled_data, 
                        status=status, 
                        template_name=template_name, 
                        headers=headers,  
                        content_type=content_type,
                        )