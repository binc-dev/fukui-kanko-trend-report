import { DateRangePicker } from "@/components/parts/date-range-picker";
import { Graph } from "@/components/parts/graph";
import { Header } from "@/components/parts/header";
import { AreaSelector } from "@/components/parts/selector/area-selector";
import { TimeUnitSelector } from "@/components/parts/selector/time-unit-selector";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChartSettingsProvider,
  useChartSettings,
} from "@/context/ChartSettingsContext";

function MainContent() {
  const { isComparison, setIsComparison } = useChartSettings();

  return (
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
              id="comparison"
              checked={isComparison}
              onCheckedChange={(checked) => setIsComparison(!!checked)}
              className="
            bg-white 
            border-[#6eba2c] 
            hover:bg-gray-100 
            data-[state=checked]:bg-[#6eba2c]
            data-[state=checked]:border-[#6eba2c]
            data-[state=checked]:text-white"
            />
            <label htmlFor="comparison">2期間比較</label>
          </div>
        </div>
        <div className=" items-center ">
          <div className="flex flex-row w-full justify-around gap-3.5">
            <DateRangePicker variant="primary" />

            {isComparison && <DateRangePicker variant="comparison" />}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-4 w-full ">
        <Graph variant="primary" />
        {isComparison && <Graph variant="comparison" />}
      </div>
    </div>
  );
}

function App() {
  return (
    <ChartSettingsProvider>
      <MainContent />
    </ChartSettingsProvider>
  );
}

export default App;
