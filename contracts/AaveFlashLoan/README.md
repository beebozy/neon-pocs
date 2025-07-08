Here’s a clean, professional, and well-structured **`README.md`** you can use for your project:

---

````markdown
# 💸 Aave Flash Loan Composability on Neon EVM (POC)

This is a **Proof of Concept (POC)** demonstrating the integration of **Aave V3 Flash Loans** on the **Neon EVM** with **composable instructions executed on Solana**, such as Orca swaps. The key idea is to use borrowed funds from Aave within the same transaction to interact with Solana-based DeFi protocols via Neon’s `ICallSolana` precompile.

> 🧪 Live Demo Tx: [View on Neon Devnet Block Explorer](https://neon-devnet.blockscout.com/tx/0xd92dfe6810b9af5bb68da601c7651ebeb5cb802cdb89a03e26b37d70635f9896)

---

## 📌 Features

- Request a **flash loan** from Aave V3 on Neon EVM.
- Transfer the borrowed tokens to the contract’s **Associated Token Account (ATA)** on Solana.
- Execute composable instructions on Solana using `CALL_SOLANA.execute(...)`.
- Use flash loaned funds in **Orca Whirlpool** swaps (USDC ⇄ SAMO).
- Repay the loan plus premium in the same transaction.
- Track flash loan usage and apply **user-level premium discounts**.

---

## 🏗️ Project Architecture

```plaintext
📦 Neon EVM
 ├── AaveFlashLoan.sol     ← Flash loan logic + Solana execution
 ├── IERC20ForSpl.sol      ← ERC20-compatible SPL interface
 └── ICallSolana.sol       ← Precompile interface for Solana calls

📦 Solana (via Anchor + Web3.js)
 └── Orca Whirlpool SDK    ← Builds swap instructions for USDC/SAMO pools
````

---

## ⚙️ Core Smart Contract

### `AaveFlashLoan.sol`

```solidity
function flashLoanSimple(
    address token,
    uint256 amount,
    bytes memory instructionData1,
    bytes memory instructionData2
) public {
    bytes memory params = abi.encode(instructionData1, instructionData2);

    POOL.flashLoanSimple(
        address(this),
        token,
        amount,
        params,
        uint16(0)
    );
}
```

During callback in `executeOperation()`, Solana instructions are executed using:

```solidity
CALL_SOLANA.execute(0, instructionData1);
CALL_SOLANA.execute(0, instructionData2);
```

---

## 🆕 Additional Feature: Flash Loan Discount Mechanism

To encourage user engagement, a discount system is implemented for flash loan fees:

```solidity
function flashLoanWithDiscount(
    address token,
    uint256 amount,
    bytes memory instructionData1,
    bytes memory instructionData2
) external {
    bytes memory params = abi.encode(instructionData1, instructionData2);
    uint16 premium = _calculatePremiumWithDiscount(msg.sender);
    
    POOL.flashLoanSimple(
        address(this),
        token,
        amount,
        params,
        premium
    );

    userFlashCount[msg.sender]++;
}
```

**Discount Calculation:**

```solidity
function _calculatePremiumWithDiscount(address user) internal view returns(uint16) {
    uint16 basePremium = 0;
    uint16 discount = userDiscount[user];
    return basePremium * (100 - discount) / 100;
}
```

---

## 🧪 Test Setup (Hardhat + Solana)

The project includes a test suite that:

* Deploys the contract to Neon EVM.
* Builds Orca Whirlpool swap instructions on Solana using `@orca-so/whirlpools-sdk`.
* Sends USDC to the contract to fund fee repayment.
* Executes a flash loan and swaps USDC → SAMO → USDC.

### 🛠 Notable Libraries Used

* `@orca-so/whirlpools-sdk`
* `@solana/web3.js`
* `@coral-xyz/anchor`
* `ethers`
* `hardhat`

### 🌍 Environment Variables

Ensure these are set:

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
ANCHOR_WALLET=./id.json
```

---

## 🚀 How to Run Locally

1. **Clone repo & install deps**

```bash
git clone <this-repo>
cd aave-flashloan-composability
npm install
```

2. **Add your Solana wallet to `id.json`**

3. **Set environment**

```bash
export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
export ANCHOR_WALLET=./id.json
```

4. **Compile & test**

```bash
npx hardhat compile
npx hardhat test test/AaveFlashLoan/AaveFlashLoan.js --network neondevnet
```

---

## 🔗 References

* [Aave V3 Docs](https://docs.aave.com/)
* [Neon EVM Docs](https://docs.neonfoundation.io/)
* [Orca Whirlpool SDK](https://github.com/orca-so/whirlpools)
* [Solana Precompiles in Neon](https://neonlabs.org/docs)

---

## 👨‍💻 Author

> 🧠  Expanded by [@beebozy](https://github.com/beebozy)

---

## 📝 License

[MIT](./LICENSE)

```


```
