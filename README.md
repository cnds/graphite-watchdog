# graphite-hawk
Graphite Advanced Monitor
* Based on [Flask](https://github.com/pallets/flask), [Apscheduler](https://github.com/agronholm/apscheduler) and [SQLite](https://www.sqlite.org/index.html)

* 支持的模式
    * [ ] 查询多个项目在某个时间段的平均值
    * [ ] 查询某项目在N天内同一时间段的平均值，并生成图表
    * [ ] 设置监控某个值，超过一个阈值后告警
    * [ ] 设置监控某个阈值，超过某一段时间的平均值多少后告警
    * [ ] 设置定时播报某个值在某个时间段的平均值



v0.1
    * query support, based on https://graphite.readthedocs.io/en/latest/render_api.html

v0.2
    * monitor support
