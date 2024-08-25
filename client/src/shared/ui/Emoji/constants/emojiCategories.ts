import { Categories } from 'emoji-picker-react';
import { CategoriesConfig } from 'emoji-picker-react/dist/config/categoryConfig';

export const EMOJI_CATEGORIES: CategoriesConfig = [
  {
    category: Categories.SUGGESTED,
    name: 'Недавние',
  },
  {
    category: Categories.SMILEYS_PEOPLE,
    name: 'Смайлы & люди',
  },
  {
    category: Categories.ANIMALS_NATURE,
    name: 'Животные & природа',
  },
  {
    category: Categories.FOOD_DRINK,
    name: 'Еда & напитки',
  },
  {
    category: Categories.ACTIVITIES,
    name: 'Занятия',
  },
  {
    category: Categories.TRAVEL_PLACES,
    name: 'Места & путешествия',
  },
  {
    category: Categories.OBJECTS,
    name: 'Предметы',
  },
  {
    category: Categories.SYMBOLS,
    name: 'Символы',
  },
  {
    category: Categories.FLAGS,
    name: 'Флаги',
  },
];
