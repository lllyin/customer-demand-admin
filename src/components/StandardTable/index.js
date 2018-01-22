import React, {PureComponent} from 'react';
import moment from 'moment';
import {Table, Alert, Badge, Divider} from 'antd';
import styles from './index.less';

const statusMap = ['default', 'processing', 'success', 'error'];

class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({selectedRowKeys, totalCallNo});
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log("处理tab变化：",pagination,filters,sorter)
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const {selectedRowKeys, totalCallNo} = this.state;
    // const { data: { list, pagination }, loading } = this.props;
    let list = this.props.data;
    list.forEach((val) => {
      val.desc = val.desc ? val.desc.substr(0, 10) : '';
    });
    let loading = this.props.loading;


    const status = ['未审核', '已审核'];
    const types = {
      "si": '系统集成',
      "purchase": '产品购买',
      "tech": '技术支持',
      "other": '其他'
    };

    const columns = [
      {
        title: '名称',
        dataIndex: 'title',
      },
      {
        title: '描述',
        dataIndex: 'desc',
      },
      {
        title: '类型',
        dataIndex: 'req_type',
        filters: [
          {
            text: types["si"],
            value: "si",
          },
          {
            text: types["purchase"],
            value: "purchase",
          },
          {
            text: types["tech"],
            value: "tech",
          },
          {
            text: types["other"],
            value: "other",
          },
        ],
        render(val) {
          return <span> {types[val]} </span>;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          }
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]}/>;
        },
      },
      {
        title: '报价',
        'dataIndex': "budget",
        sorter: true,
      },
      {
        title: '查看方案',
        render: () => <a href='#'>查看</a>,
      },
      {
        title: '发布时间',
        dataIndex: 'created_time',
        sorter:true,
        render: val => <span>{moment(val*1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '审核',
        render: () => (
          <div>
            <a href="">通过</a>
            <Divider type="vertical"/>
            <a href="">驳回</a>
          </div>
        ),
      },
    ];

     const paginationProps = {
       showSizeChanger: true,
       showQuickJumper: true,
       // ...pagination,
     };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                服务调用总计 <span style={{fontWeight: 600}}>{totalCallNo}</span> 万
                <a onClick={this.cleanSelectedKeys} style={{marginLeft: 24}}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;