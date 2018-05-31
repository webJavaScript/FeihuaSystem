import React from 'react';
import {Layout} from 'antd';
import FhHeader from '../../model/titleBar/titleBar';
import Navigator from '../../model/navigator/navigator';
import Pages from '../../model/pages/page';
import '../../../style/fh/shell/shell.css';

const {Sider, Content} = Layout;
class FhApp extends React.Component {
    state = {
        navKey: 'kaoqin'
    }
    navigatorTo = (param) => {
        this.setState({
            navKey: param
        })
    }
    loginSystem = (isLogged) => {
        this.props.onLoginSystem(isLogged);
    }
    render() {
        return(
            <div className="fh-content-layout">
                <FhHeader onLoginSystem={this.loginSystem} userInfo={this.props.userInfo} />
                <Layout>
                    <Sider width={240}>
                        <Navigator onNavigatorTo={this.navigatorTo} />
                    </Sider>
                    <Content style={{overflowX: 'auto'}}>
                        <Pages navKey={this.state.navKey} />
                    </Content>
                </Layout>
            </div>
        )
    }
}

export default FhApp;