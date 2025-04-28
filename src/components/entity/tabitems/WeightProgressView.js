import Screen from '../../layout/Screen';
import React from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';
import Icons from '../../UI/Icons.js';
import DateTimePicker from '@react-native-community/datetimepicker';

const screenWidth = Dimensions.get('window').width;

const WeightProgressView = ({
  dataPoints,
  weightGoal,
  isLoading,
  selectedRange,
  timeRanges,
  startDate,
  endDate,
  showDatePicker,
  datePickerMode,
  showWeighInModal,
  newWeight,
  selectedDate,
  showDatePickerModal,
  showCalendarPicker,
  calendarPickerMode,
  weightEntries,
  measurementSystem,
  onWeighInPress,
  onRangeChange,
  onCalendarPickerOpen,
  onSyncPress,
  onDatePickerClose,
  onStartDateChange,
  onEndDateChange,
  onWeighIn,
  onNewWeightChange,
  onDatePickerModalOpen,
  onDatePickerModalClose,
  onSelectedDateChange,
  onCalendarDateChange,
  onDateChange
}) => {
  // Initialisations -------------------------
  const points = dataPoints || [];
  const labels = points.map((item) => item.dateLabel);
  const weights = points.map((item) => item.weight);
  const minWeight = weights.length > 0 ? Math.min(...weights) - 1 : 0;
  const maxWeight = weights.length > 0 ? Math.max(...weights) + 1 : 100;

  const convertWeight = (weight, toImperial = false) => {
    if (toImperial) {
      return (weight * 2.20462).toFixed(1);
    } else {
      return (weight / 2.20462).toFixed(1);
    }
  };

  const formatWeight = (weight) => {
    if (measurementSystem === 'imperial') {
      return `${convertWeight(weight, true).toFixed(1)} lbs`;
    } else {
      return `${parseFloat(weight).toFixed(1)} kg`;
    }
  };

  const formatWeightChange = (startWeight, endWeight) => {
    const change = endWeight - startWeight;
    if (measurementSystem === 'imperial') {
      return `${(change * 2.20462).toFixed(1)} lbs`;
    } else {
      return `${change.toFixed(1)} kg`;
    }
  };

  const aggregateDataPoints = (dataPoints, maxPoints = 6) => {
    if (!dataPoints || dataPoints.length === 0) {
      return [];
    }

    if (dataPoints.length <= maxPoints) {
      return dataPoints.map((point) => ({
        ...point,
        dateLabel: formatDate(point.date)
      }));
    }

    const aggregatedPoints = [];
    const groupSize = Math.ceil(dataPoints.length / maxPoints);

    for (let i = 0; i < maxPoints; i++) {
      const startIdx = i * groupSize;
      const endIdx = Math.min(startIdx + groupSize, dataPoints.length);

      const group = dataPoints.slice(startIdx, endIdx);

      if (group.length === 0) continue;

      const avgWeight =
        group.reduce((sum, point) => sum + point.weight, 0) / group.length;

      const middleIdx = Math.floor(group.length / 2);
      const middlePoint = group[middleIdx];

      if (!middlePoint) continue;

      aggregatedPoints.push({
        date: middlePoint.date,
        dateLabel: formatDate(middlePoint.date),
        weight: avgWeight
      });
    }

    if (aggregatedPoints.length < maxPoints) {
      const remainingPoints = maxPoints - aggregatedPoints.length;
      const step = Math.floor(dataPoints.length / remainingPoints);

      for (let i = 0; i < remainingPoints; i++) {
        const idx = i * step;
        if (idx < dataPoints.length) {
          const point = dataPoints[idx];
          aggregatedPoints.push({
            date: point.date,
            dateLabel: formatDate(point.date),
            weight: point.weight
          });
        }
      }
    }

    return aggregatedPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const chartPoints = aggregateDataPoints(points);
  const chartLabels = chartPoints.map((item) => item.dateLabel);
  const chartWeights = chartPoints.map((item) => item.weight);

  // State -----------------------------------
  // Handlers --------------------------------
  // View ------------------------------------
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.weighInButton} onPress={onWeighInPress}>
        <Icons.Add />
        <Text style={styles.weighInButtonText}>Weigh-in</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <View style={styles.filterSection}>
          <Text style={styles.subtitle}>Interval</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedRange}
              onValueChange={onRangeChange}
              style={styles.dropdown}
              itemStyle={styles.dropdownItem}
            >
              {timeRanges.map((range) => (
                <Picker.Item
                  key={range.value}
                  label={range.label}
                  value={range.value}
                  style={styles.dropdownItem}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.dateRangeContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>From:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => onCalendarPickerOpen('start')}
              >
                <Text>
                  {startDate
                    ? format(new Date(startDate), 'MMM dd, yyyy')
                    : 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>To:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => onCalendarPickerOpen('end')}
              >
                <Text>
                  {endDate
                    ? format(new Date(endDate), 'MMM dd, yyyy')
                    : 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.syncButton} onPress={onSyncPress}>
            <Icons.Sync />
            <Text style={styles.syncButtonText}>Update Graph</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, styles.cardCentered]}>
        <Text style={styles.title}>Weight Goal</Text>
        <Text style={styles.goalText}>{formatWeight(weightGoal)}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading weight data...</Text>
        </View>
      ) : (
        <>
          {points.length > 0 && (
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Start Weight</Text>
                <Text style={styles.summaryValue}>
                  {formatWeight(points[0].weight)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Current Weight</Text>
                <Text style={styles.summaryValue}>
                  {formatWeight(points[points.length - 1].weight)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Change</Text>
                <Text style={styles.summaryValue}>
                  {formatWeightChange(
                    points[0].weight,
                    points[points.length - 1].weight
                  )}
                </Text>
              </View>
            </View>
          )}

          <Screen>
            {points.length > 0 ? (
              <LineChart
                data={{
                  labels: chartLabels,
                  datasets: [
                    {
                      data: chartWeights.map((weight) => {
                        if (weight === undefined || weight === null) {
                          return 0;
                        }

                        if (measurementSystem === 'imperial') {
                          return parseFloat(convertWeight(weight, true));
                        } else {
                          return parseFloat(weight);
                        }
                      })
                    }
                  ]
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(102, 86, 121, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(102, 86, 121, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#665679'
                  },
                  yAxisMin: minWeight,
                  yAxisMax: maxWeight
                }}
                bezier
                style={styles.chart}
                segments={Math.min(5, chartPoints.length)}
                fromZero={false}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No data available for the selected date range
                </Text>
              </View>
            )}
          </Screen>
        </>
      )}

      <Modal visible={showDatePicker} transparent={true} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Select {datePickerMode === 'start' ? 'Start' : 'End'} Date
            </Text>
            <View style={styles.datePickerContainer}>
              <Picker
                selectedValue={datePickerMode === 'start' ? startDate : endDate}
                onValueChange={(itemValue) => {
                  if (datePickerMode === 'start') {
                    onStartDateChange(itemValue);
                  } else {
                    onEndDateChange(itemValue);
                  }
                  onDatePickerClose();
                }}
                style={styles.datePicker}
              >
                {weightEntries.map((item) => (
                  <Picker.Item
                    key={item.date}
                    label={format(new Date(item.date), 'MMM dd, yyyy')}
                    value={item.date}
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onDatePickerClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showWeighInModal}
        transparent={true}
        animationType='slide'
        onRequestClose={() => onWeighInPress(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.weighInModalContent}>
            <Text style={styles.modalTitle}>Add Weight Entry</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                style={styles.weightInput}
                value={newWeight}
                onChangeText={onNewWeightChange}
                keyboardType='numeric'
                placeholder={`Enter weight (${
                  measurementSystem === 'imperial' ? 'lbs' : 'kg'
                })`}
                placeholderTextColor='#999'
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={onDatePickerModalOpen}
              >
                <Text>{format(selectedDate, 'MMM dd, yyyy')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => onWeighInPress(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={onWeighIn}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePickerModal}
          transparent={true}
          animationType='fade'
        >
          <View style={styles.datePickerModalContainer}>
            <View style={styles.datePickerModalContent}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <View style={styles.datePickerContainer}>
                <Picker
                  selectedValue={selectedDate}
                  onValueChange={(itemValue) => {
                    onSelectedDateChange(new Date(itemValue));
                    onDatePickerModalClose();
                  }}
                  style={styles.datePicker}
                >
                  {Array.from({ length: 365 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    return (
                      <Picker.Item
                        key={date.toISOString()}
                        label={format(date, 'MMM dd, yyyy')}
                        value={date.toISOString()}
                      />
                    );
                  })}
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onDatePickerModalClose}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        showDatePickerModal && (
          <DateTimePicker
            value={selectedDate}
            mode='date'
            display='default'
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )
      )}

      {showCalendarPicker && (
        <DateTimePicker
          value={
            calendarPickerMode === 'start'
              ? startDate
                ? new Date(startDate)
                : new Date()
              : endDate
              ? new Date(endDate)
              : new Date()
          }
          mode='date'
          display='default'
          onChange={onCalendarDateChange}
          maximumDate={new Date()}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#665679',
    padding: 15,
    marginBottom: 15
  },
  cardCentered: {
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#665679'
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#665679'
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#665679'
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#665679'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#665679',
    padding: 10
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#665679'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#665679'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#F0EFFF',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center'
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center'
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0EFFF',
    borderRadius: 16,
    marginVertical: 8
  },
  noDataText: {
    fontSize: 16,
    color: '#665679',
    textAlign: 'center',
    padding: 20
  },
  filterContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F0EFFF',
    borderRadius: 10
  },
  filterSection: {
    marginBottom: 15
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#665679',
    overflow: 'hidden'
  },
  dropdown: {
    height: 50,
    width: '100%'
  },
  dropdownItem: {
    fontSize: 14
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 5
  },
  dateButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#665679'
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#665679'
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1
  },
  summaryLabel: {
    fontSize: 12,
    color: '#665679',
    marginBottom: 5
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#665679'
  },
  goalBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#665679',
    padding: 15,
    marginBottom: 20,
    alignItems: 'center'
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#665679'
  },
  weighInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#665679',
    padding: 12,
    marginBottom: 15,
    justifyContent: 'center'
  },
  weighInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#665679',
    marginLeft: 8
  },
  weighInModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignSelf: 'center'
  },
  inputContainer: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#665679',
    marginBottom: 8
  },
  weightInput: {
    backgroundColor: '#F0EFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#665679',
    padding: 12,
    fontSize: 16
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5
  },
  saveButton: {
    backgroundColor: '#665679'
  },
  saveButtonText: {
    color: 'white'
  },
  datePickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0EFFF'
  },
  datePickerModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center'
  },
  datePickerContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20
  },
  datePicker: {
    width: '100%'
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#665679',
    padding: 10,
    marginTop: 10
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#665679',
    marginLeft: 8
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default WeightProgressView;
