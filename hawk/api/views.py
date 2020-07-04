from datetime import datetime, timedelta

import requests
from flask import request, abort
from hawk import app


@app.route('/avg/<string:item>')
def get_item_avg(item):
    """
    average of item from start time to end time
    """
    args = request.args
    app.logger.debug('item: %s' % item)
    start_time = _validate_date(args.get('start_time'), '%Y%m%d %H:%M')
    end_time = _validate_date(args.get('end_time'), '%Y%m%d %H:%M')
    start_str = '{0}_{1}'.format(start_time.strftime('%H:%M'),
                                 start_time.strftime('%Y%m%d'))
    end_str = '{0}_{1}'.format(end_time.strftime('%H:%M'),
                               end_time.strftime('%Y%m%d'))
    data = _request_graphite(item, start_str, end_str)
    return _calc_avg(data)


def _calc_avg(data):
    result = {}
    for i in data:
        data_point = i['datapoints']
        avg_time = sum([k[0] for k in data_point if k[0]]) / len(data_point)
        result[i['target']] = round(avg_time, 2)

    return result


def _request_graphite(items, start_str, end_str):
    try:
        params = {
            'target': items.split(','),
            'from': start_str,
            'until': end_str,
        }
        resp = requests.get(app.config['URL'], params=params)
        if resp.status_code != 200:
            app.logger.info(resp.content)
            abort(400, 'Request Graphite Error')

    except Exception as ex:
        app.logger.info(ex)
        abort(400, 'Graphite Service Error')

    return resp.json()


def _validate_date(date, date_format):
    """
    validate input date
    """
    try:
        date = datetime.strptime(date, date_format)
    except Exception as e:
        app.logger.debug(e)
        abort(400, 'Invalid Date: %s' % date)

    return date


@app.route('/chart', methods=["POST"])
def avg_chart():
    data = request.json
    items = data.get('items')
    date_start = data.get('date_start')
    date_end = data.get('date_end')
    time_start = data.get('time_start')
    time_end = data.get('time_end')

    _validate_date(time_start, '%H:%M')
    _validate_date(time_end, '%H:%M')

    date_fmt_start = _validate_date(date_start, '%Y%m%d')
    date_fmt_end = _validate_date(date_end, '%Y%m%d')
    date_list = [
        datetime.strftime((date_fmt_start + timedelta(days=i)), '%Y%m%d')
        for i in range((date_fmt_end - date_fmt_start).days)
    ]

    result = {}
    for d in date_list:
        start = '{0}_{1}'.format(time_start, d)
        end = '{0}_{1}'.format(time_end, d)
        data = _request_graphite(items, start, end)
        app.logger.debug(data)
        avg = _calc_avg(data)
        for i in items.split(","):
            result.setdefault(i, []).append(
                {"date": d, "value": avg.get(i, 0)})

    app.logger.debug(result)
    return result
