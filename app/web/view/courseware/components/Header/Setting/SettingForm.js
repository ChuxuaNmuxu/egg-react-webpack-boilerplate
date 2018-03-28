import React from 'react';
import CSSModules from 'react-css-modules';
import {Form, Input, Select} from 'antd';
import PropTypes from 'prop-types';

import styles from './settingForm.scss';
const FormItem = Form.Item;
const Option = Select.Option;

const formLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
    }
}

class SettingForm extends React.Component {
    formLabel (content) {
        return <div className='label-wrapper'>
            <span className='label-content'>{content}</span>
            <span className='label-addition'>(&nbsp;可多选&nbsp;)</span>
        </div>
    }

    formSelect (data, config) {
        const children = data.map((item, index) => {
            return <Option key={index} value={item.id}>{item.name}</Option>
        })

        return <Select {...config}>
            {children}
        </Select>
    }

    render () {
        const {form: {getFieldDecorator}, coursewareInfo: {file, grade, subject}} = this.props;

        return <div styleName='setting-form' className='setting-form'>
            <Form>
                <FormItem
                  {...formLayout}
                  label='课件名称'
                >
                    {
                        getFieldDecorator('name', {
                            rules: [{required: true, message: '课件名称不能为空'}, {max: 20, message: '最多可以输入20个字符'}]
                        })(
                            <Input placeholder='请输入课件名称' />
                        )
                    }
                </FormItem>
                <FormItem
                  {...formLayout}
                  label={this.formLabel('实用学科')}
                >
                    {
                        getFieldDecorator('subject', {
                        })(

                            this.formSelect(subject.totalList, {
                                placeholder: '请选择该课件适用的学科',
                                mode: 'tags'
                            })
                        )
                    }
                </FormItem>
                <FormItem
                  {...formLayout}
                  label={this.formLabel('适用年级')}
                >
                    {
                        getFieldDecorator('grade', {
                        })(
                            this.formSelect(grade.totalList, {
                                placeholder: '请选择该课件适用的年级',
                                mode: 'tags'
                            })
                        )
                    }
                </FormItem>
                <FormItem
                  {...formLayout}
                  label='课件描述'
                >
                    {
                        getFieldDecorator('summary', {
                            rules: [{max: 50, message: '最多可以输入50个字符'}]
                        })(
                            <Input type='textarea' placeholder='这份课件的主要内容是什么？' rows='3' />
                        )
                    }
                </FormItem>
                <FormItem
                  {...formLayout}
                  label='所属文件夹'
                >
                    {
                        getFieldDecorator('file', {
                        })(
                            this.formSelect(file.totalList, {
                                placeholder: '默认'
                            })
                        )
                    }
                </FormItem>
            </Form>
        </div>
    }
}

SettingForm.propTypes = {
    form: PropTypes.object,
    coursewareInfo: PropTypes.object
}

const mapPropsToFields = props => {
    const {coursewareInfo: {name, summary, file, grade, subject}} = props;
    return {
        name: {value: name},
        subject: {value: subject.select},
        grade: {value: grade.select},
        summary: {value: summary},
        file: {value: file.select}
    }
}

export default Form.create({mapPropsToFields})(CSSModules(SettingForm, styles));
