import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import Reveal from 'reveal.js';
// let reveal = {}
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './TeachingLink.scss';
import TeachingLinkList from './TeachingLinkList';
import {
    addTeachingLink,
    addSlide
} from '../../../../../actions/courseware';

class TeachingLink extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            addTeachingLink: false
        }

        this.handleAddTeachingLink = this.handleAddTeachingLink.bind(this);
        this.handleAddSlide = this.handleAddSlide.bind(this);
    }

    /**
     * 添加环节
     */
    handleAddTeachingLink () {
        const {addTeachingLink} = this.props;
        addTeachingLink && addTeachingLink();
        this.setState({
            addTeachingLink: true // 最后一张卡片在初次加载时为可编辑状态
        }, () => {
            Reveal.sync()
        })
    }

    /**
     * 添加卡片
     */
    handleAddSlide () {
        const {addSlide} = this.props;
        addSlide && addSlide();
        setTimeout(() => {
            Reveal.sync();
        })
    }

    // componentDidMount () {
    //     Reveal = require('reveal.js').default;
    // }

    render () {
        return (
            <div className='teaching-link' styleName='teaching-link'>
                <div className='wrap-teaching-links' ref={(wrapPages) => { this.wrapPages = wrapPages }}>
                    <TeachingLinkList addTeachingLink={this.state.addTeachingLink} />
                </div>
                <div className='wrap-operators'>
                    <Button size='large' className='btn-add' onClick={this.handleAddTeachingLink} icon='plus'>添加环节</Button>
                    <Button size='large' className='btn-add' onClick={this.handleAddSlide} icon='plus'>添加卡片</Button>
                </div>
            </div>
        )
    }
}

TeachingLink.propTypes = {
    addTeachingLink: PropTypes.func,
    addSlide: PropTypes.func
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addTeachingLink: () => {
            dispatch(addTeachingLink())
        },

        addSlide: () => {
            dispatch(addSlide())
        }
    }
}

export default connect(null, mapDispatchToProps)(CSSModules(TeachingLink, styles));
