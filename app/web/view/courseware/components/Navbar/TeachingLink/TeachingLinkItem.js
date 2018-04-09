// import React, { PropTypes } from 'react';
import React from 'react';
import PropTypes from 'prop-types'
import {findDOMNode} from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import {flow} from 'lodash';
import {Menu, Card} from 'antd';
import { connect } from 'react-redux';
import Reveal from 'reveal.js';
// let reveal = {}
import nzhcn from 'nzh/cn';
import {Map} from 'immutable'

import {onContextMenu, hideContextMenu} from '../../../../../components/ContextMenu';
import SlideItem from './SlideItem';
import TitleBtn from '../../../../../components/Title'
import {
    moveSlide,
    deleteTeachingLink,
    exchangeLink,
    changeTeachingLinkTitle,
    copyTeachingLink
} from '../../../../../actions/courseware';

const linkSource = {
    beginDrag (props, monitor) {
        return {
            linkIndex: props.linkIndex,
            itemType: monitor.getItemType()
        };
    },

    canDrag (props, monitor) {
        return props.canDrag;
    },

    endDrag (props, monitor, component) {
        props.changeState(false);

        if (monitor.didDrop() && monitor.getDropResult().move) {
            props.exchangeLink(...monitor.getDropResult().params);
        }
    }
};

const linkTarget = {
    drop (props, monitor, component) {
        props.changeState(false);
        const dragIndex = monitor.getItem().linkIndex;
        const dropIndex = props.linkIndex;

        if (dragIndex === dropIndex) {
            return;
        }

        if (monitor.getItemType() === 'slide') {
            props.moveSlideToLink(monitor.getItem(), dropIndex);
        } else {
            // 移动超过一半才进行交换
            // 获取边框
            const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

            // 获取垂直中点
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // 获取鼠标位置
            const clientOffset = monitor.getClientOffset();

            // 获取鼠标位置距顶点距离
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // 往下拖
            if (dragIndex < dropIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // 往上拖
            if (dragIndex > dropIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            monitor.getItem().linkIndex = dropIndex;
            return {move: true, params: [dragIndex, dropIndex]}
        }
    }
};

class TeachingLinkItem extends React.Component {
    constructor (props) {
        super(props);
        const {isNewAdd} = props;

        this.state = {
            isNewAdd: isNewAdd || false,
            triggle: false,
            slideCanDrag: false
        }

        this.onContextMenu = this.onContextMenu.bind(this);
        this.handleContextMenuClick = this.handleContextMenuClick.bind(this);
        this.changeState = this.changeState.bind(this);
        this.moveSlide = this.moveSlide.bind(this);
        this.handleTitleBlur = this.handleTitleBlur.bind(this);
        this.renameTeachingLink = this.renameTeachingLink.bind(this);
    }

    onContextMenu (e) {
        const {menu} = this.props;
        onContextMenu(e, (
            <Menu theme='dark' onClick={this.handleContextMenuClick}>
                <Menu.Item key='rename'>重命名</Menu.Item>
                <Menu.Item key='copy'>复制</Menu.Item>
                <Menu.Item key='moveUp' disabled={menu.moveUp.disabled}>向上移动环节</Menu.Item>
                <Menu.Item key='moveDown' disabled={menu.moveDown.disabled}>向下移动环节</Menu.Item>
                <Menu.Item key='delete' disabled={!menu.deletable}>仅删除环节</Menu.Item>
                <Menu.Item key='deleteR' disabled={!menu.deletable}>删除环节及卡片</Menu.Item>
            </Menu>
        ))
    }

    handleContextMenuClick (e) {
        hideContextMenu();

        const {linkIndex, copyTeachingLink, deleteTeachingLink, moveUp, moveDown} = this.props;
        switch (e.key) {
        case 'rename':
            this.renameTeachingLink();
            break;
        case 'copy':
            copyTeachingLink(linkIndex);
            setTimeout(() => Reveal.sync(), 1)
            break;
        case 'delete':
            deleteTeachingLink(linkIndex);
            setTimeout(() => Reveal.sync(), 1)
            break;
        case 'deleteR':
            deleteTeachingLink(linkIndex, true);
            setTimeout(() => Reveal.sync(), 1)
            break;
        case 'moveUp':
            moveUp(linkIndex);
            setTimeout(() => Reveal.sync(), 1)
            break;
        case 'moveDown':
            moveDown(linkIndex);
            setTimeout(() => Reveal.sync(), 1)
            break;
        default:
            console.log('default')
        }
    }

    renameTeachingLink () {
        this.setState({
            triggle: !this.state.triggle
        })
    }

    moveSlide (options) {
        const {moveSlide} = this.props;
        moveSlide && moveSlide(options);
        Reveal.sync();
    }

    changeState (e) {
        if (e.type === 'mousedown') {
            this.props.changeState(true)
        } else {
            this.props.changeState(false)
        }
    }

    handleTitleBlur (title) {
        const {dispatch, data} = this.props;
        this.setState({
            isNewAdd: false
        })
        dispatch(changeTeachingLinkTitle(Map({
            id: data.get('id'),
            title: title
        })))
    }

    onFocus () {
        document.querySelector('.headerInput').select();
    }

    // componentDidMount () {
    //     Reveal = require('reveal.js').default;
    // }

    render () {
        const { isDragging, connectDragSource, connectDropTarget } = this.props;
        const { linkIndex, data, teachingLinks, slides } = this.props;
        const {isNewAdd, triggle} = this.state;
        const opacity = isDragging ? 0 : 1;
        const title = data.get('title')
        const placeholder = `环节${nzhcn.encodeS(linkIndex + 1)}`;
        const linkHead =
            <div className='link-title'
              onMouseDown={this.changeState}
              onMouseUp={this.changeState}
              onContextMenu={e => this.onContextMenu(e)}>
                <TitleBtn
                  editTitle={isNewAdd}
                  title={title}
                  handleTitleBlur={this.handleTitleBlur}
                  triggle={triggle}
                  style={{width: '140px', border: 'none'}}
                  placeholder={placeholder}
                  onFocus={this.onFocus}
                />
            </div>;
        return connectDragSource(connectDropTarget(
            <li style={{ opacity }}>
                <Card title={linkHead} extra={<i className='iconfont icon-shezhi' type='tool' onClick={this.onContextMenu} />}>
                    <ul className='slide-list'>
                        {
                            slides.map((slide, slideIndex) => {
                                if (data.get('slides').indexOf(slide.get('id')) > -1) {
                                    return <SlideItem
                                      key={slideIndex}
                                      data={slide}
                                      menu={{
                                          deletable: slides.size > 1,
                                          moveUp: {
                                              disabled: (slideIndex <= 0) && (linkIndex <= 0)
                                          },
                                          moveDown: {
                                              disabled: (slideIndex >= slides.size - 1) && (linkIndex >= teachingLinks.size - 1)
                                          }
                                      }}
                                      slideIndex={slideIndex}
                                      linkIndex={linkIndex}
                                      moveSlide={this.moveSlide}
                                      canDrag={this.state.slideCanDrag}
                                      changeState={canDrag => this.setState({slideCanDrag: canDrag})} />
                                }
                            })
                        }
                    </ul>
                </Card>
            </li>
        ))
    }
}

TeachingLinkItem.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    teachingLinks: PropTypes.object,
    slides: PropTypes.object,
    linkIndex: PropTypes.number.isRequired,
    data: PropTypes.object,
    changeState: PropTypes.func.isRequired,
    menu: PropTypes.object,
    exchangeLink: PropTypes.func.isRequired,
    moveSlideToLink: PropTypes.func.isRequired,
    deleteTeachingLink: PropTypes.func,
    moveUp: PropTypes.func,
    moveDown: PropTypes.func,
    moveSlide: PropTypes.func,
    isNewAdd: PropTypes.bool,
    dispatch: PropTypes.func,
    copyTeachingLink: PropTypes.func
}

const mapStateToProps = (state, ownProps) => {
    const ppt = state.courseware.present.get('ppt');
    return {
        teachingLinks: ppt.get('teachingLinks'),
        slides: ppt.get('slides')
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const {linkIndex} = ownProps;
    return {
        deleteTeachingLink: (linkIndex, includeChildren = false) => {
            dispatch(deleteTeachingLink(linkIndex, includeChildren))
        },
        moveUp: () => {
            dispatch(exchangeLink(linkIndex, linkIndex - 1))
        },
        moveDown: () => {
            dispatch(exchangeLink(linkIndex, linkIndex + 1))
        },
        moveSlide: (options) => {
            dispatch(moveSlide(options))
        },
        copyTeachingLink: (linkIndex) => {
            dispatch(copyTeachingLink(linkIndex))
        }
    }
}

export default flow(
    DropTarget(['link', 'slide'], linkTarget, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget()
    })),
    DragSource('link', linkSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }))
)(connect(mapStateToProps, mapDispatchToProps)(TeachingLinkItem));
