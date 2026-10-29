import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type LottiePlayerProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string;
  background?: string;
  speed?: string | number;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
};

// React 19 moved JSX.IntrinsicElements from the global JSX namespace to React.JSX,
// so both need to be augmented for `<lottie-player />` to type-check everywhere.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': LottiePlayerProps;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': LottiePlayerProps;
    }
  }
}

export {};
