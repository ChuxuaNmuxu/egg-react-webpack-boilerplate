import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Reveal from 'reveal.js';
// import 'reveal.js/css/reveal.css';
import io from 'socket.io-client';
// import styles from './components/play/play.scss'
import { connect } from 'react-redux';

// import courseware from './components/play/dataTransform';
import PlaySlides from './components/play/PlaySlides';
import * as actions from '../../actions/play';
import Pad from './PadInteractor';
import transfrom from './components/DataTransfrom';
import styles from './play.scss';
import {commonHandlesHoc} from './components/helper/Hocs';

// let reveal = {}
window.Reveal = Reveal;
window.Pad = Pad;

class Play extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            ppt: {
                slides: []
            }
        }

        this.handleInit = this.handleInit.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
    }

    handleInit () {
        const slideWidth = 1120;
        const slideHeight = 630;
        Reveal.initialize({
            height: slideHeight,
            minScale: 0.2,
            maxScale: 1.5,
            width: slideWidth
            // history: true
        });
        Reveal.sync();
        this.initPadInteractor();
    }

    initPadInteractor () {
        const {client, test} = this.props.location.query;
        let testIo;
        if (test !== undefined) {
            testIo = io('http://127.0.0.1:3000');
            testIo.on('sync', msg => {
                Pad.sync(JSON.parse(msg));
            });
        }
        if (client === 'pad') {
            this.pad = new Pad(this.state.ppt, {
                onChange: (sync, exercise) => {
                    if (test !== undefined) {
                        testIo.emit('sync', sync)
                    }
                    // TODO：这里调用平板代码
                    window.androidInterface &&
                    window.androidInterface.notifyPad &&
                    window.androidInterface.notifyPad(JSON.stringify(sync), JSON.stringify(exercise));
                }
            });
        }
    }

    componentDidMount () {
        // Reveal = require('reveal.js').default;
        const { dispatch, params: { id } } = this.props;

        if (window.opener.CJWindow === 'onlinePPTEditor') {
            window.addEventListener('message', this.receiveMessage, false);
        } else {
            dispatch(actions.coursePlayGetData(id)).then(res => {
                console.log('拿到这个id对应的课件', res);
                this.setState({
                    ppt: transfrom(res.data.ppt)
                }, () => {
                    this.handleInit();
                })
            });
        }

        document.addEventListener('click', this.onDocumentClick);

        const _this = this;
        window.location.hash = `/0`
        Reveal.addEventListener('slidechanged', (event) => {
            // event.previousSlide, event.currentSlide, event.indexh, event.indexv
            // console.log(88, this.props)// const {dispatch, courseware: {current: {slideIndex}}} = _this.props; // TODO: this的指向
            _this.slideIndex = event.indexh;
            window.location.hash = `/${event.indexh}`;
        });
        Reveal.addEventListener('fragmentshown', this.fragmentChange.bind(_this));
        Reveal.addEventListener('fragmenthidden', this.fragmentChange.bind(_this));
    }

    receiveMessage (event) {
        window.opener.CJWindow = '';
        if (event.data.type === 'postCourseware' && event.data.payload.ppt) {
            this.setState({
                ppt: transfrom(event.data.payload.ppt)
            }, () => {
                this.handleInit();
            })
        }
    }

    fragmentChange (event) {
        const index = event.fragment.dataset.fragmentIndex;
        window.location.hash = `/${this.slideIndex}/${index}`;
    }

    onDocumentClick (e) {
        if (e.target.classList.contains('navigate-left') || e.target.classList.contains('navigate-right')) {
            return;
        }
        Reveal.next()
    }

    componentWillUnmount () {
        document.removeEventListener('click', this.onDocumentClick, false);
    }

    render () {
        const { ppt: {slides} } = this.state;
        return (
            <div styleName='ppt-play' className='ppt-play'>
                <div className='reveal played'>
                    <PlaySlides slides={slides} />
                </div>
            </div>
        )
    }
}

Play.propTypes = {
    // courseware: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    location: PropTypes.object
}

export default connect()(CSSModules(commonHandlesHoc()(Play), styles));
