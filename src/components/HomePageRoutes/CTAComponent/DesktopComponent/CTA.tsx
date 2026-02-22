import "../CTA.css";
import {
    CTAHeading,
    CTADescription,
    CTACallNowText,
    CTACallNowTel,
    CTAPhoneScreens,
} from "../CommonValues";
import CtaButton from "@/components/CommonComponents/CtaButton/CtaButton";

const GooglePlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l14.84-6.22-4.08-2.22zM20.16 3.15L6.05 17.34l4.08-2.22 10.03-10.03a1.5 1.5 0 0 0-.84-.94z" />
    </svg>
);

const AppStoreIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
);

const CTA = () => {
    return (
        <section id="CTASection" >
            <div className="CTATopBlock PaddingTop30">
                <h2 className="SecondaryHeadingFont text-center">{CTAHeading}</h2>
                <p className="CTADescription">{CTADescription}</p>
                <CtaButton label={CTACallNowText} href={CTACallNowTel} />
            </div>
            <div className="CTABottomBlock">
                <div className="CTAPhonesWrap">
                    {CTAPhoneScreens.map((src, i) => (
                        <div key={i} className="CTAPhone">
                            <div className="CTAPhoneFrame">
                                <div className="CTAPhoneScreen">
                                    <img
                                        src={src}
                                        alt={`App screen ${i + 1}`}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CTA;
