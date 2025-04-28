import axios from 'axios';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

// Initialisations ---------------------
const USDA_API_KEY = 'JGZvfmBboAab9DJahO0YEEH5AWRmhNrAtFMKMIRP';
const USDA_SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

// State -------------------------------
// Handlers ----------------------------
export const foodSearch = async (rawQuery) => {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) return [];

  const cachedRef = doc(db, 'usdaCache', query);
  const cachedSnap = await getDoc(cachedRef);
  if (cachedSnap.exists()) return cachedSnap.data().results;

  const response = await axios.get(USDA_SEARCH_URL, {
    params: {
      query,
      api_key: USDA_API_KEY,
      pageSize: 50
    }
  });

  const results = response.data.foods
    .filter((item) => item.description && item.foodNutrients)
    .map((item) => {
      const description = item.description.toLowerCase();
      const words = description.split(/[\s,()\-]+/);
      const wordCount = words.length;

      let score = 10;

      if (description === query) score = 0;
      else if (description.startsWith(query)) score = 1;
      else if (words.includes(query)) score = 2;
      else if (description.includes(query)) score = 3;

      if (description.includes('raw') || description.includes('uncooked')) {
        score -= 1;
      }

      if (item.dataType === 'Foundation' || item.dataType === 'SR Legacy') {
        score -= 1;
      }

      if (item.dataType === 'Branded') {
        score += 3;
      }

      if (wordCount <= 3) {
        score -= 1;
      } else if (wordCount >= 6) {
        score += 1;
      }

      const calories =
        item.foodNutrients?.find((n) => n.nutrientName === 'Energy')?.value ||
        0;
      const protein =
        item.foodNutrients?.find((n) => n.nutrientName === 'Protein')?.value ||
        0;
      const carbs =
        item.foodNutrients?.find(
          (n) => n.nutrientName === 'Carbohydrate, by difference'
        )?.value || 0;
      const fat =
        item.foodNutrients?.find((n) => n.nutrientName === 'Total lipid (fat)')
          ?.value || 0;
      const fibre =
        item.foodNutrients?.find(
          (n) => n.nutrientName === 'Fiber, total dietary'
        )?.value || 0;

      const portion = item.foodPortions?.[0] || {};
      const gramWeight = portion.gramWeight || 100;

      let unitLabel = 'g';
      if (portion.modifier || portion.portionDescription) {
        const label = portion.modifier || portion.portionDescription;
        if (!label.toLowerCase().includes(`${gramWeight}`)) {
          unitLabel = label;
        }
      }

      return {
        FoodID: `usda-${item.fdcId}-${Math.random()
          .toString(36)
          .substring(2, 10)}`,
        FoodName: item.description,
        amount: gramWeight,
        FoodUnit: unitLabel,
        FoodCalories: calories,
        FoodProtein: protein,
        FoodCarbs: carbs,
        FoodFat: fat,
        FoodFibre: fibre,
        Source: 'USDA',
        score
      };
    })
    .sort((a, b) => a.score - b.score);

  const uniqueByName = [];
  const seenDescriptions = new Set();

  for (const item of results) {
    const nameKey = item.FoodName.trim().toLowerCase();
    if (!seenDescriptions.has(nameKey)) {
      uniqueByName.push(item);
      seenDescriptions.add(nameKey);
    }
  }

  await setDoc(cachedRef, { results: uniqueByName.slice(0, 10) });
  return uniqueByName.slice(0, 10);
};

// View --------------------------------
