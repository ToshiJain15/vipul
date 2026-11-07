from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Memory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('date_label', models.CharField(help_text="e.g. 'Oct 14, 2022' or 'Summer 2023'", max_length=100)),
                ('description', models.TextField()),
                ('image_url', models.CharField(blank=True, help_text='Image URL or relative path', max_length=500, null=True)),
                ('emoji_icon', models.CharField(default='❤️', max_length=10)),
                ('order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'Memories',
                'ordering': ['order', 'created_at'],
            },
        ),
        migrations.CreateModel(
            name='LoveReason',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('icon', models.CharField(default='💖', help_text='Emoji or icon', max_length=20)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('icon', models.CharField(default='🎁', max_length=20)),
                ('code', models.CharField(max_length=50, unique=True)),
                ('is_redeemed', models.BooleanField(default=False)),
                ('redeemed_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Wish',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('relationship', models.CharField(blank=True, default='Loved One', max_length=100)),
                ('message', models.TextField()),
                ('emoji', models.CharField(default='🎉', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_approved', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='LoveLetter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipient', models.CharField(default='Vipul', max_length=100)),
                ('title', models.CharField(default='To The Love Of My Life', max_length=200)),
                ('letter_text', models.TextField()),
                ('sign_off', models.CharField(default='Forever & Always, Yours ❤️', max_length=200)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
    ]

