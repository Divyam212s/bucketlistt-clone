import type { Metadata } from "next";
import NavigationBar from "@/components/OtherRoutes/NavigationBar/DesktopComponent/NavigationBar";
import Footer from "@/components/OtherRoutes/Footer/DesktopComponent/Footer";
import ActivityGallery from "@/components/OtherRoutes/ActivityGallery/DesktopComponent/ActivityGallery";
import ActivityDetailContent from "@/components/OtherRoutes/ActivityContent/DesktopComponent/ActivityDetailContent";

type Props = {
    params: Promise<{ destinationName: string; activityName: string }>;
};

function slugToTitle(slug: string): string {
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { destinationName, activityName } = await params;
    const destination = slugToTitle(destinationName);
    const activity = slugToTitle(activityName);
    return {
        title: `${activity} in ${destination} | Bucketlistt Adventures`,
        description: `Book ${activity} in ${destination}. Curated adventure experiences and activities.`,
    };
}

export default async function ActivityDetailPage({ params }: Props) {
    const { destinationName, activityName } = await params;
    const destinationTitle = slugToTitle(destinationName);
    const activityTitle = slugToTitle(activityName);

    return (
        <main>
            <NavigationBar />
            <ActivityGallery
                title={`${activityTitle} – ${destinationTitle}`}
                destinationName={destinationTitle}
                destinationHref={`/all-destination/${destinationName}`}
                rating={4.9}
                reviewCount={1283}
                location={`${destinationTitle}, India`}
                mainImageUrl="https://images.unsplash.com/photo-1549221360-456a9c197d5b?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                secondaryImageUrls={[
                    "https://images.unsplash.com/photo-1549221360-456a9c197d5b?q=80&w=2074&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400&auto=format&fit=crop",
                ]}
            />
            <ActivityDetailContent sidebarButtonLabel="Book this activity" />
            <Footer />
        </main>
    );
}
