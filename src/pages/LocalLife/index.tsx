import { LOCAL_LIFE_MAP } from '@/config/constant';
import Life from './components/Life';
import { useModel } from 'umi';

export default ({ location }) => {
  const { query } = location;
  const { user } = useModel('user', (model) => ({ user: model.user }));

  /**
   * 根据`query.id`分发页面
   * @see {LOCAL_LIFE_MAP}
   * @document https://doc.sijishows.com/web/#/13?page_id=8725
   */
  switch (+query.id) {
    case LOCAL_LIFE_MAP.ELEME_WAIMAI:
    case LOCAL_LIFE_MAP.ELEME_MARKET:
    case LOCAL_LIFE_MAP.MEITUAN_WAIMAI:
    case LOCAL_LIFE_MAP.MEITUAN_MARKET:
    case LOCAL_LIFE_MAP.MEITUAN_TUANGOU:
    case LOCAL_LIFE_MAP.KOUBEI:
      return <Life id={query.id} isNeedBind={+user.is_need_bind} />;
    case LOCAL_LIFE_MAP.KFC:
      return <div>肯德基</div>;
    default:
      break;
  }
  return null;
};
