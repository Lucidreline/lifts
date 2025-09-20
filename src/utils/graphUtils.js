/**
 * Calculates the total volume (by sets) for each simple muscle group.
 * @param {Array} sets - The array of set objects from the current session.
 * @param {Array} allExercises - The array of all available exercise objects.
 * @returns {object} - An object with muscle groups as keys and their calculated volume.
 */
/**
 * Calculates the total volume for each muscle group based on the selected filters.
 * @param {Array} sets - The array of set objects.
 * @param {Array} allExercises - The array of all available exercise objects.
 * @param {string} metric - The metric to calculate volume by ('sets' or 'reps').
 * @param {string} muscleGroupType - The type of muscle group to display ('simple' or 'specific').
 * @returns {object} - An object with muscle groups as keys and their calculated volume.
 */
export const calculateSessionVolume = (sets, allExercises, metric = 'sets', muscleGroupType = 'simple') => {
    const volumeByMuscleGroup = {};

    const ensureMuscleGroup = (name) => {
        if (!volumeByMuscleGroup[name]) {
            volumeByMuscleGroup[name] = { primary: 0, secondary: 0 };
        }
    };

    for (const set of sets) {
        const exercise = allExercises.find(e => e.id === set.exercise);

        if (exercise) {
            const volumeToAdd = metric === 'reps' ? set.repCount : 1;

            // 1. Process the Primary muscle group
            const primary = exercise.muscleGroups.primary;
            if (primary && primary[muscleGroupType]) {
                const groupName = primary[muscleGroupType];
                ensureMuscleGroup(groupName);
                volumeByMuscleGroup[groupName].primary += volumeToAdd;
            }

            // 2. Process all Secondary muscle groups
            const secondaries = exercise.muscleGroups.secondary;
            if (secondaries && secondaries.length > 0) {
                for (const secondary of secondaries) {
                    if (secondary && secondary[muscleGroupType]) {
                        const groupName = secondary[muscleGroupType];
                        ensureMuscleGroup(groupName);
                        volumeByMuscleGroup[groupName].secondary += (volumeToAdd * 0.5);
                    }
                }
            }
        }
    }

    return volumeByMuscleGroup;
};