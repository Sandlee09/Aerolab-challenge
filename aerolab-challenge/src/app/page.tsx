"use client";

import { CollectionGrid } from "@/components/CollectionGrid";
import { SearchInput } from "@/components/SearchInput";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex-1 block md:hidden">
        <SearchInput />
      </div>
      <div className="mt-8">
        <CollectionGrid />
      </div>
    </div>
  );
}
