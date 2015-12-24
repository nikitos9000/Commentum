import datetime
import json
import time

def serialize_json(value):
    class JSONDateTimeEncoder(json.JSONEncoder):
        def default(self, o):
            if isinstance(o, datetime.datetime):
                return time.mktime(o.utctimetuple())
            return json.JSONEncoder.default(self, o)

    return json.dumps(value, cls = JSONDateTimeEncoder)