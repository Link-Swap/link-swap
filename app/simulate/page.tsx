import { PageHeader } from "@/components/core/components/page-header";
import { FunctionSimulator } from "@/components/core/pages/functions-playground";

export default function Home() {
  return <div className="container">
    <PageHeader message="Functions Stimulator" />
    <FunctionSimulator />
  </div>
}
