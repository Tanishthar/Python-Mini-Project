from rest_framework import serializers
from .models import Category, Question, Response, ChatSession, ChatMessage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon']


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ['id', 'text', 'is_default']


class QuestionSerializer(serializers.ModelSerializer):
    responses = ResponseSerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'category', 'category_name', 'is_frequently_asked', 'responses']


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'content', 'timestamp']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatSession
        fields = ['session_id', 'started_at', 'last_active', 'messages']