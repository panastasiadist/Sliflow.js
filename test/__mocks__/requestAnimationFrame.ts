window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
};
