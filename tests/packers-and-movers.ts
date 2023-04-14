import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PackersAndMovers } from "../target/types/packers_and_movers";
import { assert } from "chai";
const {SystemProgram} = anchor.web3;

describe("Testing our messaging app: ", function() {
  const accountInfo = {
    name: "Riktam Santra",
    address: "addr",
    role: "customer",
  }
  const delivery = {
    created_at: "00.00.00T00:00:00.343",
    departed_at: "00.00.00T00:00:00.343",
    starting_from: {
      address: "addr",
      location: {
        lat: 1234,
        lon: 5678
      }
    },
    checkpoints: [
      {
        address: "addr",
        location: {
          lat: 1234,
          lon: 5678
        }
      }
    ]
  }
  const provider = anchor.AnchorProvider.env();
  const baseAccount = anchor.web3.Keypair.generate();

  anchor.setProvider(provider);
  const program = anchor.workspace.PackersAndMovers as Program<PackersAndMovers>;
  it("An account is initialized", async function() {
    await program.methods.initialize(JSON.stringify(accountInfo)).accounts(
      {baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).signers([baseAccount]).rpc();
    assert(2 === 2);
  });

  it("Update the account previously created: ", async function() {
    await program.methods.update(JSON.stringify(delivery)).accounts({
      baseAccount: baseAccount.publicKey,
    }).rpc();
    assert(2 === 2);
  });

  it("Fetch details of previously created accounts: ", async function() {
    const account =await program.account.baseAccount.fetch(baseAccount.publicKey);
    const jsonReceived = {info: JSON.parse(account.data), deliveries: account.deliveries.map((e) => JSON.parse(e))};
    console.log(JSON.stringify(jsonReceived));
    assert(2 === 2);
  });
});
