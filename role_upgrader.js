var util = require('util.room');

var workType = 
{
    HARVEST : 0,
    UPGRADE : 1,
    MANUAL : 2
};


function GetEnergy(creep)
{
    var upgradeContainer = util.FindUpgradeContainer(creep.room);
    
    if(creep.carry.energy < creep.carryCapacity) 
    {
        if(creep.withdraw(upgradeContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(upgradeContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else
    {
        // default to upgrade controller
         creep.memory.currentWork = workType.UPGRADE;
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


var upgrader = 
{
    Work:function(creep)
    {
        
        switch(creep.memory.currentWork)
        {
            case workType.HARVEST:
            {
                GetEnergy(creep);
                break;
            }
            case workType.UPGRADE:
            {
                UpgradeController(creep);
                break;
            }
            default:
                break;
        
        }
    }
}

module.exports = upgrader;