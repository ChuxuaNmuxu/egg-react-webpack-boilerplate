import React, {Component} from 'react';
import {Form, Input} from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

class AnimationDisplay extends Component {
    constructor (props) {
        super(props);

        this.state = {
            animationList: [],
            index: 0,
            effect: ''
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleSelectorAnimationEffect = this.handleSelectorAnimationEffect.bind(this);
        this.hiddenAnimationExhibition = this.hiddenAnimationExhibition.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleMouseEnter (e, index, list) {
        this.setState({
            index,
            animation: list.title
        })
    }

    // componentWillMount () {
    //     const {base} = PropsList;
    //     const {options} = base['animation.effect'];
    //     const {courseware} = this.props;
    //     const {blocks} = courseware.current;
    //     const {index} = blocks[0];
    //     const block = getBlocks(courseware, true)[index];
    //     const prop = block.props;
    //     const len = options.length;
    //     for (let i=0; i<len; i++) {
    //         if (options[i].title === prop.animation.effect) {
    //             this.setState({
    //                 effect: options[i].value
    //             })
    //             break;
    //         }
    //     }
    //     this.setState({
    //         animationList: options,

    //     })
    // }

    getListClassName (index) {
        return this.state.index === index ? 'type active' : 'type'
    }

    handleSelectorAnimationEffect (e) {
        this.setState({
            showAnimationExbition: true
        })
    }

    hiddenAnimationExhibition () {
        this.setState({
            showAnimationExbition: false
        })
    }

    handleClick (e, list) {
        this.props.handleClick(e, list);
        this.setState({
            showAnimationExbition: false
        })
    }

    handleClose () {
        this.setState({
            showAnimationExbition: false
        })
    }

    render () {
        return (
            <FormItem
              label='效果'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }} className='spaceUp'>
                <Input size='small' onFocus={this.handleSelectorAnimationEffect} value={this.props.effect} placeholder='无' />
                {
                            this.state.showAnimationExbition
                                ? <div className='effectWrap' style={this.props.style}>
                                    <div style={{position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px', zIndex: '-1'}} onClick={this.handleClose} />
                                    <ul className='typeList'>
                                        {
                                            this.props.animationList.map((list, index) => {
                                                return <li key={index} onMouseEnter={(e) => this.handleMouseEnter(e, index, list)} className={this.getListClassName(index)} onClick={(e) => this.handleClick(e, list)} >{list.value}</li>
                                            })
                                        }
                                    </ul>
                                    <div className='exhibition'>
                                        <div className={this.state.animation} />
                                    </div>
                                </div> : null
                        }
            </FormItem>
        )
    }
}

// const mapStateToProps = (state) => {
//     const courseware = state.courseware.present;
//     return {
//         courseware: fromJS(courseware)
//     }
// }

AnimationDisplay.propTypes = {
    form: PropTypes.object,
    type: PropTypes.string,
    handleClick: PropTypes.func,
    effect: PropTypes.string,
    style: PropTypes.object,
    animationList: PropTypes.array

}

export default AnimationDisplay;
