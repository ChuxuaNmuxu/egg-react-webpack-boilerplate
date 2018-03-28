import React from 'react';
import Blocks from './BlocksInSlide';
import PropTypes from 'prop-types';
import {List} from 'immutable';

class PlaySlide extends React.Component {
    setSlideProps (slide) {
        let props = {};
        let {background: {image, color}, animation: {type, speed}} = slide.props;
        props['data-transition'] = type;
        image && (props['data-background-image'] = image);
        color && (props['data-background-color'] = color);
        speed && (props['data-transition-speed'] = speed);
        return props;
    }

    render () {
        let { slides = [] } = this.props;
        if (List.isList(slides)) {
            slides = slides.toJS();
        }

        return <div className='slides'>
            {
                    slides.map((slide, slideIndex) => { // slide(卡片)层的渲染
                        return <section
                          {...this.setSlideProps(slide)}
                          key={slideIndex}
                          data-slide-id={slide.id}
                          data-slide-index={slideIndex}
                          style={{height: '100%', padding: 0}}
                        >
                            <Blocks slide={slide} index={slideIndex} />
                        </section>
                    })
                }
        </div>
    }
}

PlaySlide.propTypes = {
    dispatch: PropTypes.func,
    slides: PropTypes.array
}

export default PlaySlide;
