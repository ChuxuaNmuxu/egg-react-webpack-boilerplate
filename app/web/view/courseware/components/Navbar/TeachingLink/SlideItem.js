// import React, { PropTypes } from 'react';
import React from 'react';
import PropTypes from 'prop-types'
import {findDOMNode} from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import {flow} from 'lodash';
import { connect } from 'react-redux';
import {Menu} from 'antd';
import Reveal from 'reveal.js';
// let reveal = {};

import {onContextMenu, hideContextMenu} from '../../../../../components/ContextMenu';
import {
    handleCopySlide,
    slideTo,
    deleteSlide,
    moveSlide
} from '../../../../../actions/courseware';
import Block from '../../PlainBlock';
import {EMPTY_SLIDE_THUMNAIL} from '../../../config/constant';

const slideSource = {
    beginDrag (props, monitor) {
        return {
            linkIndex: props.linkIndex,
            slideIndex: props.slideIndex,
            data: props.data
        };
    },
    endDrag (props, monitor, component) {
        props.changeState(false);
        if (monitor.didDrop() && monitor.getDropResult().move) {
            props.moveSlide(monitor.getDropResult().params);
        }
    },
    canDrag (props, monitor) {
        return props.canDrag;
    }
};

const slideTarget = {
    drop (props, monitor, component) {
        props.changeState(false);

        const dragSlide = monitor.getItem();
        const dragId = dragSlide.data.get('id');
        const hoverId = props.data.get('id');
        // const dragIndex = dragSlide.slideIndex;
        const dropIndex = props.slideIndex;

        if (dragId === hoverId) {
            return;
        }

        // 移动超过一半才进行交换
        // 获取边框
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // 获取垂直中点
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // 获取鼠标位置
        const clientOffset = monitor.getClientOffset();

        // 获取鼠标位置距顶点距离
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // // 往下拖
        // if (dragIndex < dropIndex && hoverClientY < hoverMiddleY) {
        //     return;
        // }

        // // 往上拖
        // if (dragIndex > dropIndex && hoverClientY > hoverMiddleY) {
        //     return;
        // }

        // 方向
        let part = hoverClientY > hoverMiddleY ? 'bottom' : 'top';
        monitor.getItem().slideIndex = dropIndex;
        return {move: true, params: {part, sourceId: dragId, targetId: hoverId}}
    }
};

class SlideItem extends React.Component {
    constructor (props) {
        super(props);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.handleContextMenuClick = this.handleContextMenuClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.settingClick = this.settingClick.bind(this);
        this.slideStyle = this.slideStyle.bind(this);
    }

    onContextMenu (e) {
        const {menu} = this.props;
        onContextMenu(e, (
            <Menu theme='dark' onClick={this.handleContextMenuClick}>
                <Menu.Item key='copy'>复制卡片</Menu.Item>
                <Menu.Item key='moveUp' disabled={menu.moveUp.disabled}>向上移动卡片</Menu.Item>
                <Menu.Item key='moveDown' disabled={menu.moveDown.disabled}>向下移动卡片</Menu.Item>
                <Menu.Divider />
                <Menu.Item key='delete' disabled={!menu.deletable}>删除卡片</Menu.Item>
            </Menu>
        ));
    }

    handleContextMenuClick (e) {
        hideContextMenu();

        const {deleteSlide, copySlide, moveUp, moveDown, data} = this.props;
        const id = data.get('id');
        switch (e.key) {
        case 'copy':
            copySlide(id);
            setTimeout(() => Reveal.sync(), 1)
            break;
        case 'delete':
            deleteSlide(id);
            setTimeout(() => Reveal.sync(), 1)
            break;
        case 'moveUp':
            moveUp(id);
            setTimeout(() => Reveal.sync(), 1)
            break;
        case 'moveDown':
            moveDown(id);
            setTimeout(() => Reveal.sync(), 1)
            break;
        default:
            console.log('default')
        }
    }

    handleClick () {
        const id = this.props.data.get('id');
        this.props.slideTo(id);
    }

    settingClick (e, slideIndex) {
        e.preventDefault();
        e.stopPropagation();
        const id = this.props.data.get('id');
        this.props.slideTo(id);
        this.onContextMenu(e, slideIndex)
    }

    slideStyle () {
        const {data} = this.props;
        const color = data.getIn(['props', 'background', 'color']);
        let image = data.getIn(['props', 'background', 'image']);
        if (!color && !image) {
            image = EMPTY_SLIDE_THUMNAIL;
        }
        const backgroundImage = `url(${image})`;
        return {
            backgroundColor: color,
            backgroundImage,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            backgroundPosition: 'left center',
            width: '1120px',
            height: '630px',
            transform: 'scale(0.2)',
            transformOrigin: '0 0'
        }
    }

    // componentDidMount () {
    //     Reveal = require('reveal.js').default;
    // }

    render () {
        const { isDragging, connectDragSource, connectDropTarget } = this.props;
        const { slideIndex, data, courseware } = this.props;
        const opacity = isDragging ? 0 : 1;
        return connectDragSource(connectDropTarget(
            <li style={{ opacity }} className={'wrap-item-thumbnail' + (slideIndex === courseware.getIn(['current', 'slideIndex']) ? ' slide-hoverd' : '')}>
                <div className='slide-index' >{slideIndex + 1}</div>
                <div
                  className={'wrap-page-thumbnail'}
                  onMouseDown={() => this.props.changeState(true)}
                  onMouseUp={() => this.props.changeState(false)}
                  onClick={this.handleClick}
                  onContextMenu={e => this.onContextMenu(e, slideIndex)}
                  >
                    <div
                      className='page-thumbnail'
                      style={{background: `url(${data.get('thumnail')}) no-repeat left center / 100% 100%`}}>
                        {/* {data.get('thumnail') ? <img src={data.get('thumnail')} /> : '缩略图' + data.get('id')} */}
                        <div className='thumnail' style={this.slideStyle()}>
                            {
                                data.get('blocks').map(block => {
                                    const style = {
                                        left: block.getIn(['props', 'position', 'left']),
                                        top: block.getIn(['props', 'position', 'top']),
                                        position: 'absolute'
                                    }
                                    return <div style={style} key={block.get('id')}>
                                        <Block block={block} />
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className='set-display-none' onClick={e => this.onContextMenu(e, slideIndex)} onContextMenu={e => this.onContextMenu(e, slideIndex)}>
                        <i className='iconfont icon-shezhi' />
                    </div>
                </div>
                <div className='wrap-page-title'>
                    第 {slideIndex + 1} 页
                </div>
            </li>
        ))
    }
}

SlideItem.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    moveSlide: PropTypes.func.isRequired,
    linkIndex: PropTypes.number.isRequired,
    slideIndex: PropTypes.number.isRequired,
    data: PropTypes.object,
    changeState: PropTypes.func.isRequired,
    menu: PropTypes.object,
    slideTo: PropTypes.func,
    deleteSlide: PropTypes.func,
    moveUp: PropTypes.func,
    moveDown: PropTypes.func,
    courseware: PropTypes.object,
    copySlide: PropTypes.func
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const {data} = ownProps;
    const id = data.get('id');
    return {
        copySlide: (id) => {
            dispatch(handleCopySlide(id))
        },
        slideTo: () => {
            dispatch(slideTo(id))
        },
        deleteSlide: () => {
            dispatch(deleteSlide(id))
        },
        moveUp: () => {
            dispatch(moveSlide({direction: 'up', sourceId: id}));
        },
        moveDown: () => {
            dispatch(moveSlide({direction: 'down', sourceId: id}));
        }
    }
}

const mapStateToProps = (state) => {
    const courseware = state.courseware.present;
    return {
        courseware
    }
}

export default flow(
    DropTarget('slide', slideTarget, connect => ({
        connectDropTarget: connect.dropTarget()
    })),
    DragSource('slide', slideSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }))
)(connect(mapStateToProps, mapDispatchToProps)(SlideItem));
