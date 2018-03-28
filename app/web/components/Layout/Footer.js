import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import styles from './Footer.scss';

class Footer extends Component {
    render () {
        const currentYear = new Date().getFullYear();
        return (
            <footer className='hidden-print' styleName='footer'>
                <div className='ui container'>
                    <div>
                        <span>深圳市采集科技有限公司</span>&nbsp;&nbsp;
                        <span>电话：+86-0755-86368900</span>&nbsp;&nbsp;
                        <span>传真：+86-0755-86368910</span>&nbsp;&nbsp;
                        <span>邮箱：info@caijicn.com</span>
                    </div>
                    <div>Copyright © 2007 - {currentYear} CAIJI TECH. All Rights Reserved</div>
                </div>
            </footer>
        )
    }
}

export default CSSModules(Footer, styles);
