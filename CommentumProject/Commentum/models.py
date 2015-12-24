from datetime import datetime
from django.db import models
from django.contrib.auth.models import User

class ExistsMixin(models.Model):
    @property
    def exists(self):
        return bool(self._entity_exists and self._original_pk == self.pk)


class Page(models.Model):
    host = models.CharField(max_length = 63)
    port = models.IntegerField()
    path = models.CharField(max_length = 255)
    params = models.CharField(max_length = 1024)

    def __unicode__(self):
        return '%s:%d%s?%s ' % (self.host, self.port, self.path, self.params)


class Block(models.Model):
    page = models.ForeignKey(Page)
    text = models.TextField()

    def __unicode__(self):
        return self.text


class Comment(models.Model):
    block = models.ForeignKey(Block)
    user = models.ForeignKey(User, related_name = 'user_comment_set')
    text = models.TextField()
    date = models.DateTimeField(default = datetime.now, blank = True)
    public = models.BooleanField()
    visible = models.ManyToManyField(User, blank = True)
    reply = models.ForeignKey('self', blank = True, null = True)

    def __unicode__(self):
        return self.text