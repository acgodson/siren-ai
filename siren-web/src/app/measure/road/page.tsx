import { Metadata } from "next";
import { trpc } from "@/trpc/server";
import Dashboard from "@/lib/Measurement";

// Default metadata for road monitoring
const defaultRoadMetadata = {
  title: "Road Monitoring | Siren",
  description:
    "Turn your rides into rewards. Measure noise levels on the road and earn rewards on Siren's decentralized sensor network.",
  openGraph: {
    images: [
      {
        url: "https://sirenwatch.x,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,yz/bus.jpg",
        width: 1200,
        height: 630,
        alt: "Siren Road Monitoring",
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: { id?: string };
}): Promise<Metadata> {
  // If there's no ID, return the default road monitoring metadata
  if (!params.id) {
    return {
      ...defaultRoadMetadata,
      openGraph: {
        type: "website",
        url: "https://sirenwatch.xyz/measure/road",
        siteName: "Siren Network",
        title: defaultRoadMetadata.title,
        description: defaultRoadMetadata.description,
        images: defaultRoadMetadata.openGraph.images,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultRoadMetadata.title,
        description: defaultRoadMetadata.description,
        creator: "@Siren_watch",
        images: [defaultRoadMetadata.openGraph.images[0].url],
      },
    };
  }

  try {
    // If there's an ID, fetch the specific road data
    const roadData: any | null = await trpc.getRoadData({ id: params.id });

    if (!roadData) {
      return defaultRoadMetadata;
    }

    // Format location or other relevant data
    const formattedLocation = `${roadData.area}, ${roadData.city}`;
    const measurementDate = new Date(roadData.timestamp).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

    return {
      title: `${formattedLocation} Road Noise Data | Siren`,
      description: `real-time noise levels and environmental data for ${formattedLocation}. Data collected on ${measurementDate} through Siren's decentralized sensor network.`,
      openGraph: {
        type: "website",
        url: `https://sirenwatch.xyz/measure/road/${params.id}`,
        siteName: "Siren Network",
        title: `${formattedLocation} Road Noise Data | Siren`,
        description: `real-time noise levels and environmental data for ${formattedLocation}. Data collected on ${measurementDate} through Siren's decentralized sensor network.`,
        images: defaultRoadMetadata.openGraph.images,
      },
      twitter: {
        card: "summary_large_image",
        title: `${formattedLocation} Road Noise Data | Siren`,
        description: `View real-time noise levels and environmental data for ${formattedLocation}. Data collected on ${measurementDate} through Siren's decentralized sensor network.`,
        creator: "@Siren_watch",
        images: [defaultRoadMetadata.openGraph.images[0].url],
      },
    };
  } catch (error) {
    // If there's an error fetching data, fallback to default metadata
    return defaultRoadMetadata;
  }
}

export default async function RoadPage({
  params,
}: {
  params: { id?: string };
}) {
  // Your page component logic here
  return <Dashboard />;
}
