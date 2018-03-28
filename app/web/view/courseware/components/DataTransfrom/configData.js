const commonPptConfig = {

    props: {
        style: {},
        animation: {}
    },

    slides: []
}

const commonSlideConfig = {

    id: '',
    thumnail: '',
    props: {
        background: {
            image: '',
            color: ''
        },
        animation: {
            comeIn: '',
            comeOut: '',
            speed: ''
        }
    },
    blocks: []
}

const commonBlockConfig = {
    id: '',
    isQuestion: false,
    type: '',
    props: {
        position: {
            left: 180,
            top: 300
        },
        size: {
            width: 600,
            height: 80
        },
        border: {
            style: '',
            width: 0,
            color: ''
        },
        opacity: 100,
        rotation: 0,
        animation: {
            effect: '',
            duration: 0,
            delay: 0,
            index: 0,
            triggle: 'click'
        },
        zIndex: 10
    }
}

const pptProps = {
    style: {},
    animation: {}
}

const slideProps = {
    background: {
        image: '',
        color: ''
    },
    animation: {
        comeIn: '',
        comeOut: '',
        speed: ''
    }
}

const blockBorder = {
    style: '',
    width: 0,
    color: ''
}

const blockAnimation = {
    effect: '',
    duration: '',
    delay: '',
    index: -1
}

const initStyle = {
    'fade-in': {opacity: 0},
    'fade-out': {opacity: 1},
    'fade-up': {transform: 'translateY(-50px)'},
    'fade-down': {transform: 'translateY(50px)'},
    'grow': {transform: 'scale(0.5)'},
    'shrink': {transform: 'scale(1)'},
    'fade-left': {transform: 'translateX(-50px)'},
    'fade-right': {transform: 'translateX(50px)'}
}

export {
    commonPptConfig,
    commonSlideConfig,
    commonBlockConfig,
    pptProps,
    slideProps,
    blockBorder,
    blockAnimation,
    initStyle
}
