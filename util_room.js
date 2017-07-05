/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.room');
 * mod.thing == 'a thing'; // true
 */
var sources = Game.rooms['E84S33'].find(FIND_SOURCES);
var buildingStorage = Game.rooms['E84S33'].find(FIND_STRUCTURES,
    {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE);
        }
    });

var roomUtil =
    {
        // find open container next to source
        FindSourceContainer: function (source) {
            var containers = source.room.lookForAtArea(LOOK_STRUCTURES,
                source.pos.y - 1,
                source.pos.x - 1,
                source.pos.y + 1,
                source.pos.x + 1,
                true);

            //console.log(containers.length);

            // returns first conatiner without a containerHarvester already on it
            for (var i = 0; i < containers.length; i++) {
                var currentContainer = containers[i].structure;
                //console.log(source.room.lookForAt(LOOK_CREEPS,containers[i].structure.pos)[0].memory.role);
                if (source.pos.getRangeTo(currentContainer.pos) <= 1 &&
                    currentContainer.store.energy > 0) {
                    return currentContainer;
                }
            }
        },

        FindFilledSourceContainer: function (source) {
            var containers = source.room.lookForAtArea(LOOK_STRUCTURES,
                source.pos.y - 1,
                source.pos.x - 1,
                source.pos.y + 1,
                source.pos.x + 1,
                true);

            //console.log(containers.length);

            // returns first conatiner without a containerHarvester already on it
            for (var i = 0; i < containers.length; i++) {
                var currentContainer = containers[i].structure;
                //console.log(source.room.lookForAt(LOOK_CREEPS,containers[i].structure.pos)[0].memory.role);
                if (currentContainer.store.energy > 0) {
                    return currentContainer;
                }
            }
        },
    }

module.exports = roomUtil;