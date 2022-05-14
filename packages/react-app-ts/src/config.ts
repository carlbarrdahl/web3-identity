import Registry from "contracts/Registry.json";
import Identity from "contracts/Identity.json";

export const contractAddresses = {
  31337: {
    registry: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    identity: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    erc20: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    erc721: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  },
  4: {
    registry: "0x7235B905fB7BfFF3d089EC0aACC384cA72a7088A",
    identity: "0x891d84Db39076Ec561Ac8AeA721AE943044C509f",
  },
  10: {
    registry: "0x499Fa72B33e6a191CA8F90ce24A0b6741fAD2FFC",
    identity: "0xe22e52d958Dac23419023F04fCe26959aaDa25e3",
  },
};

export const contractTypes = {
  registry: Registry.abi,
  identity: Identity.abi,
};

export const alchemy = {
  apiKey: "YaEs2qJRHnULbXiSQBb2_7O64xlID2_Y",
};
