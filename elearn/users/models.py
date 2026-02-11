from django.db import models
from django.utils import timezone
from django.urls import reverse

# Create your models here.

class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True, null=True)
    last_updated_date = models.DateField(auto_now=True, null=True)

    class Meta:
        abstract = True


class User(BaseModel):
    username = models.CharField("NickName", max_length=255, null=True, blank=True)
    email = models.EmailField(verbose_name="Email", max_length = 255, null=True, blank=True)
    phone = models.IntegerField(verbose_name="Phone", max_length= 8, null=True, blank=True)
    password = models.CharField(verbose_name="Password", max_length = 16, null=True, blank=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "User"
        
    def __str__(self) -> str:
        return self.username