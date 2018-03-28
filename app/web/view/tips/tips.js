import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import styles from './tips.scss';
import Helper from '../../../config/helper'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

class Tips extends Component {
    render () {
        let hasStudent = this.props.visitor.schoolRoleList.filter(x => x === 'STUDENT');
        return (
            <div className='tips' styleName='tips'>
                <div className='tipsContent'>
                    <div className='title'>
                        对不起,e采备课系统暂时仅支持教师用户访问
                    </div>
                    <div className='tipDetail'>
                        <div className='tipsItem'>您是否访问</div>
                        {
                        hasStudent.length > 0 && <div className='tipsItem'>
                            <a href={Helper.siteResolve('cjhms')}>课业系统</a>
                        </div>
                       }
                        <div className='tipsItem'>
                            <a href={Helper.siteResolve('cjtlis')}>学情系统</a>
                        </div>
                    </div>
                    <button className='tipBtn' onClick={() => { window.location.href = Helper.siteResolve('cjyun') }}>返回e采云平台首页</button>
                </div>
            </div>
        )
    }
}

Tips.propTypes = {
    visitor: PropTypes.object
}

const select = (state) => {
    const { account: { visitor } } = state;
    return {
        visitor
    }
}

export default connect(select)(CSSModules(Tips, styles));
