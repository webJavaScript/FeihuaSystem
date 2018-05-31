import React from 'react';
import {LocaleProvider} from 'antd';
import Login from '../../model/login/login';
import FhApp from '../../fh/shell/fhApp';
import fh_run from '../../fh_run';
import enUS from 'antd/lib/locale-provider/en_US'; // 国际化

class FhShell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogined: false
        }
        this.loginSystem = this.loginSystem.bind(this);
    }

    loginSystem(isLogged) {
        this.setState({
            isLogined: isLogged
        });
        if(!isLogged) {
            var token = localStorage.getItem('token');
            var user = JSON.parse(localStorage.getItem('userInfo'));
            if(!!token) {
                localStorage.setItem('token', '');
            }
            if(user && user.remember) {
                user.remember = false;
                localStorage.setItem('userInfo', JSON.stringify(user));
            }
        }
    }
    render() {
        const isLogined = this.state.isLogined;

        let shell = null
        if(isLogined) {
            shell = <FhApp onLoginSystem={this.loginSystem} userInfo={fh_run.userInfo} />;
        } else {
            shell = <Login onLoginSystem={this.loginSystem} />;
        }
        return(
            <LocaleProvider local={enUS}>
                <div className="fh-shell">
                    {shell}
                </div>
            </LocaleProvider>
        )
    }
}

export default FhShell;