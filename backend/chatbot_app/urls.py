from django.urls import path
from .views import (
    MessageView, 
    CategoryListView,
    QuestionListView,
    FrequentQuestionsView,
    ChatHistoryView
)

urlpatterns = [
    path('message/', MessageView.as_view(), name='message'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('questions/', QuestionListView.as_view(), name='questions'),
    path('frequent-questions/', FrequentQuestionsView.as_view(), name='frequent-questions'),
    path('history/<str:session_id>/', ChatHistoryView.as_view(), name='chat-history'),
]