import HomeRoutes from "@/components/HomePageRoutes/HomeRoutes/HomeRoutes";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";


export default function Home() {
  return (
    <main>
      <NavigationBar />
      <HomeRoutes />
      <Footer />
    </main>
  );
}
