import HeroHomeDesktopComponent from "../HeroHome/DesktopComponent/DesktopComponent";
import HeroDesktopDestinationsCards from "../HeroDestinationsCards/DesktopComponent/HeroDesktopDestinationsCards";
import BestSellersDesktop from "../BestSellers/DesktopComponent/BestSellersDesktop";
import HomeReviewDesktop from "../HomeReview/DesktopComponent/HomeReviewDesktop";
import HomeWhyChooseBucketlistt from "../HomeWhyChoose/DesktopComponent/HomeWhyChooseBucketlistt";
import WhoWeAreDesktopComponent from "../WhoWeAre/DesktopComponent/WhoWeAre";
import CreatorsSection from "../CreatorsSection/CreatorsSection";
import ATOAIGuideLines from "../ATOAIGuideLines/DesktopComponent/ATOAIGuideLines";
import CTA from "../CTAComponent/DesktopComponent/CTA";
const HomeRoutes = () => {
    return (
        <div>
            <HeroHomeDesktopComponent />
            <HeroDesktopDestinationsCards />
            <BestSellersDesktop />
            <WhoWeAreDesktopComponent />
            <HomeReviewDesktop />
            <HomeWhyChooseBucketlistt />
            <CreatorsSection />
            <ATOAIGuideLines />
            <CTA />
        </div>
    );
};
export default HomeRoutes;