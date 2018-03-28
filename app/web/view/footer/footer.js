/**
 * Created by Administrator on 2017/2/7.
 */
import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import styles from './footer.scss';

class CommonFooter extends Component {
    render () {
        return (
            <div className='commonFooter' styleName='commonFooter'>
                <div className='line1'>
                    <span>深圳市采集科技有限公司</span>&nbsp;&nbsp;
                    <span>电话：+86-0755-86368900</span>&nbsp;&nbsp;
                    <span>传真：+86-0755-86368910</span>&nbsp;&nbsp;
                    <span>邮箱：info@caijicn.com</span>
                </div>
                <div>
                    Copyright © 2007 - <script>document.write(new Date().getFullYear())</script>2017 CAIJI TECH. All Rights Reserved
                </div>
            </div>
        )
    }
}
export default CSSModules(CommonFooter, styles);
