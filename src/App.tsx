import { Graph } from "@/components/parts/graph";
import { Header } from "@/components/parts/header";
import { AreaSelector } from "@/components/parts/selector/area-selector";
import { useAreas } from "@/components/parts/selector/hooks/use-areas";

function App() {
  const { areas, selectedArea, setSelectedArea } = useAreas();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center w-full p-4">
      <Header />

      <AreaSelector
        areas={areas}
        value={selectedArea}
        onValueChange={setSelectedArea}
      />

      <Graph selectedArea={selectedArea} />
    </div>
  );
}

export default App;
