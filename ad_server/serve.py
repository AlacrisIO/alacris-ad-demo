from collections import namedtuple
import json

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from .config import SERVER_KEY
from .db import get_db
from .pay import maybe_pay

bp = Blueprint('serve', __name__, url_prefix='/ad_server')


class Ad(namedtuple(
        'Ad', 'advertiser balance advertisement price publisher_reward '
        'viewer_reward')):
    "Information about an advertisement"
    # `balance` is balance of `advertiser`


def ad_cost(ad):
    return ad.price + ad.publisher_reward + ad.viewer_reward

def ad_affordable(ad):
    return ad_cost(ad) < ad.balance

def maybe_choose_ad():
    db = get_db()
    ad_raw = db.execute(
        'SELECT advertiser, advertisement, price, publisher_reward,'
        'viewer_reward FROM advertisements ORDER BY RANDOM() LIMIT 1;'
    ).fetchone()
    advertiser = ad_raw[0]
    balance = int( # XXX: Join would be faster?
        db.execute('SELECT balance, id FROM advertisers WHERE id=?;',
                         str(advertiser)).fetchone()[0])
    ad = Ad(balance=balance, **dict(zip(ad_raw.keys(), ad_raw)))
    if ad_affordable(ad):
        db.execute('UPDATE advertisers SET balance=? WHERE id=?',
                   (ad.balance - ad_cost(ad), ad.advertiser))
        db.commit()  # XXX: These need to be serialized for speed
        return ad
    return None


def choose_ad():
    while True:
        ad = maybe_choose_ad()
        if ad: return ad


@bp.route('/serve/viewer/<string:viewer>/publisher/<string:publisher>')
def serve(viewer, publisher):
    ad = choose_ad()
    assert(ad_affordable(ad) and  # Double-check balance before trying payment
           maybe_pay(sender=SERVER_KEY, recipient=viewer,
                     amount=ad.viewer_reward) and
           maybe_pay(sender=SERVER_KEY, recipient=publisher,
                     amount=ad.publisher_reward))
    return json.dumps(
        dict(viewer=viewer, publisher=publisher, **ad._asdict()))
