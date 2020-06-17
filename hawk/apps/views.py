from datetime import datetime

import requests
from flask import request, abort
from hawk import app


@app.route('/avg/<string:item>')
def get_item_avg(item):
    """
    average of item from start time to end time
    """
    args = request.args
    start_time = validate_date(args.get('start_time'))
    end_time = validate_date(args.get('end_time'))
    start_str = '{0}_{1}'.format(start_time.strftime('%H:%M'), 
                                 start_time.strftime('%Y%m%d'))
    end_str = '{0}_{1}'.format(end_time.strftime('%H:%M'), 
                               end_time.strftime('%Y%m%d'))
    try:
        params = {'from': start_str, 'until': end_str, 'target': item}
        resp = requests.get(app.config['URL'], params=params)
        if resp.status_code != 200:
            abort(400, 'Request Graphite Error')

    except Exception as ex:
        app.logger.info(ex)
        abort(400, 'Graphite Service Error')

    data = resp.json()
    result = {}
    for i in data:
        data_point = i['datapoints']
        average_time = sum([k[0] for k in data_point]) / len(data_point)
        result[i['target']] = average_time

    return result


def validate_date(date):
    """
    validate input date, should be string '%Y-%m-%d %H:%M'
    """
    try:
        date = datetime.strptime(date, '%Y-%m-%d %H:%M')
    except Exception:
        abort(400, 'Invalid Date')

    return date 
