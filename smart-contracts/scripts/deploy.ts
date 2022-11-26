import { run, ethers } from "hardhat";

const wait = (time: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};


const verifyContract = async (address: string, constructorArguments: any[]) => {
    try {
        await run("verify:verify", {
            address,
            constructorArguments,
        });
    } catch (e) {
        console.log(`Failed to verify Contract ${address} `, e);
    }
};

async function deployCoreContracts() {
    const [deployer] = await ethers.getSigners();

    console.log("Deployer:", deployer.address);

    const FundMe = await ethers.getContractFactory("FundMe");

    console.log("Deploying FundMe...");
    const fundMeContractDeploy = await FundMe.deploy({});
    await fundMeContractDeploy.deployed();
    console.log("FundMe deployed to:", fundMeContractDeploy.address);
    await wait(50000);


    await verifyContract(fundMeContractDeploy.address, []);
}

deployCoreContracts();

