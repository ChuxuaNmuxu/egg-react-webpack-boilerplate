import React from 'react';
import PropTypes from 'prop-types';
import {Scrollbars} from 'react-custom-scrollbars';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {flow} from 'lodash';
import { connect } from 'react-redux';
import Reveal from 'reveal.js';
// let reveal = {}

import TeachingLinkItem from './TeachingLinkItem';
import {
    exchangeLink,
    moveSlideToLink
} from '../../../../../actions/courseware';

class TeachingLinkList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            canDrag: false
        };

        this.exchangeLink = this.exchangeLink.bind(this);
        this.moveSlideToLink = this.moveSlideToLink.bind(this);
        this.changeState = this.changeState.bind(this);
    }

    /**
     * 交换教学环节
     * @param {*} dragIndex 拖动环节索引
     * @param {*} hoverIndex 鼠标悬浮环节索引
     */
    exchangeLink (dragIndex, hoverIndex) {
        this.props.dispatch(exchangeLink(dragIndex, hoverIndex));
        Reveal.sync();
    }

    /**
     * 移动卡片到教学环节中
     * @param {*} dragSlideProps 拖动卡片属性
     * @param {*} targetLnkIndex 目录环节索引
     */
    moveSlideToLink (dragSlideProps, targetLinkIndex) {
        this.props.dispatch(moveSlideToLink(dragSlideProps, targetLinkIndex));
        Reveal.sync();
    }

    /**
     * 改变状态：能否拖动
     * @param {*} linkIndex 环节索引
     * @param {*} canDrag 是否能拖动
     */
    changeState (canDrag) {
        this.setState({
            canDrag
        })
    }

    renderThumb ({ style, ...props }) {
        const thumbStyle = {
            // backgroundColor: '#4b5155',
            backgroundColor: 'currentColor',
            borderRadius: '3px'
        };
        return (
            <div
              style={{ ...style, ...thumbStyle }}
              {...props} />
        );
    }

    // componentDidMount () {
    //     Reveal = require('reveal.js').default;
    // }

    render () {
        const {teachingLinks, addTeachingLink, dispatch} = this.props;
        return (
            <Scrollbars
              renderThumbVertical={this.renderThumb}
              autoHide
              autoHideDuration={200}
              autoHideTimeout={1000}>
                <ul className='teaching-link-list'>
                    {teachingLinks.map((item, index) =>
                        <TeachingLinkItem
                          key={index}
                          data={item}
                          linkIndex={index}
                          menu={{
                              deletable: teachingLinks.size > 1,
                              moveUp: {
                                  disabled: index <= 0
                              },
                              moveDown: {
                                  disabled: index >= teachingLinks.size - 1
                              }
                          }}
                          exchangeLink={this.exchangeLink}
                          moveSlideToLink={this.moveSlideToLink}
                          canDrag={this.state.canDrag}
                          changeState={this.changeState}
                          isNewAdd={index === teachingLinks.size - 1 ? addTeachingLink : false}
                          dispatch={dispatch}
                        />
                    )}
                </ul>
            </Scrollbars>
        )
    }
}

TeachingLinkList.propTypes = {
    teachingLinks: PropTypes.object,
    dispatch: PropTypes.any,
    addTeachingLink: PropTypes.bool
}

const mapStateToProps = (state, ownProps) => {
    const teachingLinks = state.courseware.present.getIn(['ppt', 'teachingLinks']);
    return {
        teachingLinks
    }
}

export default flow(
    DragDropContext(HTML5Backend)
)(connect(mapStateToProps)(TeachingLinkList));
