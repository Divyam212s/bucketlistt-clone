"use client"
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import "../HeroDestinationsCards.css";
import { DestinationCardsDetails } from "../CommonValues";

/** SEO-friendly slug from destination name (e.g. "Goa" → "goa", "Shivrajpur Beach" → "shivrajpur-beach") */
function destinationSlug(name: string): string {
    return name.toLowerCase().trim().replace(/\s+/g, "-");
}

const HeroDesktopDestinationsCards = () => {
    return (
        <div id="HeroDestinationsCardsMainContainer">
            <div className='DestionatinSkylineImageContainer'>
            </div>

            <div id="HeroDestinationsCards" className="MaxWidthComponent MarginAuto PaddingTop50">

                <div className='SecondaryHeadingFont'>
                    Explore India’s Best Adventure Sports Destinations
                </div>
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={10}
                    slidesPerView={4.2}
                    loop={true}
                    speed={800}
                    // autoplay={{
                    //     delay: 2500,
                    //     disableOnInteraction: false,
                    // }}
                    pagination={{ clickable: true }}
                    className="DestinationsSwiper PaddingTop30 PaddingBottom30"
                >
                    {DestinationCardsDetails.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Link
                                href={`/all-destination/${destinationSlug(item.destinationTitle)}`}
                                className="DestinationCard"
                                aria-label={`Explore ${item.destinationTitle}`}
                            >
                                <div className="CardImageContainer">
                                    <img src={item.destinationImage} alt={`Hero destinations - ${item.destinationTitle}`} />
                                </div>
                                <div className="CardOverlay">
                                    <div className="ContentBlur">
                                        <div className="TextContent">
                                            <h3 className="DestinationTitle">{item.destinationTitle}</h3>
                                        </div>
                                        <div className="ArrowButton">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default HeroDesktopDestinationsCards;