import { useState } from 'react';
import Icons from '../../UI/Icons.js';
import Form from '../../UI/Form.js';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

const defaultFood = {
  FoodID: Math.floor(100000 + Math.random() * 900000),
  FoodAmount: null,
  FoodName: null,
  FoodUnit: null,
  FoodCalories: null,
  FoodProtein: null,
  FoodCarbs: null,
  FoodFat: null,
  FoodFibre: null,
  FoodImage:
    'https://fruitgals.com.ph/storage/app/media/Screen%20Shot%202023-06-19%20at%209.11.17%20AM.png'
};

const FoodItemForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  nameError,
  setNameError,
  originalFood = null
}) => {
  // Initialisations ---------------------
  const submitLabel = originalFood ? 'Modify' : 'Add';
  const submitIcon = originalFood ? <Icons.Edit /> : <Icons.Add />;

  // State -------------------------------
  const [food, setFood] = useState(originalFood || defaultFood);

  // Handlers ----------------------------
  const handleChange = (field, value) => setFood({ ...food, [field]: value });
  const handleSubmit = () => onSubmit(food);

  // View --------------------------------
  return (
    <ScrollView>
      <Form
        onSubmit={handleSubmit}
        onCancel={onCancel}
        submitLabel={submitLabel}
        submitIcon={submitIcon}
        isSubmitting={isSubmitting}
      >
        <Form.InputText
          label='Food name'
          value={food.FoodName}
          onChange={(text) => {
            handleChange('FoodName', text);
            if (nameError) setNameError('');
          }}
          required
          error={nameError}
        />

        {nameError ? (
          <Text style={{ color: 'red', marginTop: 4 }}>{nameError}</Text>
        ) : null}

        <Form.InputText
          label='Food amount'
          value={food.FoodAmount}
          onChange={(value) => handleChange('FoodAmount', value)}
          required
        />

        <Form.InputText
          label='Food unit'
          prompt='serving, g, tbsp, ml'
          value={food.FoodUnit}
          onChange={(value) => handleChange('FoodUnit', value)}
          required
        />

        <Form.InputText
          label='Calories'
          value={food.FoodCalories}
          onChange={(value) => handleChange('FoodCalories', value)}
          required
        />

        <Form.InputText
          label='Protein'
          value={food.FoodProtein}
          onChange={(value) => handleChange('FoodProtein', value)}
          required
        />

        <Form.InputText
          label='Carbohydrates'
          value={food.FoodCarbs}
          onChange={(value) => handleChange('FoodCarbs', value)}
          required
        />

        <Form.InputText
          label='Fat'
          value={food.FoodFat}
          onChange={(value) => handleChange('FoodFat', value)}
          required
        />

        <Form.InputText
          label='Fibre'
          value={food.FoodFibre}
          onChange={(value) => handleChange('FoodFibre', value)}
          required
        />

        <Form.InputText
          label='Food image URL'
          value={food.FoodImage}
          onChange={(value) => handleChange('FoodImage', value)}
        />
      </Form>
    </ScrollView>
  );
};

export default FoodItemForm;
