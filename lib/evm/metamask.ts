export const hasMetamask = () => {
    return window.ethereum;
}

export const getChainId = async () => {
    if (!hasMetamask()) {
        return;
    }

    const chainId = await window.ethereum?.request({ method: "eth_chainId" }) as any;
    return parseInt(chainId, 16).toString();
}

export const getAccount = async () => {
    if (!hasMetamask()) {
        return;
    }

    const accounts = await window.ethereum?.request({ method: "eth_requestAccounts" })
        .catch((err) => {
            if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error.
                // If this happens, the user rejected the connection request.
                console.log("Please connect to MetaMask.");
            } else {
                console.error(err);
            }
        }) as any;

    const account = accounts[0];
    return account;
}