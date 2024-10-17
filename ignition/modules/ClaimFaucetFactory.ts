import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimFaucetFactoryModule = buildModule("ClaimFaucetFactoryModule", (c) => {
  const claimFaucetFactory = c.contract("ClaimFaucetFactory");

  return { claimFaucetFactory };
});

export default ClaimFaucetFactoryModule;


// ClaimFaucetFactoryModule#ClaimFaucetFactory - 0xA6bF95929E0caCc9bAA443b489AFc6B62257bB83