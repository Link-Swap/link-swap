import { PageHeader } from "@/components/core/components/page-header";
import { CCIPDataBuilder } from "@/components/core/pages/ccip-data-builder";

export default function Home() {
  return <div className="container">
    <div className="my-8">
      <PageHeader message="CCIP Data Builder" />
      <div className="text-grayscale-300">
        These are not testnet representations of assets. Instead, they are LinkSwap
        Tokens designed to help you understand and experiment with LinkSwap&apos;s Cross Chain transfer
        and token swap functionalities. <b>These tokens have no value.</b>
      </div>
    </div>
    <CCIPDataBuilder />
  </div>
}
