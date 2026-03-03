import "../DestinationLocation.css";
import Link from "next/link";
const DestinationLocation = () => {
    return (
        <section id="DestinationLocation" className="PaddingTop30 PaddingBottom30">
            <div className="MaxWidthComponent MarginAuto">
                {/* Breadcrumbs */}
                <div className="Breadcrumb MarginBottom20">
                    <Link href="/">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </Link>
                    <span className="Separator">&rsaquo;</span>
                    <Link href="/">Home</Link>
                    <span className="Separator">&rsaquo;</span>
                    <span className="Current">Rishikesh</span>
                </div>

                <div className="DestinationHeroContainer">
                    {/* Left: Text Content */}
                    <div className="HeroLeft MaxWidth500">
                        <h1 className="PrimaryHeadingFont ">
                            Discover the best things to do in <span className="SwooshContainer">Rishikesh
                                <svg className="SwooshSvg" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M 0 15 Q 50 5 100 15" strokeWidth="2" fill="transparent" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <br />
                        <p>
                            Discover must-see sights, savour authentic cuisine, and experience the essence of local culture.
                        </p>
                    </div>

                    {/* Right: Feature Image */}
                    <div className="HeroRight">
                        <div className="HeroImageWrapper">
                            <img
                                src="https://images.unsplash.com/photo-1653768640822-4b1bdf329a29?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Destination location - Things to do in Rishikesh"

                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DestinationLocation;