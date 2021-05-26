/**
 * swiper
 * @see https://swiperjs.com/react
 */
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import './swiper.less';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default () => {
  return (
    <Swiper slidesPerView={2} scrollbar={{ draggable: true }} className="local-swiper">
      <SwiperSlide>
        <div className="local-swiper__item">
          <div>Slide 1</div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="local-swiper__item">
          <div>Slide 2</div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="local-swiper__item">
          <div>Slide 3</div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};
