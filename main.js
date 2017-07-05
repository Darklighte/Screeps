var creepSpawning = require('role.spawn');
var worker = require('role.worker');
var builder = require('role.builder');
var dumbTower = require('dumbTower');
var containerHarvest = require('role.containerHarvest');


var spawn1 = Game.spawns['Spawn01'];
var sources = spawn1.room.find(FIND_SOURCES);

var HARVESTER_COUNT = 2;
var WORKER_COUNT = 6;
var BUILDER_COUNT = 4;

var manualWork = false;

module.exports.loop = function () {
    creepSpawning.maintainWorkers(WORKER_COUNT);
    creepSpawning.maintainBuilders(BUILDER_COUNT);
    creepSpawning.maintainHarvesters(HARVESTER_COUNT);



    var enemies = spawn1.room.find(FIND_HOSTILE_CREEPS);
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        dumbTower.FindAndShootEnemy(enemy);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == 'container') {
            //console.log('container harvesting');
            containerHarvest.HarvestToContainer(creep);
        }
        if (creep.memory.role == 'worker') {
            worker.Work(creep);
        }
        if (creep.memory.role == 'builder') {
            builder.Work(creep);
        }
        if (creep.memory.role == 'storage') {
            worker.EnergyToStorage(creep);
        }
    }
}



