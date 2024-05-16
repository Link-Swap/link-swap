import { PageHeader } from "@/components/core/components/page-header";
import { FunctionSimulator } from "@/components/core/pages/function-simulator";

export default function Home() {
  return <div className="container">
    <div className="my-8">
      <PageHeader message="Functions Simulator" />
      <div className="text-grayscale-300">
        Test calling functions on that would be used to validate transfer and swap token on
        Chainlink Functions.
      </div>
    </div>
    <FunctionSimulator />
  </div>
}
