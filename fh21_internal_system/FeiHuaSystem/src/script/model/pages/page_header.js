import React from 'react';
import { Layout, Row, Col } from 'antd';

const { Header} = Layout;
class PageHeader extends React.Component {

    render() {
        const { title, children } = this.props;
        return(
            <Header className="page-header">
            <Row>
                <Col span={4}>
                    {title}
                </Col>
                <Col span={20}>
                    {children}
                </Col>
            </Row>
            </Header>
        )
    }
}

export default PageHeader;