import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import DestinationLocation from "@/components/OtherRoutes/DestinationLocation/DesktopComponent/DestinationLocation";
import TopActivitiesCardsGrid from "@/components/OtherRoutes/TopActivitiesCardsGrid/DesktopComponent/TopActivitiesCardsGrid";

export default function AllDestinationPage() {
    return (
        <main>
            <NavigationBar />
            <DestinationLocation />
            <TopActivitiesCardsGrid />
            <Footer />
        </main>
    );
}
