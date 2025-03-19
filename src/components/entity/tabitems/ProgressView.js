import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const ProgressView = ({
  currentTab,
  tabs,
  onPreviousTab,
  onNextTab,
  children
}) => {
  // Initialisations -------------------------
  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <TouchableOpacity onPress={onPreviousTab} style={styles.arrowButton}>
          <Text style={styles.arrowButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{tabs[currentTab]}</Text>
        <TouchableOpacity onPress={onNextTab} style={styles.arrowButton}>
          <Text style={styles.arrowButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 20
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#665679',
    textAlign: 'center',
    flex: 1
  },
  arrowButton: {
    padding: 10
  },
  arrowButtonText: {
    fontSize: 20,
    color: '#665679'
  }
});

export default ProgressView;
