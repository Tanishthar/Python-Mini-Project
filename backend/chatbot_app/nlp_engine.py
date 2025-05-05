"""
NLP Engine for processing student queries
"""
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import string
import os

# Initialize NLTK resources if they don't exist
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')
    
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Sample knowledge base (in production, would come from database)
knowledge_base = {
    "course": {
        "registration": "To register for classes: 1) Log in to the student portal, 2) Go to Registration, 3) Select your courses, 4) Confirm your selection. Registration opens based on your academic standing.",
        "requirements": "Course requirements vary by major. Please visit your department's website or speak with your academic advisor to learn about specific requirements for your program.",
        "schedule": "Course schedules for the upcoming semester are typically published two months before registration opens. You can find them on the university portal or the registrar's website.",
        "add_drop": "The add/drop deadline is typically two weeks after classes begin. After this date, you'll need special permission to add courses, and dropping will result in a 'W' on your transcript."
    },
    "faculty": {
        "office_hours": "Faculty office hours are listed on their department webpages and course syllabi. Most professors also announce their office hours during the first week of classes.",
        "contact": "Faculty contact information can be found in the university directory or on department websites. Most prefer to be contacted via their university email address.",
        "advising": "To schedule an advising appointment, log in to the student portal and use the advising scheduler tool, or email your assigned advisor directly."
    },
    "exam": {
        "schedule": "Final exam schedules are published approximately one month before finals week. You can find your exam times on the registrar's website or your student portal.",
        "policy": "Exam policies are set by individual instructors and should be outlined in your course syllabus. University policy requires that final exams be given during the scheduled final exam period.",
        "makeup": "Makeup exams are typically only allowed for documented illnesses, family emergencies, or religious observances. Contact your instructor as soon as possible if you need to request a makeup exam."
    },
    "policies": {
        "attendance": "The university attendance policy requires students to attend at least 75% of class sessions. Individual instructors may have stricter policies, which will be outlined in their syllabus.",
        "academic_integrity": "The academic integrity policy prohibits cheating, plagiarism, unauthorized collaboration, and falsification of data. Violations can result in failing grades, probation, or even expulsion.",
        "grading": "The university uses a standard grading scale (A through F). Some courses may be taken pass/fail with instructor approval. The deadline to change grading options is typically the same as the add/drop deadline."
    }
}

def preprocess_text(text):
    """Preprocess text for NLP analysis"""
    # Convert to lowercase and remove punctuation
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    
    # Tokenize and remove stopwords
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    
    # Lemmatize
    lemmatized = [lemmatizer.lemmatize(word) for word in tokens]
    
    return ' '.join(lemmatized)

def get_best_match(query, candidates):
    """Find the best matching response using TF-IDF and cosine similarity"""
    if not candidates:
        return None
    
    # Create corpus with the query and all candidates
    corpus = [query] + list(candidates.keys())
    preprocessed_corpus = [preprocess_text(text) for text in corpus]
    
    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(preprocessed_corpus)
    
    # Calculate cosine similarity between query and each candidate
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    
    # Get the best match if similarity is above threshold
    best_match_index = cosine_similarities.argmax()
    if cosine_similarities[best_match_index] > 0.3:  # Similarity threshold
        return list(candidates.values())[best_match_index]
    
    return None

def extract_category(query):
    """Extract the main category from the query"""
    query = query.lower()
    
    # Check for category keywords
    categories = {
        "course": ["course", "class", "register", "registration", "syllabus", "prerequisite", "credit", "major", "minor", "degree", "requirement", "schedule", "add", "drop"],
        "faculty": ["professor", "teacher", "instructor", "faculty", "advisor", "office hours", "appointment", "email", "contact"],
        "exam": ["exam", "test", "quiz", "final", "midterm", "grade", "score", "study", "cheat sheet", "makeup"],
        "policies": ["policy", "policies", "rule", "regulation", "deadline", "attendance", "absence", "integrity", "plagiarism", "cheating", "academic honesty"]
    }
    
    category_scores = {}
    
    # Process the query
    processed_query = preprocess_text(query)
    query_tokens = processed_query.split()
    
    for category, keywords in categories.items():
        score = 0
        for keyword in keywords:
            if keyword in query:
                score += 1
        category_scores[category] = score
    
    # Return the category with the highest score, or None if all scores are 0
    max_category = max(category_scores.items(), key=lambda x: x[1])
    if max_category[1] > 0:
        return max_category[0]
    
    return None

def process_query(query):
    """Process a user query and return the most relevant response"""
    from .models import Question
    
    # Try to match with database questions (in a real system)
    # For now, we'll use our knowledge base
    
    # Preprocess the query
    category = extract_category(query)
    
    if category and category in knowledge_base:
        # Look for the best match within the category
        response = get_best_match(query, knowledge_base[category])
        if response:
            # In a real system, we would return the actual Question object
            related_question = None
            return response, related_question
    
    # General fallback response
    return "I'm not sure about that. Could you please rephrase your question or ask about courses, faculty, exams, or university policies?", None