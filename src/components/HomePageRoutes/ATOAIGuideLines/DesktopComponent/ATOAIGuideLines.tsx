import "../ATOAIGuideLines.css"
import { ATOAIContent } from "../CommonValues"

const ATOAIGuideLines = () => {
    return (
        <section className="ATOAISection PaddingTop30 PaddingBottom30">
            <div id="ATOAIGuideLines" className="MaxWidthComponent MarginAuto">
                <div className="ATOAIContainer">
                    <h2 className="SecondaryHeadingFont text-center">{ATOAIContent.heading}</h2>

                    <div className="ATOAILogoContainer">
                        <img src={ATOAIContent.logo} alt="ATOAI guidelines - Allied member logo" className="ATOAILogo" />
                    </div>

                    <p className="ATOAIDescription text-center">
                        <strong className="BrandHighlight">bucketlistt</strong> strictly adheres to the safety, ethical, and operational standards set by the <a href="https://www.atoai.org/" target="_blank" rel="noopener noreferrer" className="ATOAILink">Adventure Tour Operators Association of India (ATOAI)</a>. All activities offered on our platform comply with the Basic Minimum Standards prescribed for adventure tourism, ensuring responsible practices, trained staff, certified equipment, and a strong commitment to environmental sustainability. Your safety and experience are our top priorities.
                    </p>

                    <div className="MadeInContainer">
                        <div className="MadeInWrapper">
                            <h4 className="MadeInHeading">{ATOAIContent.madeInHeading}</h4>
                            <div className="SlidingTextContainer">
                                <div className="SlidingTextWrapper">
                                    <span className="SlidingTextItem">India</span>
                                    <span className="SlidingTextItem">भारत</span>
                                    <span className="SlidingTextItem">India</span>
                                    <span className="SlidingTextItem">भारत</span> {/* Loop item */}
                                </div>
                            </div>
                        </div>
                        <div className="IndiaFlagContainer">
                            <img src={ATOAIContent.indiaFlag} alt="ATOAI guidelines - India flag" className="IndiaFlag" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ATOAIGuideLines;