import { TooltipOptions } from './tooltip-options.interface';

export const defaultOptions: TooltipOptions = {
    placement: 'left',
    'content-type': 'string',
    delay: 0,
    'show-delay': 0,
    'hide-delay': 300,
    'hide-delay-mobile': 1500,
    'z-index': 0,
    'animation-duration': 300,
    'animation-duration-default': 300,
    trigger: 'hover',
    'tooltip-class': '',
    display: true,
    'display-mobile': true,
    shadow: true,
    theme: 'light',
    offset: 8,
    'max-width': '',
    id: false
};
