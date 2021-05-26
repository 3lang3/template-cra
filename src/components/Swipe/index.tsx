/**
 * swiper
 * @see https://swiperjs.com/react
 */
import cn from 'classnames';
import type { SwiperOptions } from 'swiper';
import SwiperCore, { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import './swiper.less';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

SwiperCore.use([Autoplay, Pagination]);

type SwiperProps = {
  className?: string;
  children: React.ReactNode;
} & SwiperOptions;

const Swipe = ({
  slidesPerView = 1,
  pagination = true,
  className,
  children,
  ...props
}: SwiperProps) => {
  return (
    <div className={cn('local-swiper', className)}>
      <Swiper slidesPerView={slidesPerView} pagination={pagination} {...props}>
        {children}
      </Swiper>
    </div>
  );
};

Swipe.SwiperSlide = SwiperSlide;

export default Swipe;
