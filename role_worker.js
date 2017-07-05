var roomUtil = require('util.room');

var workType =
    {
        HARVEST: 0,
        STORE: 1,
        UPGRADE: 2
    };

var spawn = Game.spawns['Spawn01'];
var sources = Game.rooms['E84S33'].find(FIND_SOURCES);
var source = Game.rooms['E84S33'].find(FIND_SOURCES)[0];
var buildingStorage = spawn.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_STORAGE; } })[0];

function HarvestEnergy(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        var sourceForGroup = sources[creep.memory.sourceGroup];
        var container = roomUtil.FindSourceContainer(sourceForGroup);

        if (container != undefined && creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
        else if (creep.harvest(sourceForGroup) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
    else {
        // default to upgrade controller
        creep.memory.currentWork = workType.STORE;
    }
}

function StoreEnergy(creep) {
    if (creep.carry.energy > 0) {
        //Game.spawns['Spawn01'].room.find(FIND_STRUCTURES,{filter: (structure) =>{return (structure.structureType == STRUCTURE_CONTAINER && structure.store < structure.storeCapacity);}}).length;
        var targets = creep.room.find(FIND_STRUCTURES,
            {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity) ||
                        (structure.structureType == STRUCTURE_CONTAINER &&
                            (structure.pos.getRangeTo(sources[0]) > 1 && structure.pos.getRangeTo(sources[1]) > 1) &&
                            structure.store.energy < structure.storeCapacity);
                }
            });
        //console.log('targets to refill ' + targets.length);
        if (targets.length > 0) {
            var currentTarget = targets[targets.length - 1];
            if (creep.transfer(currentTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(currentTarget, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            creep.memory.currentWork = workType.UPGRADE;
        }
    }
    else {
        creep.memory.currentWork = workType.HARVEST;
    }
}

function UpgradeController(creep) {
    if (creep.carry.energy > 0) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
    else {
        creep.memory.currentWork = workType.HARVEST;
    }
}

var roleWorker =
    {
        Work: function (curCreep) {
            if (Math.floor(Math.random() * 100) == 0) curCreep.say("meow");
            //console.log(curCreep.name + ' is ' + curCreep.memory.currentWork)

            switch (curCreep.memory.currentWork) {
                case workType.HARVEST:
                    {
                        HarvestEnergy(curCreep);
                        break;
                    }
                case workType.STORE:
                    {
                        StoreEnergy(curCreep);
                        break;
                    }
                case workType.UPGRADE:
                    {
                        UpgradeController(curCreep);
                        break;
                    }
                default:
                    break;
            }
        },

        EnergyToStorage: function (creep) {
            //console.log(buildingStorage.storeCapacity);
            if (creep.carry.energy < creep.carryCapacity) {
                HarvestEnergy(creep);
            }
            else {
                if (creep.transfer(buildingStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildingStorage, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }

module.exports = roleWorker;