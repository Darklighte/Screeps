var towers = Game.rooms['E84S33'].find(FIND_STRUCTURES,
    {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER);
        }
    });

var dumbTower =
    {
        FindAndShootEnemy: function (creep) {
            for (var i = 0; i < towers.length; i++) {
                towers[i].attack(creep);
            }

        }
    }

module.exports = dumbTower;