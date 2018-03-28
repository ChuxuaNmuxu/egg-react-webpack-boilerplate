import React, {Component} from 'react';
import OptionMenu from './OptionMenu';
import { Menu } from 'antd';

class ImageMenu extends Component {
    render () {
        return (
            <OptionMenu {...this.props}>
                <Menu.Item key='crop'>分割图片</Menu.Item>
                <Menu.Divider />
                <Menu.Item key='question'>转换成题目</Menu.Item>
            </OptionMenu>
        )
    }
}

export default ImageMenu;
