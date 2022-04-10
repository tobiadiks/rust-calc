import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";

import { RustCalc } from "../target/types/rust_calc";

describe('rust-calc', () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.RustCalc as Program<RustCalc>;

  it('Creates a calculator', async () => {
    await program.rpc.create("Welcome to SolCalc", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [calculator]
    });

    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.greeting === "Welcome to SolCalc")

  });


  it("Adds two numbers", async function () {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "Welcome to SolCalc");
  });

  it('Multiplies two numbers', async function () {
    await program.rpc.multiply(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(6)));
    assert.ok(account.greeting === "Welcome to SolCalc");
  })

  it('Subtracts two numbers', async function () {
    await program.rpc.subtract(new anchor.BN(3), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(1)));
    assert.ok(account.greeting === "Welcome to SolCalc");
  })

  it('Divides two numbers', async function () {
    await program.rpc.divide(new anchor.BN(7), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(3)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
    assert.ok(account.greeting === "Welcome to SolCalc");
  });
});


