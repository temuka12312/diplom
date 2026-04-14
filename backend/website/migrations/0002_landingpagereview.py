from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("website", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="LandingPageReview",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("role", models.CharField(blank=True, max_length=160)),
                ("company", models.CharField(blank=True, max_length=160)),
                ("review_text", models.TextField()),
                ("rating", models.PositiveSmallIntegerField(default=5)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Landing Page Review",
                "verbose_name_plural": "Landing Page Reviews",
                "ordering": ("sort_order", "-created_at"),
            },
        ),
    ]
