import Screen from '../../../layout/Screen';
import ProgressView from '../../../entity/tabitems/ProgressView';
import CalorieProgScreen from './CalorieProgressScreen';
import WeightProgScreen from './WeightProgressScreen';
import MacroProgScreen from './MacroProgressScreen';
import { useState } from 'react';

const ProgressScreen = () => {
  // Initialisations -------------------------
  // State -------------------------------
  const [currentTab, setCurrentTab] = useState(0);
  const tabs = [
    'Calorie Goal Progress',
    'Weight Goal Progress',
    'Macro Goals Progress'
  ];

  // Handlers ----------------------------
  const handlePreviousTab = () => {
    setCurrentTab((prev) => (prev === 0 ? tabs.length - 1 : prev - 1));
  };

  const handleNextTab = () => {
    setCurrentTab((prev) => (prev === tabs.length - 1 ? 0 : prev + 1));
  };

  // View ------------------------------------
  const renderCurrentTab = () => {
    switch (currentTab) {
      case 0:
        return <CalorieProgScreen />;
      case 1:
        return <WeightProgScreen />;
      case 2:
        return <MacroProgScreen />;
      default:
        return null;
    }
  };

  return (
    <Screen>
      <ProgressView
        currentTab={currentTab}
        tabs={tabs}
        onPreviousTab={handlePreviousTab}
        onNextTab={handleNextTab}
      >
        {renderCurrentTab()}
      </ProgressView>
    </Screen>
  );
};

export default ProgressScreen;
