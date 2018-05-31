import React from 'react';
import { Cascader, Select, Radio } from 'antd';
import fh_fetch from '../utils/fh_fetch';
// import fh_run from '../fh_run';
import fh_service from '../service/service';

const RadioGroup = Radio.Group;
/**
 * 飞华部门机构
 */ 
class ChoiceDepartment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kaoqinji_department: [],
            value: props.value.split(',')
        }
        this.userDepartmentChange = this.userDepartmentChange.bind(this);
    }
    
    userDepartmentChange(value) {
        this.setState({
            add_department: value.slice(-1) || ''
        });
        if(this.props.onChange) {
            this.props.onChange(value)
        }
    }
    /**
     * 获取考勤机部门数据
     */ 
    getKaoqinjiDepartment() {
        var url = fh_service.fhSystemHost + 'api/department';
        fh_fetch.urlGet(url).then(data => {
            console.log('getUserDepartment: ', data);
            this.setState({
                kaoqinji_department: data,
                optionsCascader: !data ? [] : data.map(department => 
                    this.parseDepartmentList(department)
                )
            })
        })
    }
    parseDepartmentList(department) {
        department.value = department.id;
        department.label = department.title;
        !!department.children && department.children.forEach(kid => this.parseDepartmentList(kid));
        return department;
    }
    componentDidMount() {
        this.getKaoqinjiDepartment();
    }
    render() {
        const { optionsCascader, value } = this.state;
        return (
            <Cascader options={optionsCascader} className="user-department" defaultValue={value} onChange={this.userDepartmentChange} placeholder="选择部门" />
        )
    }
}
/**
 * 员工职位状态
 */
class ChoiceState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: parseFloat(props.value)
        }
        this.handlerChange = this.handlerChange.bind(this);
    }

    handlerChange(e) {
        var value = e.target.value;
        var title = e.target.title;
        this.setState({
            value,
            title
        });
        if(this.props.onChange) {
            this.props.onChange({value, title});
        }

    }

    componentDidUpdate() {
    }

    render() {
        var { value } = this.state;
        return(
            <RadioGroup onChange={this.handlerChange} value={value}>
                <Radio key={1} value={1} title='在职'>在职</Radio>
                <Radio key={2} value={2} title='离职'>离职</Radio>
            </RadioGroup>
        ) 
    }
}
/**
 * 员工考勤机姓名
 */ 
class ChoiceUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kaoqinji_users: [],
            value: props.value
        }
        this.userNameSelect = this.userNameSelect.bind(this);
    }
    /**
     * 获取考勤机用户数据 
     */ 
    getKaoqinjiUsers() {
        var url = fh_service.fhSystemHost + 'api/attusers';
        fh_fetch.urlGet(url).then(data => {
            console.log('考勤机员工列表: ', data.sort((a,b)=>a.id - b.id));
            this.setState({
                kaoqinji_users: data.sort((a,b)=>a.id - b.id)
            })
        })
    }

    userNameSelect(value) {
        var userName = value.split('-')[0];
        var userId = value.split('-')[1];

        this.setState({
            add_name: userName,
            add_uid: userId,
        });
        if(this.props.onChange) {
            this.props.onChange({ userName, userId });
        }
    }

    componentDidMount() {
        this.getKaoqinjiUsers();
    }

    componentDidUpdate() {
    }

    render(){
        var { value } = this.state;
        var selects = this.state.kaoqinji_users.map(user => 
            <Select.Option key={user.id} value={`${user.name}-${user.id}`}>
                {`${user.name}-${user.id}`}
            </Select.Option>
        )
        return(
            <Select
                placeholder="选择员工姓名"
                className="user-name"
                style={{width: '10em'}}
                onChange={this.userNameSelect}
                defaultValue={value}>
                {selects}
            </Select>
        )
    }

}
/**
 * 员工考勤机ID
 */ 
class ChoiceUid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kaoqinji_users: [],
            value: props.value
        }
        this.userNameSelect = this.userNameSelect.bind(this);
    }
    /**
     * 获取考勤机用户数据 
     */ 
    getKaoqinjiUsers() {
        var url = fh_service.fhSystemHost + 'api/attusers';
        fh_fetch.urlGet(url).then(data => {
            console.log('考勤机员工列表: ', data.sort((a,b)=>a.id - b.id));
            this.setState({
                kaoqinji_users: data.sort((a,b)=>a.id - b.id)
            })
        })
    }

    userNameSelect(value) {
        var userName = value.split('-')[0];
        var userId = value.split('-')[1];

        this.setState({
            add_name: userName,
            add_uid: userId,
        });
        if(this.props.onChange) {
            this.props.onChange({ userName, userId });
        }

    }

    componentDidMount() {
        this.getKaoqinjiUsers();
    }

    componentDidUpdate() {
    }

    render(){
        var { value } = this.state;
        var selects = this.state.kaoqinji_users.map(user => 
            <Select.Option key={user.id} value={`${user.name}-${user.id}`}>
                {`${user.name}-${user.id}`}
            </Select.Option>
        )
        return(
            <Select
                placeholder="选择员工考勤ID"
                className="user-name"
                style={{width: '10em'}}
                onChange={this.userNameSelect}
                defaultValue={value}>
                {selects}
            </Select>
        )
    }

}

export default {
    ChoiceDepartment,
    ChoiceUser,
    ChoiceUid,
    ChoiceState
}