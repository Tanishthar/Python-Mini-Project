from django.contrib import admin
from .models import Question, Response, ChatSession, Category

admin.site.register(Question)
admin.site.register(Response)
admin.site.register(ChatSession)
admin.site.register(Category)