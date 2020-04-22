# Machine Culture Empirica

_This project was generated with [create-empirica-app](https://github.com/empiricaly/create-empirica-app)._

## Getting started

### Setup

To build this app a custom verison of the `empirica-core` is required.

```
git clone git@github.com:LBrinkmann/meteor-empirica-core.git
```
The path to this repository needs to be added as a environment variable.
```
export METEOR_PACKAGE_DIRS=/path/to/folder/containing/empirica/core
```

```
meteor npm install
```

### Run locally
To run this project locally:
```
meteor --settings local.json
```

## Introduction

See also: https://docs.google.com/presentation/d/1WeNTlvzua9MRpHEa1imxPuRFjh-6oa3Aq1bhDpM9vlQ/edit?usp=sharing

The objective of this application is to study cultural evolution, expecially when 
machines and humans co-develop.
We study the play of different games. Within the games different actions do have
different rewards. The objective of the player is to maximise his total reward.
Each game can have different settings, which in general are randomly generated. 
A specific setting is called `environment`.   

To mimic cultural evolution, we are running series of game rounds, where in each 
round a player see the solution of a previous player. She is then invited to 
give her own solution and potential improve on it. A Series of game rounds, 
in which information passed on, is called a `chain`. Within a chain the games is
played with the same environment. 

Each chain has the same number of game rounds (`lengthOfChain`). At an specific
position in the chain a machine can be inserted (`positionOfMachineSolution`),
if the chain is supposed to have a machine solution (`chainsHaveMachineSolution`).
In this case the environment, solution of the previous player, as well as, the
`machineSolutionModelName` is send to a seperate endpoint, which will return
its (machine) solution.

Similarly for the first round within a chain, the same endpoint is requested for a 
starting solution to be presented as the previous solution (`startingSolutionModelName`).

### Mapping on empirica concepts

* **empirica batch** is a collection of games. Upon creation a defined number of chains is generated (see below). 
These chains are fetched during gameplay on demand. 
* **empirica game** Each player has his own empirica game. For this reason, the number of games should be as large as the maximum number of player expected.
* **empirica round** The game has `numberOfRounds` rounds, plus 2 practice rounds. On each each round, a new chain is selected for the player to play. It is ensured, that never two player can play the same chain simultaniously and that never the same player is playing the same environment twice
* **empirica stage** Each game has three stages. In the planing stage the player is time to plan his moves (`planningStageDurationInSeconds`). In the response stage she has time to enter a solution (`responseStageDurationInSeconds`). Finally there is a 5 second phase to review the reward recieved.

### Empirica Factors

The factors described previously and a few more can be controlled by empirica.
There are two type of factors. Global factors are the same for all chains. Then there are chain factors. These factors can be different for different chains.

If the batch has only one treatment, then for each environment `numberOfChainsPerEnvironment` chains are created.

If the same batch has multiple treatments, then for each environment and each treatment `numberOfChainsPerEnvironment` chains are created. E.g. if there are three treatments, 80 environments and `numberOfChainsPerEnvironment: 2`, then `3 x 80 x 2` chains are created.

Note: Each player can only play once each environment.

#### Global

- playerCount (int) - should be 1
- numberOfRounds (int) - maximum number of rounds each player is playing
- experimentName (string) - used for selecting the right environments
- numberOfChainsPerEnvironment (int) - number of chains for each environment and treatment to be created
- lengthOfChain (int) - number of player (human or machine) sequentially playing in a chain (not including the starting solution)
- debug (bool) - shorter intro for debugging
- planningStageDurationInSeconds (int)
- responseStageDurationInSeconds (int)

#### Per Chain

- positionOfMachineSolution (int) - position in chain in which the machine solution is entered
- startingSolutionModelName (string) - model name used for the starting solution
- machineSolutionModelName (string) - model name used for the machine solution
- chainsHaveMachineSolution (boolean) - flag to indicate if the chain should have a machine solution


### Architecture

Three main components:

- Empirica
  - Empirica Core
  - Empirica Reward Networks (this repository)
- Mongo Database
- Machine Backend

### Empirica

Empirica consist of the empirica core (https://github.com/empiricaly/meteor-empirica-core). We
use a slightly modified version (https://github.com/LBrinkmann/meteor-empirica-core). Most
of the custom code of empirica is in the empirica folder within this repro. Empirica
contains both, the frontend and the backend of the empirica app.

### Mongo Database

All data from empirica, as well as our custom extension are stored in a mongo database. All environments for an experiment have to be uploaded to the database before they can be used.

#### Connection

##### Setup

Copy `machine-culture-2.pem` into `~/.ssh`.

Set permissions for the .ssh key.

```
chmod 600 ~/.ssh/machine-culture-2.pem
```

Add to `~/.ssh/config` the following lines:

```
Host mpi-ec2-emp1
  ForwardAgent yes
  Hostname 3.127.208.75
  IdentityFile /absolute/path/to/machine-culture-2.pem
  User ubuntu
```
The `/absolute/path/to/machine-culture-2.pem` needs to be addopted.

##### Creating Tunnel

To be able to connect to the database a ssh tunnel needs to be created. It is as simple as:
```
ssh -L 3002:0.0.0.0:27017 mpi-ec2-emp1
```

##### Using Mongo Compass

With the tunnel active the mongo database can be reached with:

```
mongodb://0.0.0.0:3002/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
```

### Machine Backend

The machine backend is a seperate endpoint (a different server). Whenever the empirica backend needs a machine solution a request is send to the machine backend. This request contains the `environment`, the `previous solution` and the `modelName`.

To test the machine backend: https://reqbin.com/pd5d7svg

To check the machine configuration: https://reqbin.com/aweszjm6

To update the machine configuration: https://reqbin.com/pthff5f5

## Protokoll for running experiments

### Step 1: Define Factors in Logbook 

### Step 2: Check if all factors are avaible in Empirica

### Step 3: Create Treatments

### Step 4: Calculate number of participants

Without machine:

rounds = (number of environments) x (number of chains for each environment) x (number for length)
                           +
With machine: 
rounds = (number of environments) x (number of chains for each environment) x (number for length)

number length without machine = 3
number length with machine = 2

Minimum number of participants: 
(total number of rounds) / (number Of Rounds per participant)

### Step 5: Create Batch

Game Count: 2x (Minimum number of participants)

### Step 6: Check if machine backend is correctly configured

### Step 7: Send a test request to machine backend

### Step 8: Start the experiment
