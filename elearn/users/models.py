from django.db import models
from django.utils import timezone
from django.urls import reverse

# Create your models here.

class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True, null=True)
    last_updated_date = models.DateField(auto_now=True, null=True)

    class Meta:
        abstract = True


class UserModel(models.Model):
    user_name = models.CharField("NickName", max_length=255, null=True, blank=True)
    email =