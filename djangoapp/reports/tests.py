from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from .models import Report
from djangoapp.documents.models import Document
from djangoapp.categories.models import Category


class ReportModelTest(TestCase):
    """Test Report model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.reporter = get_user_model().objects.create_user(
            username='reporter',
            email='reporter@example.com',
            password='reportpass123'
        )
        self.category = Category.objects.create(
            name='Test Category',
            description='Test description'
        )
        self.document = Document.objects.create(
            title='Test Document',
            description='Test description',
            category=self.category,
            uploaded_by=self.user,
            language='en'
        )
    
    def test_report_creation(self):
        """Test creating a report."""
        report = Report.objects.create(
            document=self.document,
            reported_by=self.reporter,
            reason='copyright',
            description='This document infringes copyright.'
        )
        
        self.assertEqual(report.document, self.document)
        self.assertEqual(report.reported_by, self.reporter)
        self.assertEqual(report.reason, 'copyright')
        self.assertEqual(report.status, 'pending')
        self.assertIsNone(report.reviewed_by)
    
    def test_report_str(self):
        """Test report string representation."""
        report = Report.objects.create(
            document=self.document,
            reported_by=self.reporter,
            reason='copyright',
            description='This document infringes copyright.'
        )
        
        expected_str = f"Report on '{self.document.title}' by {self.reporter.username}"
        self.assertEqual(str(report), expected_str)
    
    def test_unique_report_per_user_document(self):
        """Test that a user can only report a document once."""
        Report.objects.create(
            document=self.document,
            reported_by=self.reporter,
            reason='copyright',
            description='First report.'
        )
        
        # Try to create another report for same user-document pair
        with self.assertRaises(Exception):  # IntegrityError
            Report.objects.create(
                document=self.document,
                reported_by=self.reporter,
                reason='spam',
                description='Second report.'
            )


class ReportAPITest(APITestCase):
    """Test Report API endpoints."""
    
    def setUp(self):
        """Set up test data."""
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.reporter = get_user_model().objects.create_user(
            username='reporter',
            email='reporter@example.com',
            password='reportpass123'
        )
        self.moderator = get_user_model().objects.create_user(
            username='moderator',
            email='mod@example.com',
            password='modpass123',
            is_staff=True
        )
        
        # Add moderator to moderators group
        from django.contrib.auth.models import Group
        moderators_group, _ = Group.objects.get_or_create(name='moderators')
        self.moderator.groups.add(moderators_group)
        
        self.category = Category.objects.create(
            name='Test Category',
            description='Test description'
        )
        self.document = Document.objects.create(
            title='Test Document',
            description='Test description',
            category=self.category,
            uploaded_by=self.user,
            language='en'
        )
    
    def test_create_report_authenticated(self):
        """Test creating a report when authenticated."""
        self.client.force_authenticate(user=self.reporter)
        
        url = reverse('report-list')
        data = {
            'document_slug': self.document.slug,
            'reason': 'copyright',
            'description': 'This document infringes copyright.'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['reason'], 'copyright')
        self.assertEqual(response.data['status'], 'pending')
    
    def test_create_report_duplicate(self):
        """Test creating duplicate report fails."""
        # Create first report
        Report.objects.create(
            document=self.document,
            reported_by=self.reporter,
            reason='copyright',
            description='First report.'
        )
        
        self.client.force_authenticate(user=self.reporter)
        
        url = reverse('report-list')
        data = {
            'document_slug': self.document.slug,
            'reason': 'spam',
            'description': 'Duplicate report.'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_create_report_unauthenticated(self):
        """Test creating report without authentication fails."""
        url = reverse('report-list')
        data = {
            'document_slug': self.document.slug,
            'reason': 'copyright',
            'description': 'This document infringes copyright.'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_reports_moderator(self):
        """Test listing reports as moderator."""
        # Create a report
        Report.objects.create(
            document=self.document,
            reported_by=self.reporter,
            reason='copyright',
            description='Test report.'
        )
        
        self.client.force_authenticate(user=self.moderator)
        url = reverse('report-list')
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_list_reports_non_moderator(self):
        """Test listing reports as non-moderator fails."""
        self.client.force_authenticate(user=self.reporter)
        url = reverse('report-list')
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_my_reports(self):
        """Test getting user's own reports."""
        # Create a report
        Report.objects.create(
            document=self.document,
            reported_by=self.reporter,
            reason='copyright',
            description='Test report.'
        )
        
        self.client.force_authenticate(user=self.reporter)
        url = reverse('report-my-reports')
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
