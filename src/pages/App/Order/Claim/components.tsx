import titleIconLeftSrc from './static/index_title_left.png';
import titleIconRightSrc from './static/index_title_right.png';
import styles from './index.less';

type CustomSearchProps = {
  value?: any;
  onChange?: (v: any) => void;
  onSearch?: (v: any) => void;
};

export const CustomSearch = ({
  value = {},
  onChange,
  ...props
}: CustomSearchProps) => {
  const { keyword = '' } = value;
  const onSearch = async (params: any) => {
    if (props.onSearch) props.onSearch({ ...value, ...params });
  };
  const onKeyPress = (e) => {
    // @summary enterkey trigger
    if (e.charCode === 13) {
      onSearch({ ...value, keyword: e.target.value });
    }
  };
  const onIptChange = (e) => {
    if (onChange) onChange({ ...value, keyword: e.target.value });
  };
  return (
    <div className={styles.search}>
      <input
        value={keyword}
        placeholder="请输入淘宝或拼多多订单号"
        onChange={onIptChange}
        onKeyPress={onKeyPress}
      />
      <div className={styles.searchBtn} onClick={onSearch}>
        搜索
      </div>
    </div>
  );
};

export const CustomClaimDesc = () => (
  <div className={styles.desc}>
    <div className={styles.descTitle}>规则说明</div>
    <p>1.当前仅支持淘宝或拼多多订单查询;</p>
    <p>2.购买者未同步订单支持通过订单查询找回;</p>
    <p>3.所查找的订单未有归属人情况下方可支持查找;</p>
    <p>4.已有归属人的订单不支持查询;</p>
    <p>5.订单确认归属后收益将按照当前用户关系进行归属;</p>
  </div>
);

export const SwiperContentItem = ({ brand, subTitle, img1, img2 }) => (
  <>
    <div className={styles.title}>
      <img alt="icon" src={titleIconLeftSrc} />
      如何获取{brand}订单编号
      <img alt="icon" src={titleIconRightSrc} />
    </div>
    <div className={styles.steps}>
      <div className={styles.step}>
        <div className={styles.stepNum}>1</div>
        <div className={styles.stepText}>
          打开{brand}APP
          <br /> {subTitle}
        </div>
        <img src={img1} alt="step1" />
      </div>
      <div className={styles.step}>
        <div className={styles.stepNum}>2</div>
        <div className={styles.stepText}>
          复制订单编号
          <br /> 复制订单号,粘贴在搜索栏
        </div>

        <img src={img2} alt="step1" />
      </div>
    </div>
  </>
);
