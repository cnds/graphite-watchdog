import React from 'react';
import { Button, Layout, Menu, Form, DatePicker, TimePicker, Select } from 'antd';
import { PieChartOutlined, ApartmentOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import './App.css';

function App() {
  const { Header, Content, Footer, Sider } = Layout;
  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Sider>
        <div className="logo" icon={<ApartmentOutlined />} />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />} >
            Option1
          </Menu.Item>
          <Menu.Item key="2" icon={<PieChartOutlined />}>
            Option2
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0}} />
        <Content style={{ margin: "0 16px"}}>
          <Submit />
        </Content>
        <Footer style={{ textAlign: "center" }}>Ant Design</Footer>
      </Layout>
    </Layout>
  );
}

class Submit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dateStart: "", dateEnd: "", timeStart: "", timeEnd: "", selected: "", result: {}}
    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
  }

  requestItems() {
    fetch("/items").then(res => res.json()).then((result) => {this.setState({items: result.data})})
  }

  requestAvg() {
    const data = {
      date_start: this.state.dateStart,
      date_end: this.state.dateEnd,
      time_start: this.state.timeStart,
      time_end: this.state.timeEnd,
      items: this.state.selected
    }
    fetch(
      "/chart", 
      {
        method: "POST", 
        body: JSON.stringify(data), 
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({result: result})
      }
    )
      .catch((err) => {
        alert("Request Error" + err)
    })
  }

  onChange(value) {
    this.setState({selected: value})
  }

  onBlur() {
    console.log('blur')
  }

  onFocus() {
    this.requestItems()
  }

  onSearch(val) {
    console.log('serach')
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };
    const rangeConfig = {
      rules: [
        {
          type: 'array',
          required: true,
          message: 'Please select time!',
        },
      ],
    };
    const onFinish = fieldsValue => {
      const rangeDateValue = fieldsValue["range-date-picker"]
      const rangeTimeValue = fieldsValue["range-time-picker"]
      const values = {
        "range-date-picker": [
          rangeDateValue[0].format("YYYYMMDD"),
          rangeDateValue[1].format("YYYYMMDD"),
        ],
        "range-time-picker": [
          rangeTimeValue[0].format("HH:mm"),
          rangeTimeValue[1].format("HH:mm"),
        ],
      }
      this.setState({
        dateStart: values["range-date-picker"][0],
        dateEnd: values["range-date-picker"][1],
        timeStart: values["range-time-picker"][0],
        timeEnd: values["range-time-picker"][1],
      })
      this.requestAvg()
    }
    const options = this.state.items
    const selectOptions = []
    for (const i in options) {
      selectOptions.push(<Select.Option value={options[i]}>{options[i]}</Select.Option>)
    }

    const result = this.state.result
    let graphConfig = {}
    if (result) {
      const text = this.state.selected
      const data = result[text]
      graphConfig = {
        data: data,
        title: {
          visible: true,
          text: text,
        },
        xField: 'date',
        yField: 'value',
        point: {
          visible: true,
          size: 5,
          shape: 'diamond',
          style: {
            fill: 'white',
            stroke: '#2593fc',
            lineWidth: 2,
          },
        },
      }
    }
    return (
      <div className="submit">
        <Form name="time_related_controls" {...formItemLayout} onFinish={onFinish}>
          <Form.Item name="item-selecter" label="Item" required>
          <Select 
            showSearch 
            style={{ width: 350 }} 
            placeholder="Select an item" 
            onChange={ this.onChange } 
            onFocus={ this.onFocus } 
            onBlur={ this.onBlur} 
            onSearch={ this.onSearch }
            filterOption={(input, option) => 
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            >
              {selectOptions}
          </Select>
          </Form.Item>
          <Form.Item name="range-date-picker" label="Date" {...rangeConfig}>
            <DatePicker.RangePicker showTime format="YYYYMMDD" />
          </Form.Item>
          <Form.Item name="range-time-picker" label="Time" {...rangeConfig}>
            <TimePicker.RangePicker showTime format="HH:mm" />
          </Form.Item>
          <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          }}
          >
            <Button type="primary" htmlType="submit">
            Submit
            </Button>
          </Form.Item>
        </Form>
        <Line {...graphConfig}></Line>
      </div>
    )
  }
}

export default App;