import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import Users from "@/components/HomePageRoutes/Users/Users";

export default function UsersPage() {
    return (
        <main>
            <NavigationBar />
            <Users />
            <Footer />
        </main>
    );
}
