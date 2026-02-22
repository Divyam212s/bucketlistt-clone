import "../WhoWeAre.css";
import {
    WhoWeAreSectionImage,
    WhoWeAreHeading,
    WhoWeAreTagline,
    WhoWeAreStats,
    WhoWeAreDescription,
    WhoWeAreCtaQuestion,
} from "../CommonValues";

const WhoWeAreDesktopComponent = () => {
    return (
        <section
            id="WhoWeAre"
            className="MaxWidthComponent MarginAuto PaddingTop50 PaddingBottom50"
        >
            <div className="WhoWeAreContainer">
                <div className="WhoWeAreImageWrap">
                    <img
                        src={WhoWeAreSectionImage}
                        alt="Who we are - team and workspace"
                    />
                    <div
                        className="WhoWeAreImageOverlay"
                        aria-hidden="true"
                    />
                </div>
                <div className="WhoWeAreContent">
                    {/* <h2 className="WhoWeAreHeading">{WhoWeAreHeading}</h2> */}
                    <p className="WhoWeAreTagline">{WhoWeAreTagline}</p>
                    <div className="WhoWeAreStatsGrid">
                        {WhoWeAreStats.map((stat) => (
                            <div key={stat.label} className="WhoWeAreStatItem">
                                <span className="WhoWeAreStatValue">{stat.value}</span>
                                <span className="WhoWeAreStatLabel" dangerouslySetInnerHTML={{ __html: stat.label }}></span>
                            </div>
                        ))}
                    </div>
                    <p
                        className="WhoWeAreDescription"
                        dangerouslySetInnerHTML={{ __html: WhoWeAreDescription }}
                    />
                    <p className="WhoWeAreCta">
                        {WhoWeAreCtaQuestion}{" "}
                        <a href="/contact">Get in touch</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WhoWeAreDesktopComponent;
