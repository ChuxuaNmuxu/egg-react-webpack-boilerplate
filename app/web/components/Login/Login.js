// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router';
import styles from './Login.scss';
import { Form, Icon, Input, Button, Card, Popover } from 'antd';
const FormItem = Form.Item;

class Login extends Component {
    constructor (props) {
        super(props);

        this.state = {
            error: this.props.error
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount () {
        this.textUsername.focus();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.error !== this.props.error) {
            this.setState({
                error: nextProps.error
            });
        }

        if (nextProps.visible && nextProps.visible !== this.props.visible) {
            this.textUsername.focus();
        }
    }

    handleInputChange (e) {
        this.setState({
            error: null
        });
    }

    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                this.props.onLogin(values);
            } else {
                console.error(err);
            }
        });
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const help = <div style={{maxWidth: '180px'}}>当你没有或忘记用户名时，可使用（姓名+工号）或（姓名+学号）的组合来作为用户名登录</div>;
        const extra = <Popover placement='leftTop' title='帮助' content={help} trigger='click'>
            <a className='help'><Icon type='question-circle-o' /></a>
        </Popover>;
        return (
            <Card title='用户登录' extra={extra} className='login-card' styleName='login-card'>
                {this.state.error && <div className='error'>{this.state.error}</div>}
                <Form onSubmit={this.handleSubmit} className='login-form' onKeyDown={(event) => event.keyCode === 13 && this.handleSubmit(event)}>
                    <FormItem extra='可使用（姓名+工号）或（姓名+学号）的组合来登录'>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入用户名' }]
                        })(
                            <Input autoComplete='off' ref={input => { this.textUsername = input }} addonBefore={<Icon type='user' />} size='large' placeholder='用户名' onChange={this.handleInputChange} />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }]
                        })(
                            <Input autoComplete='off' addonBefore={<Icon type='lock' />} type='password' size='large' placeholder='密码' onChange={this.handleInputChange} />
                        )}
                    </FormItem>
                </Form>
                <div className='operater'>
                    <Link to='/register' className='a-register' style={{display: 'none'}}>还没有账号，去注册？</Link>
                    <Button htmlType='submit' className='login-form-button' size='large' onClick={this.handleSubmit}>
                        登录
                    </Button>
                </div>
            </Card>
        )
    }
}

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
    form: PropTypes.any,
    error: PropTypes.string,
    visible: PropTypes.bool
}

export default Form.create()(CSSModules(Login, styles));
