import React from 'react';
import { Button, Layout, Menu, Form, DatePicker, Input, Space } from 'antd';
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
          <Menu.Item className="Submit" key="1" icon={<PieChartOutlined />} >
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
    this.state = {item: "", start: "", end: "", result: {}, range: []}
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.requestServe = this.requestServe.bind(this);
  }

  handleSubmit(event) {
    this.requestServe()
    event.preventDefault()
  }

  handleItemChange(event) {
    this.setState({item: event.target.value})
  }

  requestServe() {
    fetch("/avg/" + this.state.item + "?start_time=" + this.state.start + "&end_time=" + this.state.end).
    then(res => res.json()).
    then(
      (result) => {
        this.setState({result: result})
      }
    ).
    catch((err) => {
      alert("Request Error")
    })
  }

  render() {
    const result = this.state.result
    const elements = []
    for (const i in result) {
      elements.push(<li key={i}>{i}:{result[i]}</li>)
    }
    const { RangePicker } = DatePicker
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
    const inputConfig = {
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Please input item!'
        }
      ]
    }
    const onFinish = fieldsValue => {
      const rangeTimeValue = fieldsValue["range-time-picker"]
      const inputItem = fieldsValue["input-item"]
      const values = {
        "range-time-picker": [
          rangeTimeValue[0].format("YYYY-MM-DD HH:mm"),
          rangeTimeValue[1].format("YYYY-MM-DD HH:mm"),
        ],
        "input-item": inputItem,
      }
      console.log(values)
      this.setState({
        start: values["range-time-picker"][0],
        end: values["range-time-picker"][1],
        item: values["input-item"],
      })
      this.requestServe()
    }
    return (
      <div className="submit">
        <Form name="time_related_controls" {...formItemLayout} onFinish={onFinish}>
          <Form.Item name="input-item" label="Field" {...inputConfig}>
            <Input placeholder="Item" />
          </Form.Item>
          <Form.Item name="range-time-picker" label="Time" {...rangeConfig}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
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
      <ul>
        {elements}
      </ul>
      </div>
    )
  }
}

export default App;
