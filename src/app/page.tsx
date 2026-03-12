import { getAllReferencesSortedByDate, getFeaturedReferences } from "@/lib/references";
import { BrowseClient } from "@/components/browse-client";

export default function HomePage() {
  const references = getAllReferencesSortedByDate();
  const featured = getFeaturedReferences();

  return <BrowseClient references={references} featured={featured} />;
}
