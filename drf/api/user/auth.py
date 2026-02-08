from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adding more ('username') to jwt payload
        token['username'] = user.username
        return token


    def validate(self, attrs):
        data = super().validate(attrs)

        # Adding more fields to response
        data['username'] = self.user.username   
        data['email'] = self.user.email
        data['id'] = self.user.id
        data['is_authenticated'] = self.user.is_authenticated
        data['is_verified'] = self.user.is_verified
        return data
