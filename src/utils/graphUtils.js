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
            volumeByMuscleGroup[name] = { primary: 0, secondary: 0, goal: 0 };
        }
    };

    for (const set of sets) {
        const exercise = allExercises.find(e => e.id === set.exercise);

        if (exercise) {
            const volumeToAdd = metric === 'reps' ? set.repCount : 1;
            const isGoal = set.complete === false;

            // Process Primary muscle group
            const primary = exercise.muscleGroups.primary;
            if (primary && primary[muscleGroupType]) {
                const groupName = primary[muscleGroupType];
                ensureMuscleGroup(groupName);
                if (isGoal) {
                    volumeByMuscleGroup[groupName].goal += volumeToAdd;
                } else {
                    volumeByMuscleGroup[groupName].primary += volumeToAdd;
                }
            }

            // Process all Secondary muscle groups
            const secondaries = exercise.muscleGroups.secondary;
            if (secondaries && secondaries.length > 0) {
                // This loop defines the 'secondary' variable for each item in the 'secondaries' array.
                for (const secondary of secondaries) {
                    if (secondary && secondary[muscleGroupType]) {
                        const groupName = secondary[muscleGroupType];
                        ensureMuscleGroup(groupName);
                        if (isGoal) {
                            volumeByMuscleGroup[groupName].goal += (volumeToAdd * 0.5);
                        } else {
                            volumeByMuscleGroup[groupName].secondary += (volumeToAdd * 0.5);
                        }
                    }
                }
            }
        }
    }

    return volumeByMuscleGroup;
};