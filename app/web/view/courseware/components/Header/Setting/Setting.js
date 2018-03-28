import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './setting.scss';
import ToolBtn from '../../Bottons/ToolBtn';
import SettingModel from './SettingModel';

class Setting extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            visible: false
        }

        this.handleVisible = this.handleVisible.bind(this);
    }

    handleVisible () {
        this.setState({
            visible: !this.state.visible
        })
    }

    render () {
        return <div styleName='ppt-setting' className='ppt-setting'>
            <ToolBtn
              option={this.handleVisible}
              content='设置'
              iconClass='icon-shezhi1'
              wrapClass='header-setting'
            />
            {
                this.state.visible ? <SettingModel
                  handleVisible={this.handleVisible}
                  courseId={this.props.courseId}
                /> : null
            }
        </div>
    }
}

Setting.propTypes = {
    courseId: PropTypes.string
}

export default CSSModules(Setting, styles);
