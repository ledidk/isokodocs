from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from .models import Document
from djangoapp.categories.models import Category


class DocumentModelTest(TestCase):
    """Test Document model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='Test Category',
            description='Test description'
        )
    
    def test_document_creation(self):
        """Test creating a document."""
        # Create a simple PDF file for testing
        pdf_content = b'%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000200 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n284\n%%EOF'
        file = SimpleUploadedFile(
            'test.pdf',
            pdf_content,
            content_type='application/pdf'
        )
        
        document = Document.objects.create(
            title='Test Document',
            description='Test description',
            file=file,
            category=self.category,
            uploaded_by=self.user,
            language='en'
        )
        
        self.assertEqual(document.title, 'Test Document')
        self.assertEqual(document.status, 'pending')  # Default status
        self.assertEqual(document.view_count, 0)
        self.assertEqual(document.download_count, 0)
        self.assertIsNotNone(document.slug)
    
    def test_document_str(self):
        """Test document string representation."""
        document = Document.objects.create(
            title='Test Document',
            description='Test description',
            category=self.category,
            uploaded_by=self.user,
            language='en'
        )
        
        self.assertEqual(str(document), 'Test Document')


class DocumentAPITest(APITestCase):
    """Test Document API endpoints."""
    
    def setUp(self):
        """Set up test data."""
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
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
        
        # Create test document
        self.document = Document.objects.create(
            title='Test Document',
            description='Test description',
            category=self.category,
            uploaded_by=self.user,
            language='en',
            status='approved'  # Approved for testing
        )
    
    def test_list_documents_unauthenticated(self):
        """Test listing documents without authentication."""
        url = reverse('document-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_document_authenticated(self):
        """Test creating document when authenticated."""
        self.client.force_authenticate(user=self.user)
        
        # Create a simple PDF file for testing
        pdf_content = b'%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000200 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n284\n%%EOF'
        file = SimpleUploadedFile(
            'test.pdf',
            pdf_content,
            content_type='application/pdf'
        )
        
        url = reverse('document-list')
        data = {
            'title': 'New Document',
            'description': 'New description',
            'category_id': self.category.id,
            'language': 'en',
            'license': 'cc-by',
            'tags': ['test', 'document'],
            'file': file
        }
        
        response = self.client.post(url, data, format='multipart')
        
        # Should create document but status should be pending
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'pending')
    
    def test_approve_document_moderator(self):
        """Test approving document as moderator."""
        self.client.force_authenticate(user=self.moderator)
        
        url = reverse('document-approve', kwargs={'pk': self.document.pk})
        data = {'action': 'approve'}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.document.refresh_from_db()
        self.assertEqual(self.document.status, 'approved')
    
    def test_search_documents(self):
        """Test searching documents."""
        url = reverse('document-list')
        response = self.client.get(url, {'search': 'Test'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_filter_by_category(self):
        """Test filtering documents by category."""
        url = reverse('document-list')
        response = self.client.get(url, {'category': self.category.slug})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
