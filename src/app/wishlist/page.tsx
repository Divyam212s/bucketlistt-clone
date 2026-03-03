import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import Wishlist from "@/components/HomePageRoutes/Wishlist/Wishlist";

export default function WishlistPage() {
    return (
        <main>
            <NavigationBar />
            <Wishlist />
            <Footer />
        </main>
    );
}
