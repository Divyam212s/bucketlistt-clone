import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import AllBookings from "@/components/HomePageRoutes/AllBookings/AllBookings";

export default function BookingsPage() {
    return (
        <main>
            <NavigationBar />
            <AllBookings />
            <Footer />
        </main>
    );
}