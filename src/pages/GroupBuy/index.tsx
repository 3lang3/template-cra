import Search from './components/Search';
import TabBar from './components/TabBar';
import Menu from './components/Menu';
import Product from './components/Product';
import './index.less';

export default () => {
  return (
    <div className="buy">
      <header className="buy__header">
        <Search />
        <TabBar />
      </header>
      <div className="buy__body">
        <Menu />
        <div className="buy__body--list">
          <Product />
          <Product />
        </div>
      </div>
    </div>
  );
};
