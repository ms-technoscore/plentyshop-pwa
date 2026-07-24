import { describe, expect, it } from 'vitest';
import {
  getLeasingoCategoryDataAttrs,
  getLeasingoConfigLabels,
  getLeasingoTranslations,
  installLeasingoLocaleInterceptor,
} from '~/utils/leasingo/locale';

describe('leasingo locale overlay', () => {
  it('returns empty translation overlay for German', () => {
    expect(getLeasingoTranslations('de')).toEqual({});
  });

  it('returns English calculator labels for en', () => {
    const translations = getLeasingoTranslations('en');
    expect(translations['Widgets.UpdateCalculation']).toBe('Update calculation');
    expect(translations['Widgets.Field.DepositPayment']).toBe('Desired down payment');
    expect(translations['Widgets.Field.ClosingPayment']).toBe('Desired residual value');
  });

  it('localizes config option labels per locale', () => {
    expect(getLeasingoConfigLabels('en').objectConditions[0]?.name).toBe('used');
    expect(getLeasingoConfigLabels('en').financeProducts[1]?.name).toBe('Hire purchase');
    expect(getLeasingoConfigLabels('fr').financeProducts[1]?.name).toBe('Location-vente');
  });

  it('exposes matching category data attributes for the active locale', () => {
    expect(getLeasingoCategoryDataAttrs('en')).toEqual({
      category: 'Machines',
      subcategory: 'Processing machines',
    });
    expect(getLeasingoCategoryDataAttrs('de')).toEqual({
      category: 'Maschinen',
      subcategory: 'Be- und Verarbeitungsmaschinen',
    });
  });

  it('merges translations when leasinGo assigns globals', () => {
    installLeasingoLocaleInterceptor('en');

    const win = window as Window & {
      leasinGoTranslations?: Record<string, string>;
      leasingoCalculatorConfig?: {
        objectConditions: { id: number; name: string }[];
        financeProducts: { id: number; name: string; closingPaymentLabel: string }[];
        categories: { id: number; description: string }[];
      };
    };

    win.leasinGoTranslations = {
      'Widgets.UpdateCalculation': 'Kalkulation aktualisieren',
    };
    win.leasingoCalculatorConfig = {
      objectConditions: [
        { id: 0, name: 'gebraucht' },
        { id: 1, name: 'neu' },
      ],
      financeProducts: [
        { id: 1, name: 'Leasing', closingPaymentLabel: 'Restwert' },
        { id: 2, name: 'Mietkauf', closingPaymentLabel: 'Schlussrate' },
      ],
      categories: [
        { id: 44367, description: 'Maschinen' },
        { id: 44368, description: 'Be- und Verarbeitungsmaschinen' },
      ],
    };

    expect(win.leasinGoTranslations?.['Widgets.UpdateCalculation']).toBe('Update calculation');
    expect(win.leasingoCalculatorConfig?.objectConditions[0]?.name).toBe('used');
    expect(win.leasingoCalculatorConfig?.financeProducts[1]?.name).toBe('Hire purchase');
    expect(win.leasingoCalculatorConfig?.categories[0]?.description).toBe('Machines');
  });
});
