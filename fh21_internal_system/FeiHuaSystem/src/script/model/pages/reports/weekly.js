import React from 'react';
import {Layout, Table, Input, Icon, Button, Popconfirm, AutoComplete, Tag, notification } from 'antd';
import PageHeader from '../page_header';
import fh_fetch from '../../../utils/fh_fetch';
import fh_service from '../../../service/service';
import fh_run from '../../../fh_run';

import '../../../../style/model/pages/reports/weekly.css';

const {Content} = Layout;
const AutoCompleteOption = AutoComplete.Option;

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        type: this.props.type,
        rows: this.props.rows,
        editable: false
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({value});
    }
    check = () => {
        this.setState({editable: false});
        if (this.props.onChange) {
            this
                .props
                .onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({editable: true});
    }
    render() {
        const {value, type, rows, editable} = this.state;
        return (
            <div className="editable-cell">
                {editable
                    ? <div className="editable-cell-input-wrapper">
                            <Input value={value} type={type} rows={rows} onChange={this.handleChange} onPressEnter={this.check}/>
                            <Icon type="check" className="editable-cell-icon-check" onClick={this.check}/>
                        </div>
                    : <div className="editable-cell-text-wrapper">
                        {value || ' '}
                        <Icon type="edit" className="editable-cell-icon" onClick={this.edit}/>
                    </div>
                }
            </div>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '项目名称',
                dataIndex: 'name',
                width: '30%',
                render: (text, record, index) => (<EditableCell value={text} onChange={this.onCellChange(index, 'name')}/>)
            }, {
                title: '进度',
                dataIndex: 'age',
                width: '10%',
                render: (text, record, index) => (<EditableCell value={text} onChange={this.onCellChange(index, 'age')}/>)
            }, {
                title: '描述',
                dataIndex: 'address',
                width: '50%',
                render: (text, record, index) => (<EditableCell value={text} type="textarea" rows={4} onChange={this.onCellChange(index, 'address')}/>)
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: '10%',
                className: 'fh-reports-control-spans',
                render: (text, record, index) => {
                    return (this.state.dataSource.length > 1
                        ? (
                            <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(index)}>
                                <a href="">删除</a>
                            </Popconfirm>
                        )
                        : null);
                }
            }
        ];

        this.state = {
            dataSource: [
                {
                    key: '0',
                    name: '计划总结 0',
                    age: '100%',
                    address: '已完成 0'
                }, {
                    key: '1',
                    name: '计划总结 1',
                    age: '100%',
                    address: '已完成 1'
                }
            ],
            count: 2
        };
    }
    onCellChange = (index, key) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            dataSource[index][key] = value;
            this.setState({dataSource});
        };
    }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({dataSource});
    }
    handleAdd = () => {
        const {count, dataSource} = this.state;
        const newData = {
            key: count,
            name: `计划总结 ${count}`,
            age: '100%',
            address: `已完成 ${count}`
        };
        this.setState({
            dataSource: [
                ...dataSource,
                newData
            ],
            count: count + 1
        });
    }
    render() {
        const {dataSource} = this.state;
        const columns = this.columns;
        return (
            <div>
                <Table bordered dataSource={dataSource} pagination={false} columns={columns} className="fh-email-send-content"/>
                <Button className="fh-email-add" onClick={this.handleAdd}>添加</Button>
            </div>
        );
    }
}

class SendInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSourceEmail: [],
            emails: [],
            tags: this.defaultValueEmail()
        }
        this.emailAutoCompleteChange = this.emailAutoCompleteChange.bind(this);
        this.emailAutoCompleteSelect = this.emailAutoCompleteSelect.bind(this);
    }
    emailAutoCompleteSelect(value){
        var emails = this.state.emails;
        this.setState({
            emails: [...emails, value]
        }, this.addTagEmail);
    }
    emailAutoCompleteChange(value) {
        let dataSourceEmail;
        if (!value || value.indexOf('@') >= 0) {
            dataSourceEmail = [];
        } else {
            dataSourceEmail = fh_run.autoCompleteOptions.map(domain => `${value}${domain}`).map((email) => {
                return <AutoCompleteOption key={email}>{email}</AutoCompleteOption>;
              });
        }
        this.setState({ dataSourceEmail, value });
        // 键入;则选择邮箱地址
        if(value.indexOf(';') > 0){
            var emails = this.state.emails;
            this.setState({
                emails: [...emails, value.slice(0, -1)]
            }, this.addTagEmail);
        }
    }
    tagColsed(index){
        var { emails } = this.state;
        emails.splice(index, 1);
        this.setState({
            emails
        }, this.addTagEmail);
    }
    addTagEmail(){
        var { emails } = this.state;
        var tags = emails.map((email, key) => <Tag style={{marginBottom: '1em'}} closable onClose={() => this.tagColsed(key)} key={email + key}>{email}</Tag>);
        this.setState({value: '', tags});
        this.props.onGetEmails(emails);
    }
    defaultValueEmail() {
        if(!this.props.defaultValue) return;
        var defaultEmail = this.props.defaultValue.split(';');
        var tags = defaultEmail.map((email, key) => <Tag style={{marginBottom: '1em'}} closable onClose={() => this.tagColsed(key)} key={email + key}>{email}</Tag>);
        this.props.onGetEmails(defaultEmail);
        return tags;
    }
    render() {
        const { dataSourceEmail, tags } = this.state;
        return (
            <Layout style={{backgroundColor: "transparent"}}>
                <Content>
                    <div className="fh-weekly-input">
                        <span className="fh-weekly-input-name">{this.props.inputName}</span>
                        <div className="fh-weekly-input-box">
                            {tags}
                            <AutoComplete
                                // style={{width: WIDTH}}
                                value={this.state.value}
                                className="fh-weekly-autocomplet"
                                dataSource={dataSourceEmail}
                                onSelect={this.emailAutoCompleteSelect}
                                onChange={this.emailAutoCompleteChange}
                                placeholder="多个邮箱用分号隔开" />
                        </div>
                    </div>
                </Content>
            </Layout>
        )
    }
}

class WeeklyReports extends React.Component {
    constructor() {
        super();
        this.state = {
            to: [],
            cc: [],
            isSendLoading: false
        };
        this.sendEmailCc = this.sendEmailCc.bind(this);
        this.sendEmailTo = this.sendEmailTo.bind(this);
        this.reportsWeekly = this.reportsWeekly.bind(this);
    }
    reportsWeekly() {
        const { to, cc } = this.state;
        if(!to.length) {
            notification['error']({
                message: '收件人不能为空'
            });
            return;
        }
        var url = fh_service.fhSystemHost + 'api/sendmail';
        var data = JSON.stringify({ });
        data = this.getSendFormData(to, cc, document.querySelector('.fh-email-content'));
        var headers = new Headers({ 'X-FH-authtoken': fh_service.fhToken });
        this.setState({
            isSendLoading: true
        })
        fh_fetch.urlPost(url, data, headers).then(data => {
            if(data.code === 1) {
                notification['success']({
                    message: '发送成功！'
                });
            } else {
                notification['error']({
                    message: data.msg || '发送失败！'
                });
            }
            this.setState({
                isSendLoading: false
            })
        });
    }
    getSendFormData(to, cc, tableContainer) {
        var content = document.createElement('div'); // content
        var tables = tableContainer.querySelectorAll('table');
        var titles = tableContainer.querySelectorAll('h2');

        tables.forEach((table, i) => {
            var title = document.createElement('h2');
            title.innerHTML = titles[i].innerHTML;
            title.setAttribute('style', titles[i].getAttribute('style'));
            content.appendChild(title);
            content.appendChild(this.reSimpleOf(table))
        });
        // 剔除多于项
        var controls = content.querySelectorAll('.fh-reports-control-spans');
        controls.forEach(control => control.parentElement.removeChild(control));

        var formdata = new FormData();
        formdata.append('to', to.join(';'));
        formdata.append('cc', cc.join(';'));
        formdata.append('content', content.innerHTML);
        return formdata;
    }
    reSimpleOf(table) {
        var newTable = document.createElement('table'); // 复制table
        newTable.innerHTML = table.innerHTML; // table内容
        var newTableStyle = 'background-color: #000000; width: 100%;';
        var newTableTd = 'height: 32px; padding: 5px; line-height: 1.5;';
        newTable.setAttribute('cellspacing', 1);
        newTable.setAttribute('style', newTableStyle);
        newTable.querySelectorAll('td').forEach(td => {
            td.setAttribute('style', 'background-color: #ffffff;' + newTableTd);
        });
        newTable.querySelectorAll('th').forEach(th => {
            th.setAttribute('style', 'background-color: #f7f7f7;' + newTableTd);
        });
        return newTable;
    }
    sendEmailTo(value) {
        this.setState({
            to: value
        })
    }
    sendEmailCc(value) {
        this.setState({
            cc: value
        })
    }
    render() {
        return (
            <Layout>
                <PageHeader title={<span><Icon type="mail" /><span>周报</span></span>}>
                    <div className="reports-weekly-send">
                        <Button loading={this.state.isSendLoading} onClick={this.reportsWeekly}>发送</Button>
                    </div>
                </PageHeader>
                <Content>
                    <div className="fh-email-title">
                        <SendInput inputName="收件人: " className="fh-email-send-to" onGetEmails={this.sendEmailTo} />
                        <SendInput inputName="抄送: " className="fh-email-send-cc" defaultValue="jishubu@fh21.com" onGetEmails={this.sendEmailCc} />
                    </div>
                    <div className="fh-email-content">
                        <div>
                            <h2 style={{width: '100%', textAlign: 'center'}}>本周工作</h2>
                            <EditableTable className="fh-weekly-email" />
                        </div>
                        <div>
                            <h2 style={{width: '100%', textAlign: 'center'}}>下周计划</h2>
                            <EditableTable className="fh-weekly-email" />
                        </div>
                    </div>
                    
                </Content>
            </Layout>
        )
    }
}

export default WeeklyReports;