from watchdog import app
from watchdog.api import views
from watchdog.api.job import job

if __name__ == "__main__":
    # job.start()
    app.logger.debug(app.config)
    app.run()
