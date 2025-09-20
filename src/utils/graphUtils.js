/**
 * Calculates the total volume (by sets) for each simple muscle group.
 * @param {Array} sets - The array of set objects from the current session.
 * @param {Array} allExercises - The array of all available exercise objects.
 * @returns {object} - An object with muscle groups as keys and their calculated volume.
 */
export const calculateSessionVolume = (sets, allExercises) => {
    const volumeByMuscleGroup = {};

    // A helper to make sure a muscle group exists in our volume object
    const ensureMuscleGroup = (name) => {
        if (!volumeByMuscleGroup[name]) {
            volumeByMuscleGroup[name] = { primary: 0, secondary: 0 };
        }
    };

    for (const set of sets) {
        // Find the full exercise details for the current set
        const exercise = allExercises.find(e => e.id === set.exercise);

        if (exercise) {
            // 1. Process the Primary muscle group
            const primary = exercise.muscleGroups.primary;
            if (primary && primary.simple) {
                ensureMuscleGroup(primary.simple);
                volumeByMuscleGroup[primary.simple].primary += 1; // Add 1 for a primary set
            }

            // 2. Process all Secondary muscle groups
            const secondaries = exercise.muscleGroups.secondary;
            if (secondaries && secondaries.length > 0) {
                for (const secondary of secondaries) {
                    if (secondary && secondary.simple) {
                        ensureMuscleGroup(secondary.simple);
                        volumeByMuscleGroup[secondary.simple].secondary += 0.5; // Add 0.5 for a secondary set
                    }
                }
            }
        }
    }

    return volumeByMuscleGroup;
};