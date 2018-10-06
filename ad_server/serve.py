from collections import namedtuple
import json


from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from .db import get_db

bp = Blueprint('serve', __name__, url_prefix='/ad_server')


class Ad(namedtuple(
        'Ad', 'advertiser balance advertisement price publisher_reward '
        'viewer_reward')):
    "Information about an advertisement"


def maybe_choose_ad():
    db = get_db()
    ad_raw = db.execute(
        'SELECT advertiser, advertisement, price, publisher_reward,'
        'viewer_reward FROM advertisements ORDER BY RANDOM() LIMIT 1;'
    ).fetchone()
    advertiser = ad_raw[0]
    balance = int(
        db.execute('SELECT id, balance FROM advertisers WHERE id=?;',
                         str(advertiser)).fetchone()[1])
    ad = Ad(balance=balance, **dict(zip(ad_raw.keys(), ad_raw)))
    cost = ad.price + ad.publisher_reward + ad.viewer_reward
    if cost < balance:
        db.execute('UPDATE advertisers SET balance=? WHERE id=?',
                   (ad.balance - cost, ad.advertiser))
        db.commit()  # XXX: These need to be serialized for speed
        return ad
    return None


def choose_ad():
    while True:
        ad = maybe_choose_ad()
        if ad: return ad


@bp.route('/serve/<string:viewer>/<string:publisher>')
def serve(viewer, publisher):
    # viewer = request.form['viewer']  # Only good for POST
    # publisher = request.form['publisher']
    return json.dumps(choose_ad()._asdict())


