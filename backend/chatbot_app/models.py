from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"


class Question(models.Model):
    text = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='questions')
    is_frequently_asked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.text[:50]


class Response(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='responses')
    text = models.TextField()
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Response to: {self.question.text[:30]}"


class ChatSession(models.Model):
    session_id = models.CharField(max_length=100, unique=True)
    user_identifier = models.CharField(max_length=100, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Chat {self.session_id} ({self.started_at.strftime('%Y-%m-%d')})"
    
    def is_active(self):
        return (timezone.now() - self.last_active).total_seconds() < 1800  # 30 minutes


class ChatMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]
    
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    related_question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.sender}: {self.content[:30]}"
    
    class Meta:
        ordering = ['timestamp']