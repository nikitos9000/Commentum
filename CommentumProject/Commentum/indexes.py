from dbindexer.lookups import StandardLookup
from dbindexer.api import register_index

import models

FIELD_INDEXES = {
    models.Page: {'indexed': ['block_set']},
    models.Block: {'indexed': ['comment_set', 'page', 'text']},
    models.Comment: {'indexed': ['block', 'user']}
}

register_index(models.Page, {'block_set': StandardLookup()})
register_index(models.Block, {'comment_set': StandardLookup()})
register_index(models.Comment, {
#    'block': StandardLookup(),
    'block__page__id': StandardLookup()})
register_index(models.User, {'user_comment_set': StandardLookup()})

#register_index(models.Page, {
#    'block__comment__public': StandardLookup(),
#    'block__comment__visible': StandardLookup(),
#    'block__comment__user': StandardLookup(),
#})