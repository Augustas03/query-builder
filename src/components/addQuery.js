import {useState} from 'react'
import userApiConfig from '../data/userApiConfig.json'
import { FormInput } from './FormInput'
import { FormSelect} from './FormSelect'

const AddQuery = ({onSave, onClose}) =>{
  //first make a form
  const [formData, setFormData] = useState({
    queryName: '',
    interval: '',
    selectedApi: '',
    parameterName: '',
    activeParameters: [],  // Store confirmed parameters here
    responseAttributes: []
  })

  const [currentParameter, setCurrentParameter] = useState({
    name: '',
    value: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // If API changes, reset parameters and response attribute
      if (name === 'selectedApi') {
        return {
          ...prev,
          [name]: value,
          activeParameters: [],
          responseAttributes: []
        }
      }
      return {
        ...prev,
        [name]: value
      }
    });

    // Also reset current parameter if API changes
    if (name === 'selectedApi') {
      setCurrentParameter({
        name: '',
        value: ''
      });
    }
  };

  const handleResponseAttributesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      responseAttributes: selectedOptions
    }));
  };
  
  const handleParameterInputChange = (field) => (e) => {
    setCurrentParameter(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleAddParameter = () => {
    if (currentParameter.name && currentParameter.value) {
      // Check if parameter name already exists
      const parameterExists = formData.activeParameters.some(
        param => param.name === currentParameter.name
      );

      if (parameterExists) {
        alert('This parameter has already been added');
        return;
      }

      setFormData(prev => ({
        ...prev,
        activeParameters: [...prev.activeParameters, { ...currentParameter }]
      }));
      
      // Reset current parameter input
      setCurrentParameter({ name: '', value: '' });
    }
  };

  const removeParameter = (index) => {
    setFormData(prev => ({
      ...prev,
      activeParameters: prev.activeParameters.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const queryData = {
      queryName: formData.queryName,
      interval: formData.interval,
      api: formData.selectedApi,
      parameters: formData.activeParameters,
      responseAttributes: formData.responseAttributes
    };
    
    onSave(queryData);
  };

 return (
    <main>
      <section>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Enter Query Name"
            name="queryName"
            value={formData.queryName}
            onChange={handleInputChange}
          />
          
          <FormSelect
            label="Choose Interval"
            name="interval"
            options={userApiConfig.intervals}
            value={formData.interval}
            onChange={handleInputChange}
          />
          
          <FormSelect
            label="Choose API"
            name="selectedApi"
            options={Object.keys(userApiConfig.apis)}
            value={formData.selectedApi}
            onChange={handleInputChange}
          />

          {formData.selectedApi && (
            <div>
              <div>
                <FormSelect
                  label="Parameter Name"
                  name="parameterName"
                  options={userApiConfig.apis[formData.selectedApi].parameters}
                  value={currentParameter.name}
                  onChange={handleParameterInputChange('name')}
                  disabled={!formData.selectedApi}
                />
                
                <FormInput
                  label="Parameter Value"
                  name="parameterValue"
                  value={currentParameter.value}
                  onChange={handleParameterInputChange('value')}
                  disabled={!currentParameter.name}
                />
                
                <button
                  type="button"
                  onClick={handleAddParameter}
                  disabled={!currentParameter.name || !currentParameter.value}
                >
                  Add Parameter
                </button>
              </div>

              {/* Display active parameters */}
              {formData.activeParameters.map((param, index) => (
                <div key={index}>
                  {param.name}: {param.value}
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.selectedApi && (
            <div>
              <FormSelect
                label="Choose Response Attributes"
                name="responseAttributes"
                options={userApiConfig.apis[formData.selectedApi].responseAttributes}
                value={formData.responseAttributes}
                onChange={handleResponseAttributesChange}
                disabled={!formData.selectedApi}
                multiple={true}
              />
              <small>Hold Ctrl/Cmd to select multiple attributes</small>
              {formData.responseAttributes.length > 0 && (
                <div>
                  <p>Selected attributes: {formData.responseAttributes.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          <div>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddQuery