import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import OfflineBookingForm from "@/components/HomePageRoutes/OfflineBooking/OfflineBookingForm";

export default function OfflineBookingPage() {
  return (
    <main>
      <NavigationBar />
      <OfflineBookingForm />
      <Footer />
    </main>
  );
}
