import Empirica from 'meteor/empirica:core';

import onRoundStart from './callbacks/onRoundStart';
import onRoundEnd from './callbacks/onRoundEnd';
import batchInit from './callbacks/batchInit';
import gameInit from './callbacks/gameInit';

Empirica.batchInit(batchInit);

Empirica.gameInit(gameInit);

Empirica.onRoundStart(onRoundStart);

Empirica.onRoundEnd(onRoundEnd);
