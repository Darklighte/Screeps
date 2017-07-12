var spawn = Game.spawns['Spawn01'];



var roleSpawn = 
{
    maintainWorkers:function(numWorkers)
    {
        spawn = Game.spawns['Spawn01'];
        var totalWorkers = _.filter(Game.creeps, (creep) => (creep.memory.role == 'worker'));
        
        //console.log('totalHarvesters.length' + totalHarvesters.length);
        //console.log('numWorkers' + numWorkers);
        //console.log(spawn.room.energyAvailable);
        //console.log(totalHarvesters.length < numWorkers && spawn.room.energyAvailable >= 500);
        if(totalWorkers.length < numWorkers && spawn.room.energyAvailable >= 500)
        {
            var sourceNum = 0;
            var numGroup0 = 0;
            for(var i = 0; i < totalWorkers.length; i++)
            {
                var currentCreep = totalWorkers[i];
                if(currentCreep.memory.sourceGroup == 0)
                {
                    numGroup0++;
                }
            }
            sourceNum = numWorkers/2 > numGroup0 ? 0 : 1;
            console.log('spawning worker for group ' + sourceNum);
            spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'worker ' + Math.floor(Math.random()*100), { role: 'worker', currentWork: 0, sourceGroup:sourceNum});
        }
        else if(totalWorkers.length < numWorkers && spawn.room.energyAvailable >= 300)
        {
            spawn.createCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'worker ' + Math.floor(Math.random()*100), { role: 'worker', currentWork: 0, sourceGroup:sourceNum });
        }
    },
    
    maintainBuilders:function(numBuilders)
    {
        spawn = Game.spawns['Spawn01'];
        var totalBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if(totalBuilders.length < numBuilders && spawn.room.energyAvailable >= 500)
        {
            console.log('spawning builder');
            spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'builder ' + Math.floor(Math.random()*100), { role: 'builder', currentWork: 0 });
        }
    },
    
    maintainHarvesters:function(numHarvesters)
    {
        spawn = Game.spawns['Spawn01'];
        var totalHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'container');
        //console.log(numHarvesters);
        //spawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE], 'container ' + Math.floor(Math.random()*100), { role: 'container', currentWork: 0, source:0 });
        if(totalHarvesters.length < numHarvesters && spawn.room.energyAvailable >= 700)
        {
            console.log('spawning harvester');
            var sourceNum = 0;
            if(totalHarvesters.length > 0)
            {
                sourceNum = totalHarvesters[0].memory.source == 0 ? 1 : 0;
            }
            spawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE], 'container ' + Math.floor(Math.random()*100), { role: 'container', currentWork: 0, source:sourceNum });
        }
    },
    
    maintainStorage:function(numStorers)
    {
        spawn = Game.spawns['Spawn01'];
        var totalStorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storage');
        
        if(totalStorers.length < numStorers && spawn.room.energyAvailable >= 450)
        {
            console.log('spawning storer');
            var sourceNum = 0;
            if(totalStorers.length > 0)
            {
                sourceNum = totalStorers[0].memory.sourceGroup == 0 ? 1 : 0;
            }   
            spawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'storage ' + Math.floor(Math.random()*100), { role: 'storage', currentWork: 0, sourceGroup:sourceNum });
        }
    },
    
    maintainUpgraders:function(numUpgraders)
    {
        spawn = Game.spawns['Spawn01'];
        var totalUpgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        
        if(totalUpgraders.length < numUpgraders && spawn.room.energyAvailable >= 1400)
        {
            spawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], 'upgrader ' + Math.floor(Math.random()*100), { role: 'upgrader', currentWork: 0 });
        }
    }

}

module.exports =  roleSpawn;



