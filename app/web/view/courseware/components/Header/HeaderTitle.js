import React from 'react';
import PropTypes from 'prop-types';
import {
    Input, Form, Tooltip
} from 'antd';

import {changeHeadTitle} from '../../../actions/courseware';
const FormItem = Form.Item;

class TitleBtn extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            editTitle: false,
            textAlign: 'center'
        }
        this.onBlur = this.onBlur.bind(this);
        this.controlEditTitle = this.controlEditTitle.bind(this);
    }

    controlEditTitle (bol) {
        this.setState({
            editTitle: !this.state.editTitle
        });
    }

    onBlur (e) {
        e.preventDefault();
        const {form: { validateFields }, dispatch, courseId} = this.props;
        validateFields(['title'], (err, values) => {
        // console.log(err);
        // 因为第一次进来自动onfocus，触发setFieldsValue赋值，这边的err只需要考虑是否空格即可
            const { title } = values;
            if (!err) {
                dispatch(changeHeadTitle(title, courseId));
                this.controlEditTitle();
            } else {
                dispatch(changeHeadTitle(title, courseId));
                this.controlEditTitle();
            }
        });
        this.setState({
            editTitle: false
        });
    }

    // onFocus (e) {
    //     // const {form: { setFieldsValue }} = this.props; // todo: 如果没有title，后端会返回一个默认字符串，这时应该直接清空重新输入，1.2版本待定
    //     // setFieldsValue({
    //     //     title
    //     // })
    //     this.setState({
    //         textAlign: 'left'
    //     })
    // }

    render () {
        const {
            title,
            form: { getFieldDecorator }
        } = this.props
        const {editTitle} = this.state
        return (
            <div className='courseware-title'>
                <Form>
                    <FormItem>
                        {
                            editTitle
                            ? <div>
                                {
                                getFieldDecorator('title', {
                                    rules: [{ required: true, message: '必填' }, { whitespace: true, message: '内容不能只为空格' }], initialValue: title
                                })(
                                    <Input
                                      className='headerInput'
                                      autoFocus
                                    // defaultValue={title}
                                      style={{width: '140px'}}
                                      onPressEnter={this.onBlur}
                                      onFocus={this.onFocus}
                                      onBlur={this.onBlur}
                                      onMouseEnter={this.handleMouseEnter}
                                      onMouseLeave={this.handleMouseLeave}
                                    />
                                )}
                            </div>
                            : <Tooltip placement='top' title={title}>
                                <div className='headerInput headerTitle' onClick={this.controlEditTitle}>
                                    {title}
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
    dispatch: PropTypes.func,
    changeHeadTitle: PropTypes.func,
    form: PropTypes.object,
    courseId: PropTypes.string
}

export default Form.create()(TitleBtn);
