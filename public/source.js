/**
 * Playground: https://functions.chain.link/playground
 * Arguments: 
 *  - destinationChain: The destination chain to which the CCIP data will be sent
 *  - ccipData: The CCIP data to be sent to the destination chain
 */
const ccipData = args[0]
const destinationChain = args[1]

const apiResponse = await Functions.makeHttpRequest({
    url: `https://link-swap.vercel.app/api/functions`,
    method: "POST",
    data: {
        "ccipData": ccipData,
        "destination": destinationChain,
    }
})

if (apiResponse.error) {
    console.error(apiResponse.error)
    throw Error("Request failed", apiResponse.error)
}

const { data } = apiResponse;

console.log('API response data:', JSON.stringify(data, null, 2));

return Functions.encodeString(data.result)