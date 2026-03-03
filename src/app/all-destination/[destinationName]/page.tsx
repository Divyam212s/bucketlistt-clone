import type { Metadata } from "next";
import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import DestinationLocation from "@/components/OtherRoutes/DestinationLocation/DesktopComponent/DestinationLocation";
import TopActivitiesCardsGrid from "@/components/OtherRoutes/TopActivitiesCardsGrid/DesktopComponent/TopActivitiesCardsGrid";
import AllVendors from "@/components/OtherRoutes/AllVendors/AllVendors";

type Props = { params: Promise<{ destinationName: string }> };

function slugToTitle(slug: string): string {
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { destinationName } = await params;
    const title = slugToTitle(destinationName);
    return {
        title: `${title} | Bucketlistt Adventures`,
        description: `Explore adventure sports and experiences in ${title}. Curated bucket-list activities.`,
    };
}

export default async function DestinationNamePage({ params }: Props) {
    await params;
    return (
        <main>
            <NavigationBar />
            <DestinationLocation />
            <TopActivitiesCardsGrid />
            <AllVendors />
            <Footer />
        </main>
    );
}
