var roomUtil = require('util.room');
var creepSpawning = require('role.spawn');
var worker = require('role.worker');
var builder = require('role.builder');
var dumbTower = require('dumbTower');
var containerHarvest = require('role.containerHarvest');
var upgrader = require('role.upgrader');

var manualWork = false;

module.exports.loop = function () 
{
    // declare these in the loop so they dont go stale.... RAWR
    var spawn1 = Game.spawns['Spawn01'];
    var sources = spawn1.room.find(FIND_SOURCES);
    
    var HARVESTER_COUNT = 2;
    var STORAGE_COUNT = 2;
    var WORKER_COUNT = 6;
    var BUILDER_COUNT = 5;
    var UPGRADER_COUNT = 2;
    
    // refresh cached filtered arrays for efficiency and so they don't go stale
    roomUtil.RefreshFilteredArrays();
    
    //console.log('I want ' + HARVESTER_COUNT + 'but only have ' + _.filter(Game.creeps, (creep) => creep.memory.role == 'container'));
    if(spawn1.spawning == null)
    {
        creepSpawning.maintainWorkers(WORKER_COUNT);
        creepSpawning.maintainBuilders(BUILDER_COUNT);
        creepSpawning.maintainStorage(STORAGE_COUNT);
        creepSpawning.maintainHarvesters(HARVESTER_COUNT);
        creepSpawning.maintainUpgraders(UPGRADER_COUNT);
    }
    
    // FIRE ZE MISSILES
    var enemies = spawn1.room.find(FIND_HOSTILE_CREEPS);
    for(var i = 0; i < enemies.length; i++)
    {
        var enemy = enemies[i];
        dumbTower.FindAndShootEnemy(enemy);
    }
    
    // do your work minions
    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'container')
        {
            //console.log('container harvesting');
            containerHarvest.HarvestToContainer(creep);
        }
        if(creep.memory.role == 'worker')
        {
            worker.Work(creep);
        }
        if(creep.memory.role == 'builder')
        {
            builder.Work(creep);
        }
        if(creep.memory.role == 'storage')
        {
            worker.StoreEnergy(creep);
        }
        if(creep.memory.role == 'upgrader')
        {
            upgrader.Work(creep);
        }
    }
    
    var storageLink = roomUtil.FindStorageLink();
    roomUtil.FillLinks(storageLink);
}



