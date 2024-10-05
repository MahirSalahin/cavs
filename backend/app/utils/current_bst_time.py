import pytz
from datetime import datetime

dhaka_tz = pytz.timezone("Asia/Dhaka")


def current_bst_time():
    return datetime.now(dhaka_tz)
