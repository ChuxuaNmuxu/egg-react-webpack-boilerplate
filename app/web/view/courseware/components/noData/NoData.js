/**
 * Created by 万叙杰 on 2017/8/10.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import style from './NoData.scss';
import noppt from '../../../../public/images/noppt.png';
import noresource from '../../../../public/images/noresource.png';

class NoData extends Component {
    static defaultProps = {
        MyCourseOrSchoolCourse: 0     // 当前页面，0为我的课件页面，1为校本资源页面，默认为0
    }

    render () {
        return (
            <div styleName='noData' className='noData'>
                <img src={this.props.MyCourseOrSchoolCourse ? noresource : noppt} />
                <p className='noDataTitle'>{this.props.MyCourseOrSchoolCourse ? '还没有课件' : '还没有课件，快去新建一份吧~'}</p>
                {this.props.MyCourseOrSchoolCourse ? <p className='noDataTip'>校本资源库的建立靠的是大家的踊跃分享</p> : null}
            </div>
        )
    }
}

NoData.propTypes = {
    MyCourseOrSchoolCourse: PropTypes.any
}

export default CSSModules(NoData, style);
