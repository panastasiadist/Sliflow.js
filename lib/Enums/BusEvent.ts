/**
 * Events used by the slider to inform other components.
 *
 * @since 0.1.0
 */
enum BusEvent {
    SLIDER_READY = 'SLIDER_READY',
    SLIDES_UPDATED = 'SLIDES_UPDATED',
    STATE_UPDATE_STARTED = 'STATE_UPDATE_STARTED',
    STATE_UPDATE_FINISHED = 'STATE_UPDATE_FINISHED',
    CURRENT_SLIDE_SET = 'CURRENT_SLIDE_SET',
    TRANSITIONING_STARTED = 'TRANSITIONING_STARTED',
    TRANSITIONING_FINISHED = 'TRANSITIONING_FINISHED',
}

export default BusEvent;