# Secret Auction Demo

### Start Docker

```
cd enigma-docker-network
./launch.bash -s
```

### Copy Enigma to 2_deploy_millionaires_problem_factory.js
```
  Enigma: 0x767d422364eC67f71C148C47DE96F09ffDd6f367
```

```
// TODO: Update the enigma address
const enigmaAddr = "0x767d422364eC67f71C148C47DE96F09ffDd6f367";
```

### truffle migrate

```
cd Secret-Auction-Demo
darq-truffle migrate --reset --network development
```

### Copy auction factory address to index.js
```
AuctionFactory: 0x7E4d7e0dfAb355d88bE20475B1a423C1F85048E7
```

```
// TODO: Replace with your AuctionFatcory address here
const auctionFactoryContractAddress = "0x7E4d7e0dfAb355d88bE20475B1a423C1F85048E7";
```

Refer to [tutorial](https://github.com/PortalNetwork/enigma-ns/blob/master/docs/tutorial/Secret_Auction.md).

### Install dependency

- Preinstall: babel-node

```
npm install --global babel-cli
```

### Run the test

```
babel-node src/index.js
```

### Result 

```
registering principal 0x9F1419E9c80d3730c362e5912dC66Ad7AFB78828
updating workers parameters with seed 71097
network using random seed: 71097

======================================================

Enigma Secret Auction

This demo shows three user using Enigma Secret Auction
to start an auction and encrypt the bid value.
After the bid process finished, get the winner from
the auction contract.

======================================================

==== 1. Setup enigma ====
==== 2. Create auction with expired time (86400) and starting price (500000) ====
==== 3. Get auction factory address list ====
==== 4. Get latest auction address ====
==== 5. Send 8000000 from 0x598f374876dB65CFfA646daaE4De98Ee349C8Db5 to stake pool ====
==== 6. Send 9000000 from 0x318d3dAdDa3F0DccE6fB9a03c7266e2432A579B1 to stake pool ====
==== 7. Send 10000000 from 0x44Db3182F29187F6B73e590f007818263e8cFa21 to stake pool ====
==== 8. Ecrypt bidding value of 1000000 to 4e0702869a0e57ec716574494d6ef83999cdd56495961e890b966d82cbd89954655227 from 0x598f374876dB65CFfA646daaE4De98Ee349C8Db5 ====
==== 9. Ecrypt bidding value of 5000000 to 68d716655041f70eeada9f8869359f4474c23aec25379ce979ea04a7350c3d5d3aac08 from 0x318d3dAdDa3F0DccE6fB9a03c7266e2432A579B1 ====
==== 10. Ecrypt bidding value of 9000000 to 1f30ec595e3e6b38db1ae8f5a8bd2d37394ab86286e31f18ab1c9200fc9f1d7bddbf0d from 0x44Db3182F29187F6B73e590f007818263e8cFa21 ====
==== 11. List bidders ====
[ '0x598f374876db65cffa646daae4de98ee349c8db5',
  '0x318d3dadda3f0dcce6fb9a03c7266e2432a579b1',
  '0x44db3182f29187f6b73e590f007818263e8cfa21' ]
==== 11. Create task with parameter
==== 12. Compute by enigma ====
==== 13. After auction listen the winner ====
result:  { logIndex: 1,
  transactionIndex: 0,
  transactionHash: '0x5392efafc6485afc9a2239d3e997ea30c9ceb96ba3fb5c9a4d23f747400e16c3',
  blockHash: '0x38a06e0de0aecfec7a8589de62725169f49a6937231e5398016387df953a24d2',
  blockNumber: 257,
  address: '0x48e693b150e686aafa9ff1ec745049e6419aa9e6',
  type: 'mined',
  event: 'Winner',
  args:
   { winner: '0x44db3182f29187f6b73e590f007818263e8cfa21',
     bidValue: BigNumber { s: 1, e: 16, c: [Array] } } }
==== 14. winner: 0x44db3182f29187f6b73e590f007818263e8cfa21 ====
```
