from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings


class Command(BaseCommand):
    help = 'Create a superuser with default credentials for IsokoDocs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            default='admin',
            help='Username for the superuser (default: admin)'
        )
        parser.add_argument(
            '--email',
            default='admin@isokodocs.com',
            help='Email for the superuser (default: admin@isokodocs.com)'
        )
        parser.add_argument(
            '--password',
            default='admin123',
            help='Password for the superuser (default: admin123)'
        )
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Create superuser without prompting for confirmation'
        )

    def handle(self, *args, **options):
        """Create superuser if it doesn't exist."""
        
        User = get_user_model()
        
        username = options['username']
        email = options['email']
        password = options['password']
        
        # Check if superuser already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'Superuser "{username}" already exists.')
            )
            return
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'User with email "{email}" already exists.')
            )
            return
        
        # Confirm creation if not --no-input
        if not options['no_input']:
            self.stdout.write(
                f'Creating superuser with username: {username}, email: {email}'
            )
            confirm = input('Continue? (y/N): ')
            if confirm.lower() not in ['y', 'yes']:
                self.stdout.write('Aborted.')
                return
        
        # Create superuser
        try:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            
            # Add to moderators group if it exists
            from django.contrib.auth.models import Group
            moderators_group, created = Group.objects.get_or_create(name='moderators')
            user.groups.add(moderators_group)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Superuser "{username}" created successfully with moderator privileges.'
                )
            )
            
            if password == 'admin123':
                self.stdout.write(
                    self.style.WARNING(
                        'WARNING: Using default password. Change this in production!'
                    )
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {str(e)}')
            )
