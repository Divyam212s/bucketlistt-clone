import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import ActivityGallery from "@/components/OtherRoutes/ActivityGallery/DesktopComponent/ActivityGallery";
import ActivityContent, { type ActivityOption } from "@/components/OtherRoutes/ActivityContent/DesktopComponent/ActivityContent";

const ACTIVITY_OPTIONS: ActivityOption[] = [
    { id: "1", title: "Valley Rope Jump / Cut chord rope (Couple)", detail: "83M · Enjoy thrilling 83 Meter jump. Video charges extra.", originalPrice: 6800, price: 6400 },
    { id: "2", title: "Bungy Jump / Valley Rope Jump / Cut chord rope + Flying Fox (Tandem)", detail: "Fly side by side at 140 km/hr – pure thrill in the skies.", originalPrice: 5200, price: 4900 },
    { id: "3", title: "Bungy Jump + Flying Fox (Tandem) + Valley Rope Jump / Cut chord rope", detail: "Ultimate combo. Video charges extra.", originalPrice: 8500, price: 7900 },
    { id: "4", title: "The OG Bungy Jump", detail: "83M · Classic bungy. Video charges extra.", originalPrice: 3700, price: 3330 },
    { id: "5", title: "Valley Cut Rope Jump", detail: "Ultimate adrenaline rush as your cord is cut mid-air.", originalPrice: 2000, price: 1900 },
    { id: "6", title: "Flying Fox (Tandem or triple ride)", detail: "Fly at 140 km/hr – share the thrill.", originalPrice: 3500, price: 3200 },
    { id: "7", title: "Flying Fox – Solo", detail: "Just you, the wind, and the valley below.", originalPrice: 2800, price: 2600 },
    { id: "8", title: "Bungy Jump + Valley Rope Jump / Cut chord rope", detail: "83M · Double jump experience.", originalPrice: 5500, price: 5100 },
];

export default function ActivityPage() {
    return (
        <main>
            <NavigationBar />
            <ActivityGallery
                title="Apple Country Resorts - A Vegetarian Place"
                destinationName="Rishikesh"
                destinationHref="/destination"
                rating={4.9}
                reviewCount={1283}
                location="Log Huts Area, Manali, Himachal Pradesh, 175131"
                mainImageUrl="https://images.unsplash.com/photo-1549221360-456a9c197d5b?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                secondaryImageUrls={[
                    "https://images.unsplash.com/photo-1549221360-456a9c197d5b?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1549221360-456a9c197d5b?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400&auto=format&fit=crop",
                ]}
            />
            <ActivityContent
                activities={ACTIVITY_OPTIONS}
                sectionTitle="Select Activity"
                sidebarButtonLabel="Select Activity to Book"
                initialVisibleCount={6}
            />
            <Footer />
        </main>
    );
}