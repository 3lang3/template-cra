declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.jpg';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

interface Window {
  android: any;
  webkit: any;
  wx: any;
}
