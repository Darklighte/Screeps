var roomUtil = require('util.room');

var workType = 
{
    HARVEST : 0,
    STORE : 1,
    UPGRADE : 2
};

var spawn = Game.spawns['Spawn01'];
var sources = Game.rooms['E84S33'].find(FIND_SOURCES);
var source = Game.rooms['E84S33'].find(FIND_SOURCES)[0];
var buildingStorage = spawn.room.storage;
var storageLink = roomUtil.FindStorageLink();
var structuresWithEnergy;

function HarvestEnergy(creep)
{
    if(creep.carry.energy < creep.carryCapacity) 
    {
        if(creep.memory.sourceGroup == undefined)
        {
            creep.memory.sourceGroup = 0;
        }
        //console.log(creep.name);
        var sourceForGroup = sources[creep.memory.sourceGroup];
        //console.log(sourceForGroup);
        var container = roomUtil.FindSourceContainer(sourceForGroup);
        structuresWithEnergy = roomUtil.GetLinks(creep.room);
        //this is starting to get HACKY MCHACK HACK, get that room object holder stuff done!
        if(container != undefined)
        {
            structuresWithEnergy.push(container);
        }
        //console.log(links.length);
        var energyFilledObject = creep.pos.findClosestByRange( structuresWithEnergy );
        if(container != undefined)
        {
            structuresWithEnergy.pop();
        }
        //console.log(creep.name + ' ' + energyFilledObject.pos.isNearTo(buildingStorage));
        //console.log(energyFilledObject);
        
        if(energyFilledObject != undefined && creep.withdraw(energyFilledObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(energyFilledObject, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else if(creep.harvest(sourceForGroup) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else
    {
        // default to upgrade controller
         creep.memory.currentWork = workType.STORE;
    }
}

function TakeFromContainer(creep)
{
    var sourceForGroup = sources[creep.memory.sourceGroup];
    var container = roomUtil.FindSourceContainer(sourceForGroup);
    
    if(container != undefined && creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
    {
        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

function StoreEnergy(creep)
{
    if(creep.carry.energy > 0) 
    {
        //Game.spawns['Spawn01'].room.find(FIND_STRUCTURES,{filter: (structure) =>{return (structure.structureType == STRUCTURE_CONTAINER && structure.store < structure.storeCapacity);}}).length;
        var targets = roomUtil.GetStoreEnergyTargets(creep.room);
        //console.log('targets to refill ' + targets.length);
        if(targets.length > 0) 
        {
            var currentTarget = targets[targets.length-1];
            if(creep.transfer(currentTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(currentTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else
        {
            creep.memory.currentWork = workType.UPGRADE;
        }
    }
    else
    {
        creep.memory.currentWork = workType.HARVEST;
    }
}

function UpgradeController(creep)
{
    if(creep.carry.energy > 0) 
    {
        if( creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE ) 
        {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else
    {
        creep.memory.currentWork = workType.HARVEST;
    }
}

function FillStorageLink(creep)
{
    if(creep.carry.energy > 0)
    {
        if(creep.transfer(storageLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(storageLink, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else
    {
        if(creep.withdraw(buildingStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(buildingStorage, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

function EnergyToStorage(creep)
    {
        //console.log(buildingStorage.storeCapacity);
        if(creep.carry.energy < creep.carryCapacity)
        {
            TakeFromContainer(creep);
        }
        else
        {
            if(creep.transfer(buildingStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(buildingStorage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }

var roleWorker = 
{
    Work:function(curCreep)
    {
        if( Math.floor(Math.random() * 100) == 0) curCreep.say("meow");
        //console.log(curCreep.name + ' is ' + curCreep.memory.currentWork)
        
        switch(curCreep.memory.currentWork)
        {
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
    
    StoreEnergy:function(creep)
    {
        storageLink = roomUtil.FindStorageLink();
        //console.log(storageLink.energy);
        if(storageLink.energy < storageLink.energyCapacity)
        {
            FillStorageLink(creep);
        }
        else
        {
            EnergyToStorage(creep);
        }
    }
}

module.exports =  roleWorker;




