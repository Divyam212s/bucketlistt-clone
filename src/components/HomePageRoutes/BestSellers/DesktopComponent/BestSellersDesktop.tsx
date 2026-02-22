"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../BestSellers.css';
import { bestSellerActivities } from '../CommonValues';
import ActivityCard from '@/components/CommonComponents/ActivityCard/ActivityCard';

const BestSellersDesktop = () => {
    return (
        <div id="BestSellersDesktop" className="MaxWidthComponent MarginAuto PaddingTop50 ">
            <div className="BestSellersHeader">
                <h2 className="SecondaryHeadingFont">Must-Try Adventurous Things to Do This Season</h2>
                <div className="CustomNavigation">
                    <button className="PrevBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <button className="NextBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={4}
                navigation={{
                    prevEl: '.PrevBtn',
                    nextEl: '.NextBtn',
                }}
                className="BestSellersSwiper PaddingTop30"
            >
                {bestSellerActivities.map((activity) => (
                    <SwiperSlide key={activity.id}>
                        <ActivityCard activity={activity} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BestSellersDesktop;