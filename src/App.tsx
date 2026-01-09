import { Graph } from "@/components/parts/graph";
import { Header } from "@/components/parts/header";
import { AreaSelector } from "@/components/parts/selector/area-selector";
import { useAreas } from "@/components/parts/selector/hooks/use-areas";
import type { TimeUnit } from "@/types/types";
import { useState } from "react";
import { TimeUnitSelector } from "./components/parts/selector/time-unit-selector";

function App() {
  const { areas, selectedArea, setSelectedArea } = useAreas();
  const [selectedTimeUnit, setSelectedTimeUnit] = useState<TimeUnit>("day");

  return (
    <div className="flex flex-col min-h-screen items-center justify-center w-full p-4">
      <Header />

      <div className="flex flex-row items-center gap-17">
        <AreaSelector
          areas={areas}
          value={selectedArea}
          onValueChange={setSelectedArea}
        />

        <TimeUnitSelector
          value={selectedTimeUnit}
          onValueChange={setSelectedTimeUnit}
        />
      </div>

      <Graph selectedArea={selectedArea} selectedTimeUnit={selectedTimeUnit} />
    </div>
  );
}

export default App;
