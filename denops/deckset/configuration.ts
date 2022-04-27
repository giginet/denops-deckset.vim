export interface Configuration {
    slideNumbers: boolean
    slideCount: boolean
    slideDividers: '#' | '##' | '###' | '####'
    autoScale: boolean
    slideTransition: boolean | number
    footer?: string
    theme?: string
}

export const defaultConfiguration = {
    slideNumbers: false,
    slideCount: false,
    slideDividers: '#',
    autoScale: false,
    slideTransition: false,
    footer: null,
    theme: null,
}

function extractSlideTransition(transition: boolean | number): string {
    if (typeof transition == 'boolean') {
        return transition;
    } else if (typeof transition == 'number') {
        `fade(${transition})`;
    }
}

export function buildConfigurationTag(configuration: Configuration): string[] {
    const metadata = [
        `slidenumbers: ${configuration.slideNumbers}`,
        `slidecount: ${configuration.slideCount}`,
        `slide-dividers: ${configuration.slideDividers}`,
        `autoscale: ${configuration.autoScale}`,
        `slide-transition: ${extractSlideTransition(configuration.slideTransition)}`,
    ]

    if (configuration.footer != null) {
        metadata.push(`footer: ${configuration.footer}`);
    }

    if (configuration.theme != null) {
        metadata.push(`theme: ${configuration.theme}`);
    }

    metadata.push('');

    return metadata;
}