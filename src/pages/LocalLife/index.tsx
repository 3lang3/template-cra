import { LOCAL_LIFE_MAP } from '@/config/constant';

export default ({ location }) => {
  const { query } = location;

  /**
   * 根据`query.id`分发页面
   * @see {LOCAL_LIFE_MAP}
   * @document https://doc.sijishows.com/web/#/13?page_id=8725
   */
  switch (+query.id) {
    case LOCAL_LIFE_MAP.ELEME_WAIMAI:
      return <div>饿了么外卖</div>;
    case LOCAL_LIFE_MAP.ELEME_MARKET:
      return <div>饿了么果蔬商超</div>;
    case LOCAL_LIFE_MAP.MEITUAN_WAIMAI:
      return <div>美团外卖</div>;
    case LOCAL_LIFE_MAP.MEITUAN_MARKET:
      return <div>美团果蔬商超</div>;
    case LOCAL_LIFE_MAP.MEITUAN_TUANGOU:
      return <div>美团团购</div>;
    case LOCAL_LIFE_MAP.KOUBEI:
      return <div>口碑</div>;
    case LOCAL_LIFE_MAP.KFC:
      return <div>肯德基</div>;
    default:
      break;
  }
  return null;
};
