# Secret Auction Demo

### Start Docker

```
cd enigma-docker-network
./launch.bash -t -s
```

### Copy Enigma to 2_deploy_....js
```
  Enigma: 0xac636c36942552147F863CC8F560974e221d29D9
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


Refer to [tutorial](https://github.com/PortalNetwork/enigma-ns/blob/master/docs/tutorial/Secret_Auction.md).