import React from 'react';
import PropTypes from 'prop-types';
import TitleBtn from '../../../../components/Title';
// import { browserHistory } from 'react-router';
import { withRouter } from 'react-router'
import CSSModules from 'react-css-modules';

import config from '../../../../../config/config';
import styles from './Header.scss';
import ToolBtn from '../Bottons/ToolBtn';
import Setting from './Setting';
import {changeHeadTitle} from '../../../../actions/courseware';

class PPTHeader extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            autoSlide: false
        }
        this.quit = this.quit.bind(this);
        this.play = this.play.bind(this);
        this.handleTitleBlur = this.handleTitleBlur.bind(this);
    }

    // 改变标题
    handleTitleBlur (title) {
        const {dispatch, courseId} = this.props;
        dispatch(changeHeadTitle(title, courseId));
    }

    // 退出
    quit () {
        const {history} = this.props;
        this.props.quitPPT().then(res => history.push(config.urlResolve('/')));
    }

    // 播放
    play () {
        const {courseId, courseware} = this.props;
        const newTab = window.open(config.urlResolve(`/play/${courseId}`));

        window.CJWindow = 'onlinePPTEditor';
        // 传递数据给新窗口
        newTab.addEventListener('load', () => {
            newTab.postMessage({
                type: 'postCourseware',
                payload: courseware.toJS()
            }, window.location.origin);
        })
    }

    render () {
        const {title, timingToSavePPT, courseId} = this.props;
        return (
            <div styleName='ppt-header'>
                <div className='ppt-header-left'>
                    <div className='ppt-header-left-title'>
                        e采课件设计
                    </div>
                    <div className='ppt-header-left-saveInfo'>
                        { timingToSavePPT }
                    </div>
                </div>
                <div className='ppt-header-middle'>
                    <TitleBtn
                      title={title}
                      rules={[{ required: true, message: '必填' }, { whitespace: true, message: '内容不能只为空格' }, {max: 20, message: '标题长度请不要超过20个字符'}]}
                      handleTitleBlur={this.handleTitleBlur}
                      style={{width: '140px'}}
                    />
                </div>
                <div className='ppt-header-right'>
                    <ToolBtn
                      option={this.props.preview}
                      content='预览'
                      iconClass='icon-yulan'
                    />
                    <ToolBtn
                      option={this.play}
                      content='播放'
                      iconClass='icon-bofang1'
                    />
                    <ToolBtn
                      option={this.quit}
                      content='退出'
                      iconClass='icon-tuichu'
                      wrapClass='header-exit'
                    />
                    <Setting
                      courseId={courseId}
                    />
                </div>
            </div>
        )
    }
}

PPTHeader.propTypes = {
    courseware: PropTypes.object,
    dispatch: PropTypes.func,
    changeHeadTitle: PropTypes.func,
    controlRevealAutoSlide: PropTypes.func,
    timingToSavePPT: PropTypes.string,
    quitPPT: PropTypes.func,
    courseId: PropTypes.string,
    layoutChange: PropTypes.func,
    title: PropTypes.string,
    preview: PropTypes.func
}

export default CSSModules(withRouter(PPTHeader), styles);
