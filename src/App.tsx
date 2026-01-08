import { Graph } from "@/components/parts/graph";
import { Header } from "@/components/parts/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center w-full p-4">
      <Header />
      <Select>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <Graph />
    </div>
  );
}

export default App;
