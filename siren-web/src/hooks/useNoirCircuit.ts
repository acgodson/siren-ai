import { useState, useEffect } from "react";
import { Noir } from "@noir-lang/noir_js";
import { deserializeProof } from "@/utils";

export const useNoirCircuit = () => {
  const [BarretenbergBackend, setBarretenbergBackend] = useState<any>(null);
  const [noir, setNoir] = useState<any>(null);
  const [Verifier, setVerifier] = useState<any>(null);

  useEffect(() => {
    const loadWasmModules = async () => {
      await Promise.all([
        import("@noir-lang/noirc_abi/web/noirc_abi_wasm.js").then((module) =>
          module.default()
        ),
        import("@noir-lang/acvm_js/web/acvm_js.js").then((module) =>
          module.default()
        ),
      ]);
    };

    const loadBarretenbergModules = async () => {
      try {
        const module = await import("@noir-lang/backend_barretenberg");
        const response: any = await fetch(
          "/circuits/check_distance/target/check_distance.json"
        );
        if (response.ok) {
          const circuit = await response.json();
          const backend = new module.BarretenbergBackend(circuit);
          const _verifier = new module.BarretenbergVerifier(circuit);
          setVerifier(_verifier);
          setBarretenbergBackend(backend);
          const _noir = new Noir(circuit);
          setNoir(_noir);
        }
      } catch (error) {
        console.error("Error loading Barretenberg modules:", error);
      }
    };

    loadWasmModules()
      .then(loadBarretenbergModules)
      .catch((error) => {
        console.error("Error loading WASM modules:", error);
      });
  }, []);

  const generateProof = async (input: {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
  }) => {
    if (!noir || !BarretenbergBackend) {
      console.log("noir not initiated");
      return;
    }
    try {
      const { witness } = await noir.execute(input);
      const proof = await BarretenbergBackend.generateProof(witness);
      console.log("distance-prover", "✅ Proof generated");
      return proof;
    } catch (e) {
      console.log("error generating proof", e);
    }
  };

  const verifyProof = async (proof: string) => {
    if (!noir || !BarretenbergBackend || !Verifier) {
      console.log("noir or verifier not initiated");
      return;
    }
    try {
      const inputProof = deserializeProof(proof);
      const verificationKey = await BarretenbergBackend.getVerificationKey();
      const isValid = await Verifier.verifyProof(inputProof, verificationKey);
      if (isValid) {
        console.log("distance-verifier", "✅ Proof verified");
      } else {
        console.log("distance-verifier", "❌ Proof invalid");
      }
      return isValid;
    } catch (e) {
      console.log("error verifying proof", e);
    }
  };

  return { generateProof, verifyProof };
};
