# Generated by Django 3.0.9 on 2020-10-03 04:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0008_auto_20201003_0638'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='follwing_count',
            new_name='following_count',
        ),
    ]