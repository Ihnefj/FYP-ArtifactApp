import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icons from './Icons.js';
import { Button, ButtonTray } from './Button.js';

const InputText = ({ label, value, onChange, keyboardType, prompt }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType || 'default'}
        placeholder={prompt}
      />
    </View>
  );
};

const Form = ({ children, onSubmit, onCancel, submitLabel, submitIcon }) => {
  return (
    <KeyboardAvoidingView style={styles.formContainer} behavior='padding'>
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.formItems}>
          {children}
        </ScrollView>

        <ButtonTray style={styles.buttonTray}>
          <Button label={submitLabel} icon={submitIcon} onClick={onSubmit} />
          <Button label='Cancel' icon={<Icons.Close />} onClick={onCancel} />
        </ButtonTray>
      </View>
    </KeyboardAvoidingView>
  );
};

const InputSelect = ({ label, prompt, options, value, onChange }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Picker
        mode='dropdown'
        selectedValue={value}
        onValueChange={onChange}
        style={styles.itemPickerStyle}
      >
        <Picker.Item
          value={null}
          label={prompt}
          style={styles.itemPickerPromptStyle}
        />
        {options.map((option, index) => (
          <Picker.Item key={index} value={option.value} label={option.label} />
        ))}
      </Picker>
    </View>
  );
};

Form.InputText = InputText;
Form.InputSelect = InputSelect;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  formItems: {
    gap: 15,
    padding: 15
  },
  buttonTray: {
    marginTop: 20
  },
  inputContainer: {
    gap: 5
  },
  label: {
    fontSize: 16,
    color: '#665679'
  },
  input: {
    borderWidth: 1,
    borderColor: '#DCD6F7',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#F4F2FF'
  },
  itemLabel: {
    color: 'grey',
    fontSize: 16,
    marginBottom: 5
  },
  itemTextInput: {
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  itemPickerStyle: {
    height: 50,
    backgroundColor: 'whitesmoke'
  },
  itemPickerPromptStyle: {
    color: 'gray'
  }
});

export default Form;
