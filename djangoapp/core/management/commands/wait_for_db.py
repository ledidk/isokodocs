from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from django.db.utils import OperationalError
import time


class Command(BaseCommand):
    help = 'Wait for database to be available'

    def handle(self, *args, **options):
        db_conn = connections['default']
        start_time = time.time()
        timeout = 60

        while time.time() - start_time < timeout:
            try:
                cursor = db_conn.cursor()
                cursor.close()
                self.stdout.write(self.style.SUCCESS('Database available!'))
                return
            except OperationalError as e:
                self.stdout.write(f'Waiting for database... ({e})')
                time.sleep(1)

        raise CommandError('Database not available after 60 seconds')
