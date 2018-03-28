import React from 'react';
import { Tabs } from 'antd';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import {findIndex, values, merge} from 'lodash';

import styles from './PropsBar.scss';
import BaseProps from './BaseProps';
import PropsType from './PropsType';
import PropsTab from './PropsTab';
import AnimationProps from './AnimationProps';
import {getTheBlock} from '../../../../reducers/courseware/helper';
import propsBarTabConfig from '../../config/propsBarTabConfig';
import FlexBtn from '../Bottons/FlexBtn';

class PropsBar extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            type: 'slide',
            PropsComponent: PropsType.slide.component,
            tab: '卡片',
            activeKey: '.$1',
            tabConfig: propsBarTabConfig.slide
        }

        this.handleChange = this.handleChange.bind(this);
        this.layoutChange = this.layoutChange.bind(this);
    }

    handleChange (activeKey) {
        this.setState({
            activeKey
        })
    }

    handleReselectBlock (preBlocks, curBlocks) {
        const preIds = preBlocks.map(block => block.get('blockId'));
        const curIds = curBlocks.map(block => block.get('blockId'));
        return curIds.equals(preIds)
    }

    hasChangeQuestionProps (preCourseware, isQuestion) {
        if (isQuestion && preCourseware.getIn(['current', 'blocks']).size === 1) {
            const block = getTheBlock(preCourseware);
            const isQuestionPre = block.get('isQuestion');
            return !isQuestionPre && isQuestion;
        }
    }

    componentWillReceiveProps (nextProps) {
        const preCourseware = this.props.courseware;
        const {courseware} = nextProps;

        const blocks = courseware.getIn(['current', 'blocks']);
        let type = 'slide';
        let isMember = false; // 是否是组合习题的内部元素member
        let hasQuestioned = false; // 是否转换成了习题
        if (blocks.size === 1) {
            const block = getTheBlock(courseware); // 选中的block数据
            if (!block) return;
            const groupIndex = blocks.getIn([0, 'groupIndex']);
            hasQuestioned = this.hasChangeQuestionProps(preCourseware, block.get('isQuestion'));
            type = block.get('isQuestion') ? 'question' : block.get('type');
            isMember = typeof groupIndex === 'number';
        } else if (blocks.size > 1) {
            type = 'group';
        }

        let tabConfig = propsBarTabConfig[type];
        if (isMember) {
            tabConfig = merge({}, tabConfig, {
                animation: false
            })
        }

        // 选择了其他的元素或者转换习题时将属性栏默认到第一个tab
        if (!this.handleReselectBlock(preCourseware.getIn(['current', 'blocks']), blocks) || hasQuestioned) {
            const tabIndex = findIndex(values(tabConfig), value => value) + 1;
            this.setState({
                activeKey: `.$${tabIndex}`
            })
        }
        const {text, component} = PropsType[type];
        this.setState({
            type,
            PropsComponent: component,
            tab: text,
            tabConfig
        })
    }

    layoutChange (state) {
        this.props.layoutChange({
            rightBar: `right-${state}`
        })
    }

    render () {
        const PropsComponent = this.state.PropsComponent;
        const {tabConfig: {individuality, base, animation}} = this.state;
        const {dispatch, courseware} = this.props;
        return (
            <div className='props-bar' styleName='props-bar'>
                <FlexBtn dir='right' onChange={this.layoutChange} />
                <Tabs defaultActiveKey='.$1' type='card' onChange={this.handleChange} activeKey={this.state.activeKey}>
                    {
                        individuality
                        ? <Tabs.TabPane tab={this.state.tab} key='1'>
                            <PropsTab type={this.state.type} courseware={courseware} dispatch={dispatch}>
                                <PropsComponent dispatch={dispatch} />
                            </PropsTab>
                        </Tabs.TabPane> : null
                    }
                    {
                        base
                        ? <Tabs.TabPane tab='基本' key='2'>
                            <PropsTab type='base' courseware={courseware} dispatch={dispatch}>
                                <BaseProps />
                            </PropsTab>
                        </Tabs.TabPane> : null
                    }
                    {
                        animation
                        ? <Tabs.TabPane tab='动画' key='3'>
                            <PropsTab type='base' courseware={courseware} dispatch={dispatch}>
                                <AnimationProps type={this.state.type} courseware={courseware} dispatch={dispatch} />
                            </PropsTab>
                        </Tabs.TabPane> : null
                    }
                </Tabs>
            </div>
        )
    }
}

PropsBar.propTypes = {
    courseware: PropTypes.object,
    dispatch: PropTypes.func,
    layoutChange: PropTypes.func
}

export default CSSModules(PropsBar, styles);
