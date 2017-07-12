/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.room');
 * mod.thing == 'a thing'; // true
 */
 var sources = Game.rooms['E84S33'].find(FIND_SOURCES);
 var links = new Array();
 var linksToFill = new Array();
 var storeEnergyTargets = new Array();
 var harvestEnergyTargets = new Array();
 var availableEnergyTargets = new Array();
 var repairTargets = new Array();
 var buildingStorage = Game.rooms['E84S33'].storage;
 var RoomE84S33 = Game.rooms['E84S33'];
 
var roomUtil = 
{
    
    // Filtered Array Getters
    GetLinks:function(room)
    {
        return links[room.name];
    },
    
    GetLinksToFill:function(room)
    {
        return linksToFill[room.name];
    },
    
    GetHarvestEnergyTargets:function(room)
    {
        return harvestEnergyTargets[room.name];
    },
    
    GetStoreEnergyTargets:function(room)
    {
        return storeEnergyTargets[room.name];
    },
    
    GetAvailableEnergyTargets:function(room)
    {
        return availableEnergyTargets[room.name];
    },
    
    GetRepairTargets:function(room)
    {
        return repairTargets[room.name];
    },
    
    // Refresh filtered arrays
    RefreshFilteredArrays:function()
    {
        for(var currentRoomName in Game.rooms)
        {
            var currentRoom = Game.rooms[currentRoomName];
            //console.log(currentRoom);
            
            // array of sources in room
            
            // All links in each room
            links[currentRoomName] = currentRoom.find(FIND_STRUCTURES, 
            {
                filter:(structure) => 
                {
                    return structure.structureType == STRUCTURE_LINK;
                    
                }
                
            });
            
            // Links to shoot energy into from storage link
            linksToFill[currentRoomName] = currentRoom.find(FIND_STRUCTURES, 
            {
              filter:(structure) => 
                  {
                      return structure.structureType == STRUCTURE_LINK && (structure.pos.isNearTo(structure.room.storage) == false);
                      
                  }
              
            });
            
            // all structures to get energy out of
            harvestEnergyTargets[currentRoomName] = currentRoom.find(FIND_STRUCTURES, 
            {
                filter: (structure) => 
                {
                    var sources = currentRoom.find(FIND_SOURCES);
                    return ((structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN || 
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity) || 
                            (structure.structureType == STRUCTURE_CONTAINER &&
                            (structure.pos.getRangeTo(sources[0]) > 1 && sources[1] != undefined && structure.pos.getRangeTo(sources[1]) > 1) &&
                            structure.store.energy < structure.storeCapacity);
                }
            });
            
            storeEnergyTargets[currentRoomName] = currentRoom.find(FIND_STRUCTURES, 
            {
                filter: (structure) => 
                {
                    return ((structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN || 
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity) || 
                            (structure.structureType == STRUCTURE_CONTAINER &&
                            (structure.pos.getRangeTo(sources[0]) > 1 && sources[1] != undefined && structure.pos.getRangeTo(sources[1]) > 1) &&
                            structure.store.energy < structure.storeCapacity);
                }
            });
            
            availableEnergyTargets[currentRoomName] = currentRoom.find(FIND_STRUCTURES,  
            {
                filter: (structure) => 
                {
                    return ((structure.structureType == STRUCTURE_CONTAINER || 
                        structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store.energy > 99) || 
                        (structure.structureType == STRUCTURE_LINK &&
                        structure.energy > 99);
                }
            });
            
            repairTargets[currentRoomName] = currentRoom.find(FIND_STRUCTURES, 
                { 
                    filter: object => (object.hits < 600000 && object.hits < object.hitsMax) 
                });
        }
    },
    
    
    FindUpgradeContainer:function(room)
    {
      var containers = room.lookForAtArea(LOOK_STRUCTURES, 
                                    room.controller.pos.y-2,
                                    room.controller.pos.x-2,
                                    room.controller.pos.y+2,
                                    room.controller.pos.x+2,
                                    true);
      
        for(var i = 0; i < containers.length; i++)
        {
            if(containers[i].structure.structureType == STRUCTURE_CONTAINER)
            {
                return containers[i].structure;
            }
            //console.log(containers[i].structure.structureType == STRUCTURE_CONTAINER);
        }
    },
    
    
    // find open container next to source
    FindSourceContainer:function(source)
    {
        var containers = source.room.lookForAtArea(LOOK_STRUCTURES,
                                                source.pos.y-1,
                                                source.pos.x-1,
                                                source.pos.y+1,
                                                source.pos.x+1,
                                                true);
        
        //console.log(containers.length);
        
        // returns first conatiner without a containerHarvester already on it
        for(var i = 0; i < containers.length; i++)
        {
            var currentContainer = containers[i].structure;
            //console.log(source.room.lookForAt(LOOK_CREEPS,containers[i].structure.pos)[0].memory.role);
            if(source.pos.getRangeTo(currentContainer.pos) <= 1 &&
                currentContainer.store.energy > 0)
            {
                return currentContainer;
            }
        }
    },
    
    FindFilledSourceContainer:function(source)
    {
        var containers =  source.room.lookForAtArea(LOOK_STRUCTURES,
                                                source.pos.y-1,
                                                source.pos.x-1,
                                                source.pos.y+1,
                                                source.pos.x+1,
                                                true);
        
        //console.log(containers.length);
        
        // returns first conatiner without a containerHarvester already on it
        for(var i = 0; i < containers.length; i++)
        {
            var currentContainer = containers[i].structure;
            //console.log(source.room.lookForAt(LOOK_CREEPS,containers[i].structure.pos)[0].memory.role);
            if(currentContainer.store.energy > 0)
            {
                return currentContainer;
            }
        }
    },
    
    FindStorageLink:function()
    {
        //console.log(buildingStorage);
        var link = buildingStorage.room.lookForAtArea(LOOK_STRUCTURES,
                                                buildingStorage.pos.y-1,
                                                buildingStorage.pos.x-1,
                                                buildingStorage.pos.y+1,
                                                buildingStorage.pos.x+1,
                                                true);
        
        if(link.length > 0)
        {
            for(var i = 0; i < link.length; i++)
            {
                //console.log(link[i].structure);
                if(link[i].structure.structureType == STRUCTURE_LINK)
                {
                    return link[i].structure;
                }
            }
        }
        else
        {
            console.log('No Link Found!');
        }
    },
    
    FillLinks:function(storageLink)
    {
        //console.log(storageLink.cooldown);
        if(storageLink.cooldown <= 0)
        {
            //console.log(linksToFill.length);
            var currentRoomName = storageLink.room.name;
            for(var i = 0; i < linksToFill[currentRoomName].length; i++)
            {
                var link = linksToFill[currentRoomName][i];
                //console.log(link);
                //console.log(link.energy);
                //console.log(link.energyCapacity);
                //console.log(link.energy < link.energyCapacity/4);
                if(link.energy < link.energyCapacity/4)
                {
                    storageLink.transferEnergy(link);
                }
            }
        }
    }
}

module.exports = roomUtil;



