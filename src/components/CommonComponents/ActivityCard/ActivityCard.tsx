"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ActivityCard.css';

export interface Activity {
    id: string | number;
    title: string;
    category: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    discount?: string;
    images: string[];
    location?: string;
    vendor?: string;
}

const ActivityCard = ({ activity }: { activity: Activity }) => {
    return (
        <div className="ActivityCard">
            <div className="ActivityImageContainer">
                <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    nested={true}
                    loop={true}
                    navigation={{
                        nextEl: `.InnerNext-${activity.id}`,
                        prevEl: `.InnerPrev-${activity.id}`,
                    }}
                    className="InnerImageSwiper"
                >
                    {activity.images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                            <img src={img} alt={`Activity card - ${activity.title} image ${idx + 1}`} />
                        </SwiperSlide>
                    ))}
                    <div className={`InnerPrev InnerPrev-${activity.id}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </div>
                    <div className={`InnerNext InnerNext-${activity.id}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </Swiper>
                <div className="FavoriteBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
            </div>
            <div className="ActivityDetails">
                <div className="ActivityMeta">
                    <div className="ActivityMetaLeft">
                        <span className="ActivityCategory">{activity.category}</span>
                    </div>
                    <div className="ActivityRating">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="RatingVal">{activity.rating}</span>
                        <span className="ReviewCount">({activity.reviews})</span>
                    </div>
                </div>
                <h3 className="ActivityTitle">{activity.title}</h3>
                <div className="ActivityLocationVendorRow">
                    {activity.location && (
                        <div className="ActivityLocation">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            {activity.location}
                        </div>
                    )}
                    {activity.vendor && (
                        <span className="ActivityVendor">{activity.vendor}</span>
                    )}
                </div>
                <div className="ActivityPrice">
                    <div className="PriceLeft">
                        <span className="FromTag">from</span>
                        <div className="PriceWrap">
                            <span className="OriginalPrice">₹{activity.originalPrice}</span>
                            <span className="CurrentPrice">₹{activity.price}</span>
                        </div>
                    </div>
                    {activity.discount && <div className="DiscountTag">{activity.discount}</div>}
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
