import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import {
    Input, Form, Tooltip
} from 'antd';
import styles from './Title.scss'
const FormItem = Form.Item;

class TitleBtn extends React.Component {
    constructor (props) {
        super(props);
        const {editTitle} = props;

        this.state = {
            editTitle: editTitle || false,
            textAlign: 'center'
        }
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.controlEditTitle = this.controlEditTitle.bind(this);
    }

    controlEditTitle (bol) {
        this.setState({
            editTitle: !this.state.editTitle
        });
    }

    onFocus () {
        //
    }

    onBlur (e) {
        e.preventDefault();
        const {form: { validateFields }, handleTitleBlur} = this.props;
        validateFields(['title'], (err, values) => {
        // console.log(err);
        // 因为第一次进来自动onfocus，触发setFieldsValue赋值，这边的err只需要考虑是否空格即可
            const { title } = values;
            if (!err) {
                handleTitleBlur(title)
            }
        });
        this.controlEditTitle();
    }

    onMouseDown (e) {
        e.stopPropagation();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.triggle !== nextProps.triggle) {
            this.controlEditTitle();
        }
    }

    render () {
        const {
            title = '',
            form: { getFieldDecorator },
            rules = [{}],
            style = {},
            placeholder = ''
        } = this.props
        const {editTitle} = this.state;
        const onFocus = this.props.onFocus || this.onFocus
        return (
            <div styleName='courseware-title'>
                <Form>
                    <FormItem>
                        {
                            editTitle
                            ? <div className='lh1'>
                                {
                                getFieldDecorator('title', {
                                    rules, initialValue: title
                                })(
                                    <Input
                                      className='headerInput'
                                      autoFocus
                                    // defaultValue={title}
                                      style={style}
                                      onPressEnter={this.onBlur}
                                      onBlur={this.onBlur}
                                      onMouseEnter={this.handleMouseEnter}
                                      onMouseLeave={this.handleMouseLeave}
                                      onMouseDown={this.onMouseDown}
                                      placeholder={placeholder}
                                      onFocus={() => onFocus()}
                                    />
                                )}
                            </div>
                            : <Tooltip placement='top' title={title}>
                                <div className='headerTitle' onClick={this.controlEditTitle}>
                                    {title || placeholder}
                                </div>
                            </Tooltip>
                        }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

TitleBtn.propTypes = {
    editTitle: PropTypes.bool,
    title: PropTypes.string,
    controlEditTitle: PropTypes.func,
    form: PropTypes.object,
    handleTitleBlur: PropTypes.func,
    rules: PropTypes.array,
    triggle: PropTypes.bool,
    style: PropTypes.object,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func
}

export default Form.create()(CSSModules(TitleBtn, styles));
