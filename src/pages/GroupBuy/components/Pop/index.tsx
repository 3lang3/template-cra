import { Flex } from 'react-vant';
import './index.less';

export type P = {
  children?: React.ReactElement;
  overlayProps?: any;
};

export default ({ children, overlayProps }: P) => {
  return (
    <div className="pop">
      <div className="pop-overlay" {...overlayProps} />
      <Flex direction="column" justify="center" className="pop-container">
        {children}
      </Flex>
    </div>
  );
};
