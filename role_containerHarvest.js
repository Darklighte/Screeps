var roomUtil = require('util.room');

var sources = Game.rooms['E84S33'].find(FIND_SOURCES);

// find open container next to source
function FindValidSourceContainer(source, creep) {
    var containers = source.room.lookForAtArea(LOOK_STRUCTURES,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1,
        true);

    //console.log(containers.length);

    // returns first conatiner without a containerHarvester already on it
    // and if the container is not full
    for (var i = 0; i < containers.length; i++) {
        var currentContainer = containers[i].structure;
        //console.log(source.room.lookForAt(LOOK_CREEPS,currentContainer.pos).length);
        //console.log(currentContainer.pos != creep.pos);
        //console.log(currentContainer.store.energy < currentContainer.storeCapacity);
        if (source.room.lookForAt(LOOK_CREEPS, currentContainer.pos).length <= 1 &&
            currentContainer.pos != creep.pos &&
            currentContainer.store.energy < currentContainer.storeCapacity) {
            return currentContainer;
        }
    }
}

var harvestContainer =
    {
        HarvestToContainer: function (creep) {

            var currentSource = sources[creep.memory.source];
            var validContainer = FindValidSourceContainer(currentSource, creep);
            //console.log(validContainer.store.energy);
            if (validContainer != undefined && validContainer.store.energy < validContainer.storeCapacity) {
                if (creep.harvest(currentSource) == 0) {
                    //console.log('TO THE CONTAINER');
                }
                else if (creep.harvest(currentSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(validContainer.pos, { visualizePathStyle: { stroke: '#ffaa00' } });
                }

            }

        }
    }


module.exports = harvestContainer;