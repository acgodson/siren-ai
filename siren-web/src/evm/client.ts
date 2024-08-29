export async function assignPoints(userAddress: string) {
  try {
    const response = await fetch("/api/contract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method: "assignPoints", args: [userAddress] }),
    });

    if (!response.ok) {
      throw new Error("Failed to assign points");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error assigning points:", error);
    throw error;
  }
}

export const mockZKProof = async (
  locationData: any[],
  log: any,
  toast: any
) => {
  try {
    log("Starting ZK-proof verification");
    const firstLocation = locationData[0];
    const lastLocation = locationData[locationData.length - 1];
    const input = {
      lat1: firstLocation.lat,
      lon1: firstLocation.lng,
      lat2: lastLocation.lat,
      lon2: lastLocation.lng,
    };
    log("ZK-proof input prepared");

    // Simulating proof generation and verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    log("ZK-proof verification skipped (demo mode)");
    toast({
      title: "Warning",
      description:
        "ZK-proof skipped for demo. In production, no points would be assigned without verification.",
      status: "warning",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
    return true;
  } catch (error: any) {
    log(`Error in ZK-proof: ${error.message}`);
    return false;
  }
};
