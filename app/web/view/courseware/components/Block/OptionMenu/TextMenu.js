import React, {Component} from 'react';
import OptionMenu from './OptionMenu';
import { Menu } from 'antd';

class TextMenu extends Component {
    render () {
        return (
            <OptionMenu {...this.props}>
                <Menu.Item key='question'>转换成题目</Menu.Item>
            </OptionMenu>
        )
    }
}

export default TextMenu;
