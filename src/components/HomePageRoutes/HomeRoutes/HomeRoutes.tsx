import HeroHomeDesktopComponent from "../HeroHome/DesktopComponent/DesktopComponent";
import HeroDesktopDestinationsCards from "../HeroDestinationsCards/DesktopComponent/HeroDesktopDestinationsCards";
import BestSellersDesktop from "../BestSellers/DesktopComponent/BestSellersDesktop";
import HomeReviewDesktop from "../HomeReview/DesktopComponent/HomeReviewDesktop";
import HomeWhyChooseBucketlistt from "../HomeWhyChoose/DesktopComponent/HomeWhyChooseBucketlistt";
import ATOAIGuideLines from "../ATOAIGuideLines/DesktopComponent/ATOAIGuideLines";
const HomeRoutes = () => {
    return (
        <div>
            <HeroHomeDesktopComponent />
            <HeroDesktopDestinationsCards />
            <BestSellersDesktop />
            <HomeReviewDesktop />
            <HomeWhyChooseBucketlistt />
            <ATOAIGuideLines />
        </div>
    );
};
export default HomeRoutes;