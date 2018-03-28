import React from 'react';
import PropTypes from 'prop-types';
import {
    InputNumber, Form, Modal
} from 'antd';

const FormItem = Form.Item;

class ShapeSelector extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            initialValue: 3
        }

        this.handleOk = this.handleOk.bind(this);
    }

    handleOk (values) {
        const {selectTable, handleVisible, form: {resetFields}} = this.props
        const {row, column} = values;

        handleVisible();
        resetFields(); // 重置所有输入的值
        selectTable(row, column);
    }

    checkRowAndColumn = (rule, value, call) => {
        if (value && (value < 0 || value > 20)) {
            call('请输入1-20的数字')
        }
        call();
    }

    render () {
        const {handleVisible, visible, form: { getFieldDecorator, validateFields }} = this.props;
        const {initialValue} = this.state;
        return <Modal
          title='添加表格'
          visible={visible}
          onOk={(e) => {
              e.preventDefault();
              validateFields((err, values) => {
                  if (!err) {
                      this.handleOk(values)
                  }
              });
          }}
          onCancel={handleVisible}
            >
            <Form className='login-form'>
                <FormItem
                  label='选择行数'
                    >
                    {getFieldDecorator('row', {
                        rules: [{ required: true, message: '必填！' }, {validator: this.checkRowAndColumn}],
                        initialValue
                    })(
                        <InputNumber
                          style={{width: '100%'}}
                          size='large'
                          min={1}
                          placeholder='输入数字'
                            />
                        )}
                </FormItem>
                <FormItem
                  label='选择列数'
                    >
                    {getFieldDecorator('column', {
                        rules: [{ required: true, message: '必填！' }, {validator: this.checkRowAndColumn}],
                        initialValue
                    })(
                        <InputNumber
                          style={{width: '100%'}}
                          size='large'
                          min={1}
                          placeholder='输入数字'
                            />
                        )}
                </FormItem>
            </Form>
        </Modal>
    }
}

ShapeSelector.propTypes = {
    controlModalVisible: PropTypes.func,
    modalVisible: PropTypes.bool,
    form: PropTypes.object,
    dispatch: PropTypes.func,
    addBlock: PropTypes.func,
    selectTable: PropTypes.func,
    handleVisible: PropTypes.func,
    visible: PropTypes.bool
}

export default Form.create()(ShapeSelector);
