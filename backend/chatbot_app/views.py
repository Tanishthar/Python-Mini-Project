from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from .models import Category, Question, ChatSession, ChatMessage
from .serializers import (
    CategorySerializer,
    QuestionSerializer,
    ChatMessageSerializer
)
from .nlp_engine import process_query


class MessageView(APIView):
    """
    API endpoint for processing chat messages and generating responses.
    """
    def post(self, request):
        message = request.data.get('message')
        session_id = request.data.get('session_id')
        
        if not message:
            return Response(
                {"error": "Message field is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get or create chat session
        if session_id:
            session, created = ChatSession.objects.get_or_create(session_id=session_id)
        else:
            session = ChatSession.objects.create(session_id=str(uuid.uuid4()))
            
        # Save user message
        ChatMessage.objects.create(
            session=session,
            sender='user',
            content=message
        )
        
        # Process message with NLP engine
        response_text, related_question = process_query(message)
        
        # Save bot response
        bot_message = ChatMessage.objects.create(
            session=session,
            sender='bot',
            content=response_text,
            related_question=related_question
        )
        
        return Response({
            'response': response_text,
            'session_id': session.session_id,
            'timestamp': bot_message.timestamp
        })


class CategoryListView(generics.ListAPIView):
    """
    API endpoint that returns a list of all categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class QuestionListView(generics.ListAPIView):
    """
    API endpoint that returns a list of questions, optionally filtered by category.
    """
    serializer_class = QuestionSerializer
    
    def get_queryset(self):
        queryset = Question.objects.all()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class FrequentQuestionsView(generics.ListAPIView):
    """
    API endpoint that returns a list of frequently asked questions.
    """
    serializer_class = QuestionSerializer
    queryset = Question.objects.filter(is_frequently_asked=True)


class ChatHistoryView(generics.ListAPIView):
    """
    API endpoint that returns chat history for a specific session.
    """
    serializer_class = ChatMessageSerializer
    
    def get_queryset(self):
        session_id = self.kwargs['session_id']
        session = get_object_or_404(ChatSession, session_id=session_id)
        return ChatMessage.objects.filter(session=session)