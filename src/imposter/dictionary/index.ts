import { animals } from "./animals";
import { artTerms } from "./artTerms";
import { astronomy } from "./astronomy";
import { chemistry } from "./chemistry";
import { clothingAccessories } from "./clothingAccessories";
import { countries } from "./countries";
import { famousLandmarks } from "./famousLandmarks";
import { food } from "./food";
import { householdObjects } from "./householdObjects";
import { humanAnatomy } from "./humanAnatomy";
import { mathTerms } from "./mathTerms";
import { musicalInstruments } from "./musicalInstruments";
import { mythology } from "./mythology";
import { occupations } from "./occupations";
import { physics } from "./physics";
import { places } from "./places";
import { plantsTrees } from "./plantsTrees";
import { sports } from "./sports";
import { technology } from "./technology";
import { tools } from "./tools";
import { usStates } from "./usStates";
import { vehicles } from "./vehicles";
import { weatherNaturalPhenomena } from "./weatherNaturalPhenomena";

export interface Dictionary {
  theme: string;
  words: readonly string[];
}

export const builtInDictionaries: readonly Dictionary[] = [
  { theme: "Animals", words: animals },
  { theme: "Food", words: food },
  { theme: "Sports", words: sports },
  { theme: "US States", words: usStates },
  { theme: "Countries", words: countries },
  { theme: "Musical Instruments", words: musicalInstruments },
  { theme: "Occupations", words: occupations },
  { theme: "Household Objects", words: householdObjects },
  { theme: "Vehicles", words: vehicles },
  { theme: "Clothing & Accessories", words: clothingAccessories },
  { theme: "Tools", words: tools },
  { theme: "Plants & Trees", words: plantsTrees },
  { theme: "Human Anatomy", words: humanAnatomy },
  { theme: "Weather & Natural Phenomena", words: weatherNaturalPhenomena },
  { theme: "Technology", words: technology },
  { theme: "Chemistry", words: chemistry },
  { theme: "Physics", words: physics },
  { theme: "Astronomy", words: astronomy },
  { theme: "Math Terms", words: mathTerms },
  { theme: "Art Terms", words: artTerms },
  { theme: "Mythology", words: mythology },
  { theme: "Famous Landmarks", words: famousLandmarks },
  { theme: "Places", words: places },
];
