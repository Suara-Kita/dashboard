import BackgroundWrapper from "@/components/BackgroundWrapper";
import ColumnMap from "@/components/ColumnMap";
import ColumnIncomingFeed from "@/components/ColumnIncomingFeed";
import ColumnLayers from "@/components/ColumnLayers";

export default function DashboardPage() {
  return (
    <>
      <BackgroundWrapper>
        <ColumnMap />
      </BackgroundWrapper>
      <main className="fixed inset-0 z-10 flex gap-0 p-2">
        <div className="w-full h-full flex p-lg gap-4 overflow-hidden pt-16">
          <ColumnIncomingFeed />
          {/*<ColumnLayers />*/}
        </div>
      </main>
    </>
  );
}
