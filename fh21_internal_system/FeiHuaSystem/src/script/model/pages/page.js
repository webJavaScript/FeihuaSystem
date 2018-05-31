import React from 'react';
import Kaoqin from './kaoqin/kaoqin';
import AllUser from './users/all';
import AddUser from './users/add';
import SetPassword from './password/setpwd';
import Dinner from './dinner/dinner';
import WeeklyReports from './reports/weekly';
import fh_run from '../../fh_run';

import '../../../style/model/pages/pages.css';

class Pages extends React.Component {
    state = {
        currentPage: <Kaoqin />,
        queryUserName: ''
    }
    getPageOfNavType = navType => {
        console.log('pages/page.js: ', fh_run.userInfo);
        switch(navType) {
            case 'kaoqin': {
                return <Kaoqin queryOtherName={this.state.queryUserName} />
            }
            case 'alluser': {
                return <AllUser />
            }
            case 'adduser': {
                return <AddUser />
            }
            case 'setpassword': {
                return <SetPassword />
            }
            case 'dinner': {
                return <Dinner />
            }
            case 'weeklyreports': {
                return <WeeklyReports />
            }
            default: {
                return navType;
            }
        }
    }
    render() {
        console.log('Pages: ', this.props);
        return(
            <div className={`fh-page fh-page-${this.props.navKey}`}>
                {this.getPageOfNavType(this.props.navKey)}
            </div>
        )
    }
}

export default Pages;