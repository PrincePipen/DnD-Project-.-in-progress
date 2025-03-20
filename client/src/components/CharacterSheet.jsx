import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import Card from './ui/Card';
import Button from './ui/Button';
import './CharacterSheet.css';

/**
 * Character sheet component
 * @returns {JSX.Element} Character sheet component
 */
const CharacterSheet = () => {
  const { character, updateCharacterData, isLoading } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState(null);

  // Start editing character
  const handleStartEdit = () => {
    setEditedCharacter({ ...character });
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCharacter(null);
  };

  // Save character changes
  const handleSaveCharacter = async () => {
    try {
      await updateCharacterData(editedCharacter);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update character:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditedCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle stat changes
  const handleStatChange = (statName, value) => {
    const numValue = parseInt(value, 10) || 0;
    
    setEditedCharacter(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: numValue
      }
    }));
  };

  // Calculate stat modifier
  const getStatModifier = (stat) => {
    const mod = Math.floor((stat - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod;
  };

  // If no character data yet
  if (!character || !character.name) {
    return (
      <Card className="character-sheet" title="Character Sheet">
        <div className="empty-character">
          <p>No character created yet.</p>
          <p>Start a new game or use the "Create Character" button.</p>
        </div>
      </Card>
    );
  }

  // If editing character
  if (isEditing && editedCharacter) {
    return (
      <Card className="character-sheet" title="Edit Character">
        <div className="edit-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={editedCharacter.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Race</label>
              <input
                type="text"
                value={editedCharacter.race}
                onChange={(e) => handleInputChange('race', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Class</label>
              <input
                type="text"
                value={editedCharacter.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Level</label>
              <input
                type="number"
                min="1"
                max="20"
                value={editedCharacter.level}
                onChange={(e) => handleInputChange('level', parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>
          
          <div className="stat-grid">
            {Object.entries(editedCharacter.stats || {}).map(([statName, statValue]) => (
              <div key={statName} className="stat-edit">
                <label>{statName.toUpperCase()}</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={statValue}
                  onChange={(e) => handleStatChange(statName, e.target.value)}
                />
              </div>
            ))}
          </div>
          
          <div className="form-actions">
            <Button onClick={handleCancelEdit} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveCharacter} disabled={isLoading}>
              Save Character
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Display character sheet
  return (
    <Card 
      className="character-sheet" 
      title="Character Sheet"
    >
      <div className="character-header">
        <h2 className="character-name">{character.name}</h2>
        <div className="character-subtitle">
          {character.race} {character.class} - Level {character.level || 1}
        </div>
        <Button 
          variant="secondary" 
          size="small" 
          className="edit-button"
          onClick={handleStartEdit}
        >
          Edit
        </Button>
      </div>
      
      <div className="character-health">
        <div className="hp-bar">
          <div 
            className="hp-fill" 
            style={{ 
              width: `${character.hitPoints ? (character.hitPoints.current / character.hitPoints.maximum) * 100 : 100}%` 
            }}
          ></div>
        </div>
        <div className="hp-text">
          HP: {character.hitPoints ? `${character.hitPoints.current}/${character.hitPoints.maximum}` : 'N/A'}
        </div>
      </div>
      
      <div className="character-section">
        <h3 className="section-title">Attributes</h3>
        <div className="stat-grid">
          {Object.entries(character.stats || {}).map(([statName, statValue]) => (
            <div key={statName} className="stat-box">
              <div className="stat-label">{statName.substring(0, 3).toUpperCase()}</div>
              <div className="stat-value">{statValue}</div>
              <div className="stat-modifier">{getStatModifier(statValue)}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="character-section">
        <h3 className="section-title">Inventory</h3>
        <div className="inventory-list">
          {character.inventory && character.inventory.length > 0 ? (
            <ul>
              {character.inventory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-list">No items in inventory</p>
          )}
        </div>
      </div>
      
      <div className="character-section">
        <h3 className="section-title">Abilities & Spells</h3>
        <div className="abilities-list">
          {character.abilities && character.abilities.length > 0 ? (
            <ul>
              {character.abilities.map((ability, index) => (
                <li key={index}>{ability}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-list">No abilities learned yet</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CharacterSheet;