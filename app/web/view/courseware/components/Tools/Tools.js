import React from 'react';
// import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Reveal from 'reveal.js';
// let reveal = {}
import { Icon } from 'antd';
import CSSModules from 'react-css-modules';
import styles from './tools.scss';
import FlexBtn from '../Bottons/FlexBtn';

import Text from './Text';
import Shape from './Shape';
// import Table from './Table';
import Image from './Image';

class PPTTools extends React.PureComponent {
    constructor (props) {
        super(props);

        this.layoutChange = this.layoutChange.bind(this);
    }

    // 工具栏滑动隐藏
    layoutChange (state) {
        this.props.layoutChange({
            header: `header-${state}`
        })
    }

    // componentDidMount () {
    //     Reveal = require('reveal.js').default;
    // }

    render () {
        const {
            dispatch,
            ActionCreators, past,
            future, controlRevealScale
        } = this.props;
        return (
            <div styleName='ppt-toolBar' className='ppt-toolBar'>
                <div className='ppt-tools'>
                    <Icon type='ellipsis' style={{fontSize: 25, transform: 'rotate(90deg)'}} className='threePoint' />
                    <Text />
                    <Shape />
                    {/* <Table /> */}
                    <Image />
                    <div className='ppt-tools-div4'>
                        <div
                          className={past.length > 1 ? 'ppt-tools-div4-div1' : 'ppt-tools-div4-div1-noPast'}
                          data-type='back'
                          onClick={() => {
                              if (past.length > 1) {
                                  dispatch(ActionCreators.undo());
                                  setTimeout(() => Reveal.sync(), 1);
                              }
                          }}
                    />
                        <div
                          className={future.length > 0 ? 'ppt-tools-div4-div2' : 'ppt-tools-div4-div2-noFuture'}
                          data-type='forward'
                          onClick={() => {
                              if (future.length > 0) {
                                  dispatch(ActionCreators.redo());
                                  setTimeout(() => Reveal.sync(), 1);
                              }
                          }}
                    />
                    </div>
                    <div className='ppt-tools-div3'>
                        <div className='ppt-tools-div3-div1' data-type='normal' onClick={() => controlRevealScale('init')}><i className='iconfont icon-100' /></div>
                        <div className='ppt-tools-div3-div2' data-type='magnify' onClick={() => controlRevealScale(0.02)}><i className='iconfont icon-fangda' /></div>
                        <div className='ppt-tools-div3-div3' data-type='shrink' onClick={() => controlRevealScale(-0.02)}><i className='iconfont icon-iconfontsuoxiao' /></div>
                    </div>
                    <FlexBtn
                      onChange={this.layoutChange}
                      contentClass='tool-flex-btn'
                      iconClass='icon-shouqi3'
                    />

                </div>
            </div>
        )
    }
}

PPTTools.propTypes = {
    dispatch: PropTypes.func,
    ppt: PropTypes.object,
    current: PropTypes.object,
    controlModalVisible: PropTypes.func,
    controlPictureVisible: PropTypes.func,
    ActionCreators: PropTypes.object,
    addBlock: PropTypes.func,
    controlTableVisible: PropTypes.func,
    past: PropTypes.array,
    future: PropTypes.array,
    controlRevealScale: PropTypes.func,
    style: PropTypes.object,
    layoutChange: PropTypes.func
}

export default CSSModules(PPTTools, styles);
