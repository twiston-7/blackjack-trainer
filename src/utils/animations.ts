interface AnimationConfig {
    delay?: number;
    duration: number;
    easing?: string;
}

export const cardDeal: AnimationConfig = {
    delay: 0,
    duration: 300,
    easing: 'ease-out'
};

export const cardFlip: AnimationConfig = {
    duration: 400,
    easing: 'ease-in-out'
};

export const feedbackFade: AnimationConfig = {
    duration: 500
};
