import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { addExerciseToFirestore, updateExercise } from '../utils/exerciseUtils';
import splits from '../data/splits.js';
import muscleGroups from '../data/muscleGroups.js';

function AddExerciseModal({ isOpen, onClose, exerciseToEdit }) {
    const [name, setName] = useState('');
    const [variation, setVariation] = useState('');
    const [categories, setCategories] = useState([]);
    const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState({ simple: '', specific: '' });
    const [secondaryMuscleGroups, setSecondaryMuscleGroups] = useState([{ simple: '', specific: '' }]);
    const [specificPrimaryOptions, setSpecificPrimaryOptions] = useState([]);
    const [specificSecondaryOptions, setSpecificSecondaryOptions] = useState([[]]);
    const [repRange, setRepRange] = useState('');

    const isEditMode = Boolean(exerciseToEdit);

    useEffect(() => {
        if (isEditMode && exerciseToEdit) {
            setName(exerciseToEdit.name);
            setVariation(exerciseToEdit.variation || '');
            setRepRange(exerciseToEdit.repRange || '');
            setCategories(exerciseToEdit.categories);
            setPrimaryMuscleGroup(exerciseToEdit.muscleGroups.primary);
            const secondary = exerciseToEdit.muscleGroups.secondary;
            setSecondaryMuscleGroups(secondary.length > 0 ? secondary : [{ simple: '', specific: '' }]);
        } else {
            setName('');
            setVariation('');
            setCategories([]);
            setRepRange('');
            setPrimaryMuscleGroup({ simple: '', specific: '' });
            setSecondaryMuscleGroups([{ simple: '', specific: '' }]);
        }
    }, [exerciseToEdit, isEditMode]);

    useEffect(() => {
        if (primaryMuscleGroup.simple) {
            const selectedGroup = muscleGroups.find(group => group.name === primaryMuscleGroup.simple);
            setSpecificPrimaryOptions(selectedGroup ? selectedGroup.specific : []);
        } else {
            setSpecificPrimaryOptions([]);
        }
        const newSpecificOptions = secondaryMuscleGroups.map(sg => {
            if (!sg.simple) return [];
            const selectedGroup = muscleGroups.find(group => group.name === sg.simple);
            return selectedGroup ? selectedGroup.specific : [];
        });
        setSpecificSecondaryOptions(newSpecificOptions);
    }, [primaryMuscleGroup, secondaryMuscleGroups]);

    const handleCategoryClick = (category) => setCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    const handlePrimarySimpleChange = (e) => {
        const simpleGroupName = e.target.value;
        setPrimaryMuscleGroup({ simple: simpleGroupName, specific: '' });
    };
    const handleSecondarySimpleChange = (e, index) => {
        const simpleGroupName = e.target.value;
        const updatedGroups = [...secondaryMuscleGroups];
        updatedGroups[index] = { simple: simpleGroupName, specific: '' };
        if (simpleGroupName && index === secondaryMuscleGroups.length - 1 && secondaryMuscleGroups.length < 3) {
            updatedGroups.push({ simple: '', specific: '' });
        }
        setSecondaryMuscleGroups(updatedGroups);
    };
    const handleSecondarySpecificChange = (e, index) => {
        const specificGroupName = e.target.value;
        const updatedGroups = [...secondaryMuscleGroups];
        updatedGroups[index].specific = specificGroupName;
        setSecondaryMuscleGroups(updatedGroups);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormInvalid) return;
        const exerciseData = { name, variation, repRange, categories, primaryMuscleGroup, secondaryMuscleGroups };
        const result = isEditMode
            ? await updateExercise(exerciseToEdit.id, exerciseData)
            : await addExerciseToFirestore(exerciseData, auth.currentUser.uid);
        if (result.success) onClose();
        else alert(`Failed to ${isEditMode ? 'update' : 'add'} exercise.`);
    };

    if (!isOpen) return null;
    const isFormInvalid = !name || categories.length === 0 || !primaryMuscleGroup.simple;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#2d3748', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{isEditMode ? 'Update Exercise' : 'Add a New Exercise'}</h2>
                    <button onClick={onClose} style={{ fontSize: '1.5rem' }}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Categories */}
                    <div>
                        <label>Categories *</label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {splits.map((split) => (
                                <button key={split} type="button" onClick={() => handleCategoryClick(split)}
                                    style={{ padding: '8px 16px', border: '1px solid #4a5568', borderRadius: '8px', backgroundColor: categories.includes(split) ? '#4299e1' : 'transparent', color: 'white' }}>
                                    {split}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name & Variation */}
                    <div style={{ marginTop: '16px' }}>
                        <label htmlFor="exercise-name">Name *</label>
                        <input id="exercise-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', marginTop: '4px', color: 'white' }} />
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <label htmlFor="exercise-variation">Variation</label>
                        <input id="exercise-variation" type="text" value={variation} onChange={(e) => setVariation(e.target.value)}
                            style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', marginTop: '4px', color: 'white' }} />
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        <label htmlFor="exercise-rep-range">Rep Range</label>
                        <input id="exercise-rep-range" type="text" placeholder="e.g., 8-12" value={repRange} onChange={(e) => setRepRange(e.target.value)}
                            style={{ width: '100%', padding: '8px', background: '#4a5568', borderRadius: '4px', marginTop: '4px', color: 'white' }} />
                    </div>

                    {/* Primary Muscle Group */}
                    <div style={{ marginTop: '16px' }}>
                        <label>Primary Muscle Group *</label>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                            <select value={primaryMuscleGroup.simple} onChange={handlePrimarySimpleChange} style={{ flex: 1, padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}>
                                <option value="">Simple...</option>
                                {muscleGroups.map((group) => <option key={group.name} value={group.name}>{group.name}</option>)}
                            </select>
                            <select value={primaryMuscleGroup.specific} onChange={(e) => setPrimaryMuscleGroup({ ...primaryMuscleGroup, specific: e.target.value })} disabled={!primaryMuscleGroup.simple} style={{ flex: 1, padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}>
                                <option value="">Specific...</option>
                                {specificPrimaryOptions.map((specificName) => <option key={specificName} value={specificName}>{specificName}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Secondary Muscle Groups */}
                    <div style={{ marginTop: '16px' }}>
                        <label>Secondary Muscle Groups</label>
                        {secondaryMuscleGroups.map((group, index) => (
                            <div key={index} style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                <select value={group.simple} onChange={(e) => handleSecondarySimpleChange(e, index)} style={{ flex: 1, padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}>
                                    <option value="">Simple...</option>
                                    {muscleGroups.map((mg) => <option key={mg.name} value={mg.name}>{mg.name}</option>)}
                                </select>
                                <select value={group.specific} onChange={(e) => handleSecondarySpecificChange(e, index)} disabled={!group.simple} style={{ flex: 1, padding: '8px', background: '#4a5568', borderRadius: '4px', color: 'white' }}>
                                    <option value="">Specific...</option>
                                    {specificSecondaryOptions[index]?.map((specificName) => <option key={specificName} value={specificName}>{specificName}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: '24px', textAlign: 'right' }}>
                        <button type="submit" disabled={isFormInvalid}
                            style={{ padding: '10px 20px', backgroundColor: isFormInvalid ? '#4a5568' : '#3182ce', color: 'white', borderRadius: '8px', cursor: isFormInvalid ? 'not-allowed' : 'pointer' }}>
                            {isEditMode ? 'Update Exercise' : 'Add Exercise'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}

export default AddExerciseModal;