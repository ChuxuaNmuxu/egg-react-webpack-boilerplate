/**
 * 备课系统V1.3 重写工具栏和导航栏
 * 原工具栏和导航栏合并为一个组件
 * 侧滑菜单
 * 基本信息显示
 * 工具区
 * @author Ouyang
 * */
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Styles from './Header.scss';

class Header extends React.PureComponent {
    static displayName = 'HeaderComponent';

    static propTypes = {
        className: PropTypes.string,
        // 课件ID
        id: PropTypes.any,
        // 标题
        title: PropTypes.string,
        // 改变提示
        changeTip: PropTypes.string,
        // 工具栏
        toolsArea: PropTypes.array,
        // 操作栏
        operationArea: PropTypes.array,
        // 菜单按钮
        onMenuClick: PropTypes.func
    };

    static defaultProps = {
        title: '未命名标题',
        changeTip: '未命名修改操作',
        toolsArea: [],
        operationArea: []
    };

    constructor (props) {
        super(props);
        this.state = {};
    }

    // 创建工具栏区域
    createToolsArea = (values = []) => {
        const elements = values.filter(item => React.isValidElement(item));
        return elements.map(item => React.cloneElement(item));
    }

    // 处理MenuIcon 点击事件
    handleMenuClick = (event) => {
        const { onMenuClick, id } = this.props;
        onMenuClick && onMenuClick({event: event, id: id});
    }

    render () {
        const {
          title,
          changeTip,
          toolsArea,
          operationArea
        } = this.props;
        const wrapProps = {
            styleName: 'nav-header',
            className: 'nav-header'
        };
        const toolsAreaElement = this.createToolsArea(toolsArea);
        const operationAreaElement = this.createToolsArea(operationArea);
        return (
            <div {...wrapProps}>
                <div className='info-wrap'>
                    <div className='info-menu-wrap' onClick={this.handleMenuClick}>
                        <i className='icon-caidan iconfont caidan-size' />
                    </div>
                    <div className='info-title-wrap'>
                        <label className='info-title'>{title}</label>
                    </div>
                    <div className='info-change-wrap'>
                        <label className='info-change'>{changeTip}</label>
                    </div>
                </div>
                <div className='tools-area-wrap'>
                    <div className='tools-area clearfix'>{toolsAreaElement}</div>
                </div>
                <div className='operation-area-wrap'>
                    <div className='operation--area clearfix'>{operationAreaElement}</div>
                </div>
            </div>
        );
    }
}

export default CSSModules(Header, Styles);
