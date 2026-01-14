import { DateRangePicker } from "@/components/parts/date-range-picker";
import { Graph } from "@/components/parts/graph";
import { Header } from "@/components/parts/header";
import { AreaSelector } from "@/components/parts/selector/area-selector";
import { TimeUnitSelector } from "./components/parts/selector/time-unit-selector";
import { ChartSettingsProvider } from "./context/ChartSettingsContext";

function App() {
  return (
    <ChartSettingsProvider>
      <div className="flex flex-col min-h-screen items-center justify-center w-full p-4">
        <Header />

        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-[68px]">
            <AreaSelector />
            <TimeUnitSelector />
          </div>
          <div className="flex flex-row items-center gap-[68px]">
            <DateRangePicker />
          </div>
        </div>

        <Graph />
      </div>
    </ChartSettingsProvider>
  );
}

export default App;
