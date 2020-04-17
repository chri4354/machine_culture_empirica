
## Experiments Logbook

### Testrun 1
Date: 09.04.2020

#### Environments
practise gittag: practiseV1

#### Factors
Two treatmends
##### Same for both
- playerCount: 1
- numberOfRounds: 8
- experimentName: test1
- numberOfChainsPerEnvironment: 2
- lengthOfChain: 3
- debug: true
- planningStageDurationInSeconds: 20
- responseStageDurationInSeconds: 15
- positionOfMachineSolution: 2
- machineSolutionModelName: Lookahead
- startingSolutionModelName: Lookahead

##### Treatment 1
- chainsHaveMachineSolution: False
##### Treatment 2
- chainsHaveMachineSolution: True

#### Paramter
- name: Lookahead
  parameter:
    beta: null
    gamma_g: 0.0
    gamma_s: 0.0
  type: pruning
- name: Random
  type: random
  
#### Participants
- number: 19 (originally 15)


### Pilot 3
Date: 09.04.2020

#### Environments
practice: 
https://github.com/chri4354/machine_culture/blob/practiseV1/mc/dvc/reward_networks/test/upload_environments.dvc
exp:
https://github.com/chri4354/machine_culture/blob/pilot3V2/mc/dvc/reward_networks/v1/upload_environments.dvc

#### Factors
Two treatments
##### Same for both
- playerCount: 1
- numberOfRounds: 80
- experimentName: pilot3
- numberOfChainsPerEnvironment: 4
- lengthOfChain: 1
- debug: false
- planningStageDurationInSeconds: 20
- responseStageDurationInSeconds: 15
- positionOfMachineSolution: 0
- machineSolutionModelName: Random
- chainsHaveMachineSolution: False

##### Treatment 1
- startingSolutionModelName: Random
##### Treatment 2
- startingSolutionModelName: Random
##### Treatment 3
- startingSolutionModelName: Lookahead

#### Prolific Study Names
- final version should be called: PathFinder Study