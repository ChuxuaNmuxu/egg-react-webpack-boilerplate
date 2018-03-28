import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

class OptionMenu extends Component {
    render () {
        return (
            <Menu onClick={this.props.handleClickDropdown}>
                {this.props.children}
                <Menu.Divider />
                <Menu.Item key='copy'>复制</Menu.Item>
                <Menu.SubMenu title='层级'>
                    <Menu.Item key='zIndexUp'>上移一层</Menu.Item>
                    <Menu.Item key='zIndexDown'>下移一层</Menu.Item>
                    <Menu.Item key='zIndexTop'>置于顶层</Menu.Item>
                    <Menu.Item key='zIndexBottom'>置于底层</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu title='旋转'>
                    <Menu.Item key='90deg'>90度</Menu.Item>
                    <Menu.Item key='180deg'>180度</Menu.Item>
                    <Menu.Item key='270deg'>270度</Menu.Item>
                </Menu.SubMenu>
                <Menu.Divider />
                <Menu.Item key='delete'>删除</Menu.Item>
            </Menu>
        )
    }
}

OptionMenu.propTypes = {
    children: PropTypes.any,
    handleClickDropdown: PropTypes.func
}

export default OptionMenu;
