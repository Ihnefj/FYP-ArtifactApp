import { useState } from 'react';
import Icons from '../../UI/Icons.js';
import Form from '../../UI/Form.js';
import { ScrollView } from 'react-native-gesture-handler';

const defaultFood = {
  FoodID: Math.floor(100000 + Math.random() * 900000),
  FoodAmount: null,
  FoodName: null,
  FoodUnit: null,
  FoodCalories: null,
  FoodProtein: null,
  FoodCarbs: null,
  FoodFat: null,
  FoodImage:
    'https://fruitgals.com.ph/storage/app/media/Screen%20Shot%202023-06-19%20at%209.11.17%20AM.png'
};

const FoodItemForm = ({ originalFood, onSubmit, onCancel }) => {
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
      >
        <Form.InputText
          label='Food name'
          value={food.FoodName}
          onChange={(value) => handleChange('FoodName', value)}
        />

        <Form.InputText
          label='Food Amount'
          value={food.FoodAmount}
          onChange={(value) => handleChange('FoodAmount', value)}
        />

        <Form.InputText
          label='Food unit'
          prompt='serving, g, tbsp, ml'
          value={food.FoodUnit}
          onChange={(value) => handleChange('FoodUnit', value)}
        />

        <Form.InputText
          label='Calories'
          value={food.FoodCalories}
          onChange={(value) => handleChange('FoodCalories', value)}
        />

        <Form.InputText
          label='Protein'
          value={food.FoodProtein}
          onChange={(value) => handleChange('FoodProtein', value)}
        />

        <Form.InputText
          label='Carbohydrates'
          value={food.FoodCarbs}
          onChange={(value) => handleChange('FoodCarbs', value)}
        />

        <Form.InputText
          label='Fat'
          value={food.FoodFat}
          onChange={(value) => handleChange('FoodFat', value)}
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
