import { useState, useEffect, useCallback } from 'react';
import type { Drink } from './types';

const STORAGE_KEY = 'mixlab_drinks';

function loadDrinks(): Drink[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveDrinks(drinks: Drink[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drinks));
}

// Simple event system for cross-component sync
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach(fn => fn());
}

export function useDrinkStore() {
  const [drinks, setDrinks] = useState<Drink[]>(loadDrinks);

  useEffect(() => {
    const listener = () => setDrinks(loadDrinks());
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const addDrink = useCallback((drink: Drink) => {
    const updated = [drink, ...loadDrinks()];
    saveDrinks(updated);
    setDrinks(updated);
    notify();
  }, []);

  const updateDrink = useCallback((drink: Drink) => {
    const updated = loadDrinks().map(d => d.id === drink.id ? { ...drink, updatedAt: new Date().toISOString() } : d);
    saveDrinks(updated);
    setDrinks(updated);
    notify();
  }, []);

  const deleteDrink = useCallback((id: string) => {
    const updated = loadDrinks().filter(d => d.id !== id);
    saveDrinks(updated);
    setDrinks(updated);
    notify();
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const updated = loadDrinks().map(d => d.id === id ? { ...d, favorite: !d.favorite } : d);
    saveDrinks(updated);
    setDrinks(updated);
    notify();
  }, []);

  const duplicateDrink = useCallback((id: string) => {
    const current = loadDrinks();
    const original = current.find(d => d.id === id);
    if (!original) return;
    const copy: Drink = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [copy, ...current];
    saveDrinks(updated);
    setDrinks(updated);
    notify();
  }, []);

  return { drinks, addDrink, updateDrink, deleteDrink, toggleFavorite, duplicateDrink };
}
