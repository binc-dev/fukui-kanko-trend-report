import { DateRangePicker } from "@/components/parts/date-range-picker";
import { Graph } from "@/components/parts/graph";
import { Header } from "@/components/parts/header";
import { AreaSelector } from "@/components/parts/selector/area-selector";
import { TimeUnitSelector } from "./components/parts/selector/time-unit-selector";
import { Checkbox } from "./components/ui/checkbox";
import { ChartSettingsProvider } from "./context/ChartSettingsContext";

function App() {
  return (
    <ChartSettingsProvider>
      <div className="flex flex-col min-h-screen items-center w-full p-4">
        <Header />

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-center w-full mt-3">
            <div className="flex-1" />
            <div className="flex flex-row items-center gap-[68px] pl-4">
              <AreaSelector />
              <TimeUnitSelector />
            </div>
            <div className="flex-1 flex flex-row items-center gap-2 pl-4">
              <Checkbox
                id="terms"
                className="
            bg-white 
            border-[#6eba2c] 
            hover:bg-gray-100 
            data-[state=checked]:bg-[#6eba2c]
            data-[state=checked]:border-[#6eba2c]
            data-[state=checked]:text-white"
              />
              2期間比較
            </div>
          </div>
          <div className="flex flex-row items-center w-full">
            <div className="flex-1" />
            <div className="flex flex-row items-center gap-[68px] pl-2">
              <DateRangePicker />
            </div>
            <div className="flex-1 flex flex-row items-center gap-2 pl-2"></div>
          </div>
        </div>

        <Graph />
      </div>
    </ChartSettingsProvider>
  );
}

export default App;
