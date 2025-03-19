import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import Screen from '../../layout/Screen';

// Initialisations -------------------------
const InputField = ({ label, children, style }) => (
  <View style={[styles.inputContainer, style]}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const StyledTextInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'numeric',
  style
}) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    keyboardType={keyboardType}
    style={[styles.data, style]}
  />
);

const StyledPicker = ({ selectedValue, onValueChange, items, style }) => (
  <View style={[styles.pickerContainer, style]}>
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
      itemStyle={styles.pickerItem}
    >
      {items.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  </View>
);

const ProfileView = ({
  systemData,
  weightData,
  heightData,
  feetData,
  inchesData,
  ageData,
  sexData,
  handleSystemChange,
  setWeightData,
  setHeightData,
  setFeetData,
  setInchesData,
  setAgeData,
  setSexData,
  handleSave
}) => {
  // State -----------------------------------
  const measurementSystemItems = [
    { label: 'Metric (kg/cm)', value: 'metric' },
    { label: 'Imperial (lbs/ft)', value: 'imperial' }
  ];

  const sexItems = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];

  // Handlers --------------------------------
  const handleInchesChange = (text) => {
    if (text === '') {
      setInchesData('');
      return;
    }
    const num = parseFloat(text);
    if (!isNaN(num) && num >= 0 && num < 12) {
      setInchesData(text);
    }
  };

  const handleInchesBlur = () => {
    const num = parseFloat(inchesData);
    if (!isNaN(num) && num >= 0 && num < 12) {
      setInchesData(num.toFixed(1));
    }
  };

  // View -----------------------------------
  return (
    <Screen>
      <KeyboardAwareScrollView
        style={styles.container}
        bounces={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps='handled'
        extraScrollHeight={20}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <InputField label='Measurement System'>
          <StyledPicker
            selectedValue={systemData}
            onValueChange={handleSystemChange}
            items={measurementSystemItems}
          />
        </InputField>

        <InputField
          label={`Weight (${systemData === 'metric' ? 'kg' : 'lbs'})`}
        >
          <StyledTextInput
            value={weightData}
            onChangeText={setWeightData}
            placeholder={`Enter weight in ${
              systemData === 'metric' ? 'kilograms' : 'pounds'
            }`}
          />
        </InputField>

        <InputField
          label={`Height ${systemData === 'metric' ? '(cm)' : '(ft & in)'}`}
        >
          {systemData === 'metric' ? (
            <StyledTextInput
              value={heightData}
              onChangeText={setHeightData}
              placeholder='Enter height in centimeters'
            />
          ) : (
            <View style={styles.heightContainer}>
              <View style={styles.heightContainer}>
                <StyledTextInput
                  value={feetData}
                  onChangeText={setFeetData}
                  placeholder='Feet'
                />
                <Text style={styles.heightLabel}>ft</Text>
              </View>
              <View style={styles.heightContainer}>
                <StyledTextInput
                  value={inchesData}
                  onChangeText={handleInchesChange}
                  onBlur={handleInchesBlur}
                  placeholder='Inches'
                />
                <Text style={styles.heightLabel}>in</Text>
              </View>
            </View>
          )}
        </InputField>

        <InputField label='Age'>
          <StyledTextInput
            value={ageData}
            onChangeText={setAgeData}
            placeholder='Enter age'
          />
        </InputField>

        <InputField label='Sex'>
          <StyledPicker
            selectedValue={sexData}
            onValueChange={setSexData}
            items={sexItems}
          />
        </InputField>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            Keyboard.dismiss();
            handleSave();
          }}
        >
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainer: {
    gap: 5,
    paddingHorizontal: 20,
    marginTop: 15
  },
  label: {
    fontSize: 16,
    color: '#665679',
    marginBottom: 5
  },
  data: {
    backgroundColor: '#F0EFFF',
    borderRadius: 10,
    padding: 10,
    color: '#665679',
    height: 55,
    fontSize: 16,
    flex: 1
  },
  heightContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    height: 55,
    flex: 1
  },
  heightLabel: {
    color: '#665679',
    fontSize: 16,
    width: 20
  },
  saveButton: {
    backgroundColor: '#665679',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20
  },
  saveButtonText: {
    color: '#F0EFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  pickerContainer: {
    backgroundColor: '#F0EFFF',
    borderRadius: 10,
    height: 55,
    overflow: 'hidden'
  },
  picker: {
    color: '#665679',
    height: 55,
    width: '100%'
  },
  pickerItem: {
    color: '#665679',
    fontSize: 16
  }
});

export default ProfileView;
