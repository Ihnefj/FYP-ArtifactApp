import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { weightData } from '../../../../data/weightData.js';
import WeightProgressView from '../../../entity/tabitems/WeightProgressView.js';
import { useAuth } from '../../../../contexts/AuthContext';
import { useGoals } from '../../../../contexts/GoalsContext';
import { useProfile } from '../../../../contexts/ProfileContext';
import { useFocusEffect } from '@react-navigation/native';

// Initialisations ---------------------
const WeightProgScreen = () => {
  const { user } = useAuth();
  const { weightGoal } = useGoals();
  const { measurementSystem } = useProfile();

  const timeRanges = [
    { label: 'Since starting weight', value: 'all' },
    { label: 'Last 6 months', value: '6months' },
    { label: 'Last 3 months', value: '3months' },
    { label: 'Previous month', value: 'prevMonth' },
    { label: 'This month', value: 'thisMonth' }
  ];

  // State -------------------------------
  const [weightEntries, setWeightEntries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRange, setSelectedRange] = useState('all');
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('start');
  const [showWeighInModal, setShowWeighInModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calendarPickerMode, setCalendarPickerMode] = useState('start');
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Handlers ----------------------------
  useEffect(() => {
    loadWeightData();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      loadWeightData();
    }, [user])
  );

  useEffect(() => {
    if (weightEntries.length > 0) {
      filterDataByTimeRange('all');
    }
  }, [weightEntries]);

  const loadWeightData = async () => {
    setIsLoading(true);
    try {
      const entries = await weightData.getWeightEntries(user?.uid);
      const formattedEntries = entries.map((entry) => ({
        ...entry,
        dateLabel: format(new Date(entry.date), 'MMM dd')
      }));

      const sortedEntries = formattedEntries.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setWeightEntries(sortedEntries);

      if (sortedEntries.length > 0) {
        setFilteredData(sortedEntries);
        setStartDate(sortedEntries[0].date);
        setEndDate(sortedEntries[sortedEntries.length - 1].date);
      }
    } catch (error) {
      console.error('Error loading weight data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDataByTimeRange = (range) => {
    const today = new Date();
    let filtered;

    switch (range) {
      case '6months':
        filtered = weightEntries.filter(
          (item) => new Date(item.date) >= subMonths(today, 6)
        );
        break;
      case '3months':
        filtered = weightEntries.filter(
          (item) => new Date(item.date) >= subMonths(today, 3)
        );
        break;
      case 'prevMonth':
        const prevMonthStart = startOfMonth(subMonths(today, 1));
        const prevMonthEnd = endOfMonth(subMonths(today, 1));
        filtered = weightEntries.filter((item) => {
          const date = new Date(item.date);
          return date >= prevMonthStart && date <= prevMonthEnd;
        });
        break;
      case 'thisMonth':
        const thisMonthStart = startOfMonth(today);
        const thisMonthEnd = endOfMonth(today);
        filtered = weightEntries.filter((item) => {
          const date = new Date(item.date);
          return date >= thisMonthStart && date <= thisMonthEnd;
        });
        break;
      case 'all':
      default:
        filtered = [...weightEntries];
    }

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredData(filtered);
  };

  const filterByCustomRange = () => {
    if (!startDate || !endDate) return;

    const filtered = weightEntries.filter((item) => {
      const date = new Date(item.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredData(filtered);
    setIsCustomRange(true);
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);

    if (range === 'all') {
      const sortedEntries = [...weightEntries].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setFilteredData(sortedEntries);

      if (sortedEntries.length > 0) {
        setStartDate(sortedEntries[0].date);
        setEndDate(sortedEntries[sortedEntries.length - 1].date);
      }
    } else {
      filterDataByTimeRange(range);
      if (weightEntries.length > 0) {
        const today = new Date();
        const filtered = weightEntries.filter((item) => {
          const date = new Date(item.date);
          switch (range) {
            case '6months':
              return date >= subMonths(today, 6);
            case '3months':
              return date >= subMonths(today, 3);
            case 'prevMonth':
              return (
                date >= startOfMonth(subMonths(today, 1)) &&
                date <= endOfMonth(subMonths(today, 1))
              );
            case 'thisMonth':
              return date >= startOfMonth(today) && date <= endOfMonth(today);
            default:
              return true;
          }
        });

        if (filtered.length > 0) {
          setStartDate(filtered[0].date);
          setEndDate(filtered[filtered.length - 1].date);
        }
      }
    }

    setIsCustomRange(false);
  };

  const handleDateChange = (date, isStart = true) => {
    if (isStart) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setSelectedRange('all');
    filterByCustomRange();
  };

  const handleStartDateChange = (date) => handleDateChange(date, true);
  const handleEndDateChange = (date) => handleDateChange(date, false);

  const openDatePicker = (mode) => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  const openCalendarPicker = (mode) => {
    setCalendarPickerMode(mode);
    setShowCalendarPicker(true);
  };

  const handleCalendarDateChange = (event, date) => {
    setShowCalendarPicker(false);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      if (calendarPickerMode === 'start') {
        handleStartDateChange(formattedDate);
      } else {
        handleEndDateChange(formattedDate);
      }
    }
  };

  const handleSelectedDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePickerModal(false);
  };

  const handleWeighIn = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight value');
      return;
    }

    const weightValue = parseFloat(newWeight);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    let finalWeight = weightValue;
    if (measurementSystem === 'imperial') {
      finalWeight = weightValue / 2.20462;
    }

    const newEntry = {
      date: formattedDate,
      dateLabel: format(selectedDate, 'MMM dd'),
      weight: finalWeight
    };

    try {
      await weightData.saveWeightEntry(user?.uid, newEntry);
      const formattedEntry = {
        ...newEntry,
        dateLabel: format(new Date(newEntry.date), 'MMM dd')
      };

      const updatedEntries = [...weightEntries, formattedEntry].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setWeightEntries(updatedEntries);
      setFilteredData(updatedEntries);
      setNewWeight('');
      setSelectedDate(new Date());
      setShowWeighInModal(false);
      Alert.alert('Success', 'Weight entry added successfully');
    } catch (error) {
      console.error('Error saving weight entry:', error);
      Alert.alert('Error', 'Failed to save weight entry. Please try again.');
    }
  };

  const handleSyncPress = () => {
    if (startDate && endDate) {
      setSelectedRange('all');
      filterByCustomRange();
    } else {
      Alert.alert(
        'Missing Dates',
        'Please select both start and end dates first.'
      );
    }
  };

  // View --------------------------------
  return (
    <WeightProgressView
      dataPoints={filteredData}
      weightGoal={weightGoal}
      isLoading={isLoading}
      selectedRange={selectedRange}
      timeRanges={timeRanges}
      startDate={startDate}
      endDate={endDate}
      showDatePicker={showDatePicker}
      datePickerMode={datePickerMode}
      showWeighInModal={showWeighInModal}
      newWeight={newWeight}
      selectedDate={selectedDate}
      showDatePickerModal={showDatePickerModal}
      showCalendarPicker={showCalendarPicker}
      calendarPickerMode={calendarPickerMode}
      weightEntries={weightEntries}
      measurementSystem={measurementSystem}
      onWeighInPress={() => setShowWeighInModal(true)}
      onRangeChange={handleRangeChange}
      onCalendarPickerOpen={openCalendarPicker}
      onSyncPress={handleSyncPress}
      onDatePickerClose={() => setShowDatePicker(false)}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      onWeighIn={handleWeighIn}
      onNewWeightChange={setNewWeight}
      onDatePickerModalOpen={() => setShowDatePickerModal(true)}
      onDatePickerModalClose={() => setShowDatePickerModal(false)}
      onSelectedDateChange={handleSelectedDateChange}
      onCalendarDateChange={handleCalendarDateChange}
      onDateChange={(event, date) => {
        setShowDatePickerModal(false);
        if (date) setSelectedDate(date);
      }}
    />
  );
};

export default WeightProgScreen;
