import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

// Initialisations ---------------------

const MacroProgressView = ({
  markedDates,
  macroFilter,
  dropdownVisible,
  toggleDropdown,
  handleFilterChange,
  handleSaveFilter,
  handleDayPress,
  handleMonthChange,
  calculatePercentage,
  goalStats
}) => {
  // State -----------------------------------

  // Handlers --------------------------------

  const getFilterLabel = () => {
    switch (macroFilter) {
      case 'protein':
        return 'Protein';
      case 'carbs':
        return 'Carbs';
      case 'fat':
        return 'Fat';
      case 'fibre':
        return 'Fibre';
      case 'all':
      default:
        return 'All Macros';
    }
  };

  // View ------------------------------------

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={toggleDropdown}
        >
          <Text style={styles.dropdownButtonText}>{getFilterLabel()}</Text>
          <Ionicons
            name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
            size={20}
            color='#665679'
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveFilter}>
          <Ionicons name='save-outline' size={24} color='#665679' />
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          {['all', 'protein', 'carbs', 'fat', 'fibre'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.dropdownItem,
                macroFilter === filter && styles.activeDropdownItem
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  macroFilter === filter && styles.activeDropdownItemText
                ]}
              >
                {filter === 'all'
                  ? 'All Macros'
                  : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Calendar
        markedDates={markedDates}
        theme={{
          calendarBackground: '#F4F2FF',
          textSectionTitleColor: '#665679',
          selectedDayBackgroundColor: '#DCD6F7',
          selectedDayTextColor: '#665679',
          todayTextColor: '#665679',
          dayTextColor: '#665679',
          textDisabledColor: '#C4C3D0',
          monthTextColor: '#665679',
          indicatorColor: '#665679',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          arrowColor: '#665679'
        }}
        markingType='custom'
        enableSwipeMonths
        current={new Date().toISOString().split('T')[0]}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
      />

      <View style={styles.markerGuide}>
        {['met', 'above', 'below'].map((status, index) => (
          <View key={index} style={styles.markerGuideItem}>
            <View
              style={[
                styles.markerDot,
                { backgroundColor: ['#567279', '#795679', '#565879'][index] }
              ]}
            />
            <Text style={styles.markerGuideText}>
              {status === 'met'
                ? 'Goal Met'
                : status === 'above'
                ? 'Above Goal'
                : 'Below Goal'}
            </Text>
            <Text style={styles.percentageText}>
              {calculatePercentage(goalStats[status])}%
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F2FF'
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0EFFF',
    borderRadius: 10,
    margin: 10
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F4F2FF',
    borderRadius: 8,
    flex: 1,
    marginRight: 10
  },
  dropdownButtonText: {
    color: '#665679',
    fontSize: 16,
    fontWeight: '500'
  },
  dropdownMenu: {
    backgroundColor: '#F0EFFF',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: -5,
    marginBottom: 5,
    padding: 5
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  activeDropdownItem: {
    backgroundColor: '#665679'
  },
  dropdownItemText: {
    color: '#665679',
    fontSize: 16
  },
  activeDropdownItemText: {
    color: '#FFFFFF'
  },
  saveButton: {
    padding: 8,
    marginLeft: 8
  },
  markerGuide: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F0EFFF',
    borderRadius: 10,
    margin: 10
  },
  markerGuideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between'
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10
  },
  markerGuideText: {
    color: '#665679',
    fontSize: 14,
    flex: 1
  },
  percentageText: {
    color: '#665679',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default MacroProgressView;
