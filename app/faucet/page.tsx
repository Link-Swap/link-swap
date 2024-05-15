import { PageHeader } from "@/components/core/components/page-header";
import { FaucetComponent } from "@/components/core/pages/faucet-component";

export default function Home() {
  return <div className="container">
    <div className="my-8">
      <PageHeader message="Faucet" />
      <div className="text-grayscale-300">
        These are not testnet representations of assets. Instead, they are LinkSwap
        Tokens designed to help you understand and experiment with LinkSwap&apos;s Cross Chain transfer
        and token swap functionalities. <b>These tokens have no value.</b>
      </div>
    </div>
    <FaucetComponent />
  </div>
}
