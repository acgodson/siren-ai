# Siren

- Aggregating road traffic noise on BnB Greenfield for verifiable AI insights on traffic noise pollution.

---

![decibelmeter](<siren-web/public/Screen Recording 2024-08-28 at 21.05.14.gif>)

### Submitting Verified Noise Data

```typescript
const handleSubmission = async () => {

    try {
      // Retrieves final location readings
      const finalLocationData = getFinalData();

      // Verifies ZK-proof with distance circuit
      const zkProofResult = await mockZKProof(finalLocationData);

      // Fetchs next unique object name from the contract
      const objectName = await readContract("getUniqueObjectName", []);

      // Uploads location data to Greenfield
      await uploadJsonObject(objectName, finalLocationData);

      // Assigns reward points to the user
      const finalRes = await assignPoints(wallets[0].address);
     ....
```

### Getting Started

1. **Compile Noir Circuit and Install Dependencies:**

   ```bash
   npm run prebuild
   ```

2. **Start the Local Server:**

   ```bash
   npm run dev
   ```

---

### Contracts

Storage Admin: [0x6945ee254481302ad292dfc8f7f27c4b065af96d](https://testnet.greenfieldscan.com/account/0x6945ee254481302ad292dfc8f7f27c4b065af96d)
Rewards Manager : [0xbf94824916373d2b007741112594B37FAb0370A1](https://testnet.bscscan.com/address/0xbf94824916373d2b007741112594B37FAb0370A1)
Reward Token : [0x7BE1c460097828F5c6d04B8f2c07d2c0b80FBdd9](https://testnet.bscscan.com/address/0x7BE1c460097828F5c6d04B8f2c07d2c0b80FBdd9)
