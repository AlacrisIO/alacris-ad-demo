import requests, json, time, re

is_address = re.compile('0x[0-9A-Fa-f]{40}$').match

arg_keys = 'sender recipient amount'.split()
arg_keys_set = set(arg_keys)

def check_args(args):
    assert set(args.keys()) == arg_keys_set
    assert is_address(args['sender'])
    assert is_address(args['recipient'])
    assert type(args['amount']) == int
    # XXX: Check balance of sender?


def maybe_pay(**args):
    check_args(args)
    payment_data = args.copy()
    payment_data['amount'] = hex(payment_data['amount'])
    r = requests.post('http://localhost:8081/api/payment', json=payment_data)
    delay = 0.001
    while True:
        time.sleep(0.1)
        s = requests.get('http://localhost:8081/api/thread?id=%s' %
                         r.json()['result']['thread'])
        delay *= 2
        if s.json() != {'result': 'The operation is pending'}:
            break
        if delay > 20:
            return
    return s.json()
