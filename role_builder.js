var roomUtil = require('util.room');

var workType = 
{
    HARVEST : 0,
    BUILD : 1,
    REPAIR : 2,
    STORE : 3
};

var spawn = Game.spawns['Spawn01'];
var source = Game.rooms['E84S33'].find(FIND_SOURCES)[1];
var containers;

function HarvestEnergy(creep)
{
    containers = roomUtil.GetAvailableEnergyTargets(creep.room);
    var container = creep.pos.findClosestByRange(containers);
    //containers = _.sortBy(roomUtil.GetAvailableEnergyTargets(creep.room), [function(o) { return o.store.energy; }] );
    
    if(creep.carry.energy < creep.carryCapacity) 
    {
        if(containers.length > 0 && creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
        {
           creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else
    {
        // default to upgrade controller
         creep.memory.currentWork = workType.BUILD;
    }
}

function BuildSite(creep)
{
    var sitePos = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    
    if(creep.build(sitePos) == ERR_NOT_IN_RANGE)
    {
        creep.moveTo(sitePos, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    else if(creep.build(sitePos) == OK)
    {
        //BUILD THAT SHIZ
    }
    else if(creep.build(sitePos) == ERR_NOT_ENOUGH_RESOURCES)
    {
        creep.memory.currentWork = workType.HARVEST;
    }
    else
    {
        creep.memory.currentWork = workType.REPAIR;
    }
}

function Repair(creep)
{
    const targets = roomUtil.GetRepairTargets(creep.room);
    
    if(creep.carry.energy > 0) 
    {
        //console.log(targets.length);
        if(targets.length > 0) 
        {
            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else
        {
            creep.memory.currentWork = workType.HARVEST;
        }
    }
    else
    {
        creep.memory.currentWork = workType.HARVEST;
    }
}

var roleBuilder = 
{
    Work:function(currentCreep)
    {
        
        switch(currentCreep.memory.currentWork)
        {
            case workType.HARVEST:
            {
                HarvestEnergy(currentCreep);
                break;
            }
            case workType.BUILD:
            {
                BuildSite(currentCreep);
                break;
            }
            case workType.REPAIR:
            {
                Repair(currentCreep);
                break;
            }
            default:
            break;
        }
        
    }
}

module.exports = roleBuilder;