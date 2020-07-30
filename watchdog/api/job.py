from flask import json
from pytz import timezone
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.pool import ThreadPoolExecutor

from watchdog import app

JOB_INTERNAL = "1"  # 某个值在一段时间内是否超出阈值
JOB_CRON = "2"  # 某个值在N天的某个时间段内，平均值是否超出前N天的平均值

job_stores = {
    'default': MemoryJobStore(),
}

executors = {
    'default':  ThreadPoolExecutor(20),
}

job_defaults = {
    'max_instance': 3
}

job = BackgroundScheduler()
job.configure(
    job_stores=job_stores, 
    executors=executors, 
    job_defaults=job_defaults, 
    timezone=timezone('Asia/Shanghai')
)
def jobs():
    with open('watchdog/db/monitor.json') as db_file:
        db_file = json.load(db_file)
        internal = db_file.get(JOB_INTERNAL)
        cron = db_file.get(JOB_CRON)
        app.logger.debug(internal)
        app.logger.debug(cron)

job.add_job(jobs)