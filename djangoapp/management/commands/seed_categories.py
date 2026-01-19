from django.core.management.base import BaseCommand
from djangoapp.categories.models import Category


class Command(BaseCommand):
    help = 'Seed the database with default categories for IsokoDocs'

    def handle(self, *args, **options):
        """Create default categories if they don't exist."""

        categories_data = [
            {
                'name': 'Government Documents',
                'description': 'Official government publications, laws, and policies',
                'icon': '🏛️',
                'order': 1,
            },
            {
                'name': 'Education',
                'description': 'Educational materials, textbooks, and research papers',
                'icon': '📚',
                'order': 2,
            },
            {
                'name': 'Health & Medicine',
                'description': 'Medical documents, health policies, and research',
                'icon': '🏥',
                'order': 3,
            },
            {
                'name': 'Agriculture',
                'description': 'Agricultural guides, farming techniques, and research',
                'icon': '🌾',
                'order': 4,
            },
            {
                'name': 'Business & Economy',
                'description': 'Business documents, economic reports, and market analysis',
                'icon': '💼',
                'order': 5,
            },
            {
                'name': 'Culture & Heritage',
                'description': 'Cultural documents, traditional knowledge, and heritage materials',
                'icon': '🎭',
                'order': 6,
            },
            {
                'name': 'History',
                'description': 'Historical documents, archives, and research',
                'icon': '📜',
                'order': 7,
            },
            {
                'name': 'Legal Documents',
                'description': 'Legal texts, court decisions, and legal research',
                'icon': '⚖️',
                'order': 8,
            },
            {
                'name': 'Science & Technology',
                'description': 'Scientific papers, technical documents, and research',
                'icon': '🔬',
                'order': 9,
            },
            {
                'name': 'Environment',
                'description': 'Environmental reports, conservation documents, and research',
                'icon': '🌍',
                'order': 10,
            },
            {
                'name': 'Human Rights',
                'description': 'Human rights documents, reports, and advocacy materials',
                'icon': '✊',
                'order': 11,
            },
            {
                'name': 'Other',
                'description': 'Miscellaneous documents that don\'t fit other categories',
                'icon': '📁',
                'order': 12,
            },
        ]

        created_count = 0
        updated_count = 0

        for category_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=category_data['name'],
                defaults=category_data
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created category: {category.name}')
                )
            else:
                # Update existing category with new data
                for key, value in category_data.items():
                    setattr(category, key, value)
                category.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated category: {category.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeding complete. Created: {created_count}, Updated: {updated_count}'
            )
        )
