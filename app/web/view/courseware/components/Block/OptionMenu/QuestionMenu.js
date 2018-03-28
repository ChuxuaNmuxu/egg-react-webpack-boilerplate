import React, {Component} from 'react';
import OptionMenu from './OptionMenu';
import { Menu } from 'antd';

class QuestionMenu extends Component {
    render () {
        return (
            <OptionMenu {...this.props}>
                <Menu.Item key='clear'>清除题目属性</Menu.Item>
            </OptionMenu>
        )
    }
}

export default QuestionMenu;
