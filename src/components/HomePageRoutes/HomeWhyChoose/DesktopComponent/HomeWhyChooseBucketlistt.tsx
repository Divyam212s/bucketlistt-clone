"use client"
import "../HomeWhyChoose.css"
import { whyChooseFeatures, WhyChooseHeading } from "../CommonValues"

const HomeWhyChooseBucketlistt = () => {
    // Premium SVG Icons mapping
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "mountain":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3l4 8 5-5 5 15H2L8 3z"></path>
                    </svg>
                );
            case "tag":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                );
            case "zap":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                );
            case "shield":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <section id="HomeWhyChoose" className="MaxWidthComponent MarginAuto PaddingTop30 PaddingBottom30">
            <div className="WhyChooseContainer">
                <div className="WhyChooseContentLeft">
                    <h2 className="SecondaryHeadingFont">{WhyChooseHeading}</h2>
                    <p className="WhyChooseDescription">Experience the world with confidence and comfort. We handle the details so you can focus on the memories.</p>
                    <div className="BrandAccentLine"></div>
                </div>

                <div className="WhyChooseGrid creative">
                    {whyChooseFeatures.map((feature) => (
                        <div key={feature.id} className="FeatureItem">
                            <div className="IconBox">
                                {getIcon(feature.icon)}
                            </div>
                            <div className="FeatureText">
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeWhyChooseBucketlistt;