'use strict';

var config = require('../config.json');
var ForgingMonitor = function (forgingStatus) {
    this.getStatus = function (delegate) {
        return forgingStatus(delegate);
    };

    this.getforgingTotals = function (delegates) {
        var cnt1 = _.countBy(delegates, function (d) {
            switch (d.forgingStatus.code) {
                case 0:
                case 3:
                    return 'forging';
                case 1:
                case 4:
                    return 'missedBlock';
                case 2:
                    return 'notForging';
                case 3:
                case 4:
                    return 'awaitingSlot';
                default:
                    return 'unprocessed';
            }
        });
        var cnt2 = _.countBy(delegates, function (d) {
            switch (d.forgingStatus.code) {
                case 3:
                case 4:
                    return 'awaitingSlot';
                default:
                    return 'unprocessed';
            }
        });

        cnt1.awaitingSlot = cnt2.awaitingSlot;
        return cnt1;
    };

    this.getForgingProgress = function (totals) {
        var unprocessed  = totals.unprocessed || 0;
            unprocessed += totals.staleStatus || 0;

        if (unprocessed > 0) {
            return (config.delegates - unprocessed);
        } else {
            return config.delegates;
        }
    };
};

angular.module('explorer.tools').service('forgingMonitor',
  function (forgingStatus) {
      return new ForgingMonitor(forgingStatus);
  });
