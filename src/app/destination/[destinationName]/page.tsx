import { redirect } from "next/navigation";

type Props = { params: Promise<{ destinationName: string }> };

export default async function DestinationNameRedirect({ params }: Props) {
    const { destinationName } = await params;
    redirect(`/all-destination/${destinationName}`);
}
