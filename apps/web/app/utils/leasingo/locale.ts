/**
 * leasinGo embeds German UI strings in their merchant calculator bundle.
 * The widget reads `globalThis.leasinGoTranslations` and
 * `window.leasingoCalculatorConfig` at runtime — we overlay the active shop locale.
 */

export type LeasingoLocaleCode = 'de' | 'en' | 'es' | 'fr' | 'pt' | 'cn' | 'nn';

export type LeasingoConfigLabels = {
  objectConditions: { id: number; name: string }[];
  financeProducts: { id: number; name: string; closingPaymentLabel: string }[];
  categories: { id: number; description: string }[];
};

type LeasingoTranslations = Record<string, string>;

const EN_TRANSLATIONS: LeasingoTranslations = {
  'Clipboard.ClickToCopy.Tooltip': 'Copy',
  'Clipboard.ClickToCopy.Success': 'Copied',
  'Clipboard.ClickToCopy.Error': 'Clipboard access not possible, please copy manually.',
  'Common.InCooperationWith': 'In cooperation with',
  'Common.StartingFrom': 'from',
  'Common.PerMonth': 'per month',
  'Common.Months': 'months',
  'Common.ContractType': 'Contract type',
  'Common.Rate': 'Rate',
  'Common.Maturity': 'Term',
  'Common.Send': 'Send',
  'Common.Error.InputRequired': 'Input required',
  'Common.Clipboard.CopyLink': 'Copy link',
  'Common.Clipboard.LinkCopied': 'The link has been copied to the clipboard.',
  'Common.Clipboard.CopyText': 'Copy text',
  'Common.SelectCategory': 'Select category...',
  'Common.Clipboard.TextCopied': 'The text has been copied to the clipboard.',
  'Common.Clipboard.TextError': 'The text could not be copied to the clipboard, please copy manually.',
  'Common.DepositPayment': 'Down payment',
  'Common.CostsOfPurchase': 'Purchase costs',
  'Common.Files': 'Files',
  'Common.ContactPerson': 'Contact person',
  'Common.Dropdown.NoSelection': 'Select...',
  'Common.Reset': 'Reset',
  'Common.Number.Abbreviated': 'No.',
  'Common.DeleteAssignment': 'Remove assignment',
  'Common.Assign': 'Assign',
  'Widgets.MonthlyRate': 'Monthly rate',
  'Widgets.CalculationCreditRatingInfo': 'Calculation based on average credit rating',
  'Widgets.StartRequest': 'Start enquiry',
  'Widgets.UpdateCalculation': 'Update calculation',
  'Widgets.SaveRequest': 'Save and continue later',
  'Widgets.RealTimeResult': 'leasinGo real-time result',
  'Widgets.LowestRate': 'lowest rate',
  'Widgets.MedianRate': 'median rate',
  'Widgets.HighestRate': 'highest rate',
  'Widgets.LowestMonthlyRate': 'lowest monthly rate',
  'Widgets.MedianMonthlyRate': 'median monthly rate',
  'Widgets.HighestMonthlyRate': 'highest monthly rate',
  'Widgets.CalculationResult.SingleProvider':
    'based on <strong>one</strong> possible financing partner',
  'Widgets.CalculationResult.MultipleProviders':
    'based on <strong>{numOffers}</strong> possible financing partners',
  'Widgets.Checkout.SkipContact': 'Add contact person later',
  'Widgets.Checkout.SkipContact.Hint': 'required for contract creation',
  'Widgets.Checkout.ShowSalesText': 'Show offer text',
  'Widgets.Checkout.Summary.Title': 'Summary',
  'Widgets.Checkout.Summary.Maturity': '{months} months term',
  'Widgets.Checkout.ShowComparison': 'Show comparison',
  'Widgets.Checkout.CompanyMode.Search': 'Search financing party',
  'Widgets.Checkout.CompanyMode.Manual': 'Enter data manually',
  'Widgets.CompanyEstablishedDate.Settled': 'Company established for more than 2 years',
  'Widgets.CompanyEstablishedDate.Startup': 'less than 2 years',
  'Widgets.Checkout.RequestOffer': 'Start enquiry',
  'Widgets.Checkout.RequestOffer.Dashboard': 'Create non-binding offer',
  'Widgets.Checkout.RequestOffer.EndToEnd': 'Direct conclusion',
  'Widgets.Checkout.Offer': 'Offer',
  'Widgets.Checkout.Offer.ShowDetails': 'Show details',
  'Widgets.Checkout.Offer.InfoTitle': 'Further information',
  'Widgets.Checkout.Step1.Title': 'Investment details',
  'Widgets.Checkout.Step2.Title': 'Financing party',
  'Widgets.Checkout.Step3.Title': 'Instant comparison',
  'Widgets.Checkout.Step4.Title': 'Completed',
  'Widgets.Checkout.ProceedButton': 'Further details',
  'Widgets.Offers.EndToEnd.Title':
    'Contract conclusion <span>immediately online</span> possible &mdash; without further processing steps',
  'Widgets.Offers.Title': 'Request binding offer',
  'Widgets.Offers.NoOffers':
    'Unfortunately we could not find any suitable offers for your enquiry. Please contact us or try again later.',
  'Widgets.CompanySearch.Searching':
    'Searching for company. One moment, this only takes a few seconds...',
  'Widgets.CompanySearch.NoResults': 'No matching company was found.',
  'Widgets.CompanySearch.YourCompany': 'Your company',
  'Widgets.CompanySearch.ChooseCompany': 'Please select your company',
  'Widgets.CompanySearch.ShowAll': 'Show all results',
  'Widgets.Checkout.Success.Intro':
    'Here you will find a summary of your enquiry. You can also send us documents and messages about your enquiry.',
  'Widgets.Checkout.Success.OfferEmailHint':
    'A non-binding detailed offer will soon be in the inbox of your email address <strong>{email}</strong>.',
  'Widgets.Checkout.Success.EndToEnd.NextSteps':
    'For the next steps towards direct conclusion you need to sign in to your leasinGo dashboard.',
  'Widgets.Checkout.Success.DashboardLink': 'Go to the dashboard',
  'Widgets.Checkout.Success.EmailInfo':
    'You will shortly receive an email with a link to activate your customer account at your email address',
  'Widgets.Checkout.Success.SummaryTitle': 'Summary of your enquiry:',
  'Widgets.Checkout.Success.Objectclass': 'Object class',
  'Widgets.Checkout.Success.Objectdescription': 'Description',
  'Widgets.Checkout.Success.FinancingOfferPdfLink': 'Download financing concept as PDF',
  'Widgets.Checkout.Success.FractionOfTheCostsOfPurchase': 'of purchase value',
  'Widgets.Checkout.Success.Dropzone.Text':
    '<strong>Click here</strong> or drag your files directly into this area',
  'Widgets.Checkout.Success.AlternativeEmail': 'Alternatively: send by email',
  'Widgets.Checkout.Success.AlternativeEmail.Info':
    'Send the documents, briefly stating your requested object, to',
  'Widgets.Checkout.Success.AlternativeEmail.Contact': 'your personal contact',
  'Widgets.Checkout.Success.NextSteps': 'Next steps:',
  'Widgets.Checkout.Success.Step1.Description':
    'We need the object documentation for further processing. <br/>This is e.g. the order or the supplier offer.<br/><br/>If it is an online offer, please provide a screenshot or PDF of the page (external links cannot be processed).',
  'Widgets.Checkout.Success.Step2.Description':
    'We review the selected financing option in detail. To do this we obtain a Creditreform report on the lessee.',
  'Widgets.Checkout.Success.Dialog.Title': 'Your message',
  'Widgets.Checkout.Success.Dialog.Placeholder': 'Your message (optional)',
  'Widgets.Checkout.Success.Dialog.SentMessages': 'Sent messages',
  'Widgets.Checkout.Success.NewRequest':
    'Start another financing comparison without re-entering your contact and company details',
  'Widgets.Checkout.Success.NewRequest.Link': 'with one click here',
  'Widgets.Checkout.Success.RequiredDocuments.Info':
    'For faster processing, financial information about the lessee would help, preferably a current management report (BWA) including a trial balance.',
  'Widgets.Checkout.Success.RequiredDocuments.UploadInfo':
    'We provide a secure area to upload your files for your {financeProductName} enquiry',
  'Widgets.Checkout.Success.UploadSection.Title': 'Upload data directly',
  'Widgets.Checkout.Success.UploadSection.Info':
    'Upload outstanding documents directly via the leasinGo secure server. Maximum file size 128MB',
  'Widgets.SaveCheckout.Title': 'Your enquiry link',
  'Widgets.SaveCheckout.Loading': 'Your enquiry is being saved...',
  'Widgets.SaveCheckout.Info': 'With the following link you can reopen your current enquiry at any time:',
  'Widgets.Field.ObjectPriceNetto': 'Purchase costs (net)',
  'Widgets.Field.ObjectQuantity': 'Quantity',
  'Widgets.Field.Manufacturer': 'Manufacturer',
  'Widgets.Field.Model': 'Model',
  'Widgets.Field.CompanyEstablishedDate': 'Company founding date',
  'Widgets.Field.YearOfConstruction': 'Year of manufacture',
  'Widgets.Field.OperatingHours': 'Operating hours / km',
  'Widgets.Field.ObjectUnitPriceNetto': 'Unit price (net)',
  'Widgets.Field.ContractType': 'Desired contract type',
  'Widgets.Field.Maturity': 'Desired contract term',
  'Widgets.Field.DepositPayment': 'Desired down payment',
  'Widgets.Field.DepositPayment.Tooltip':
    'The down payment reduces your monthly rate.<br />It can also positively accelerate the credit decision in some cases.',
  'Widgets.Field.ClosingPayment': 'Desired residual value',
  'Widgets.Field.ClosingPayment.Tooltip':
    'The residual value should reflect actual use<br />and wear of the leased asset.',
  'Widgets.Field.EndingRate': 'Desired final installment',
  'Widgets.Field.Category': 'Main category',
  'Widgets.Field.Subcategory': 'Subcategory',
  'Widgets.Checkout.Field.AcceptTerms':
    'Accept <a href="{termsOfBusinessUrl}" target="_blank">Terms</a> and <a href="{privacyPolicyUrl}" target="_blank">Privacy policy</a>',
  'Widgets.Checkout.Field.Company': 'Company name',
  'Widgets.Checkout.Field.HouseNumber': 'No.',
  'Widgets.Checkout.Field.ZipOrCity': 'Postcode or city',
  'Widgets.Checkout.CompanyPage.ForceManualInput': 'Please enter your company details manually.',
  'Field.Street': 'Street',
  'Field.LegalForm': 'Legal form',
  'Field.Zip': 'Postcode',
  'Field.City': 'City',
  'Field.Country': 'Country',
  'Field.Salutation': 'Salutation',
  'Field.Title': 'Title',
  'Field.Firstname': 'First name',
  'Field.Lastname': 'Last name',
  'Field.Email': 'Email',
  'Field.NewsletterOptin': 'Newsletter',
  'Field.Telephone': 'Phone',
  'Field.SolvencyIndex': 'Credit index',
  'Field.Company': 'Company',
  'Field.Name': 'Name',
  'Field.Contact': 'Contact person',
  'Field.CreatedAt': 'Created',
  'Field.UpdatedAt': 'Updated',
  'Field.CompanyEstablishedDate': 'Founding date',
  'Validation.Error.Between': 'Please enter a value between {minValue} and {maxValue}.',
  'Validation.Error.EnterSpecificValue': 'Please enter {value}.',
  'Validation.Error.MinMax.TooSmall': 'Please enter a value greater than or equal to {value}.',
  'Validation.Error.MinMax.TooHigh': 'Please enter a value less than or equal to {value}.',
  'Validation.Error.MaxLength': 'Please enter at most {maxLength} characters.',
  'Validation.Error.MinLength': 'Please enter at least {minLength} characters.',
  'Validation.Error.YearOfConstruct':
    'Please enter the year of manufacture as a four-digit year, e.g. "2020".',
  'Validation.Error.OperatingHours': 'Please enter operating hours or mileage as a whole number.',
  'Validation.Error.TermsAccepted': 'Please accept the terms and privacy policy',
  'Validation.Error.PostalCode': 'Please enter a valid postcode',
  'Validation.Error.Zip': 'Please enter a valid postcode.',
  'Validation.Error.Email': 'Please enter a valid email address.',
};

/** Visible calculator surface + shared labels for non-English locales (falls back to EN). */
const LOCALE_TRANSLATION_OVERRIDES: Partial<Record<LeasingoLocaleCode, LeasingoTranslations>> = {
  es: {
    'Widgets.UpdateCalculation': 'Actualizar cálculo',
    'Widgets.StartRequest': 'Iniciar solicitud',
    'Widgets.Field.ObjectPriceNetto': 'Costes de adquisición (neto)',
    'Widgets.Field.Maturity': 'Duración deseada del contrato',
    'Widgets.Field.DepositPayment': 'Pago inicial deseado',
    'Widgets.Field.ClosingPayment': 'Valor residual deseado',
    'Widgets.Field.EndingRate': 'Cuota final deseada',
    'Widgets.Field.Category': 'Categoría principal',
    'Widgets.Field.Subcategory': 'Subcategoría',
    'Widgets.LowestRate': 'tarifa más baja',
    'Widgets.MedianRate': 'tarifa media',
    'Widgets.HighestRate': 'tarifa más alta',
    'Widgets.MonthlyRate': 'Cuota mensual',
    'Widgets.RealTimeResult': 'Resultado en tiempo real de leasinGo',
    'Common.Months': 'meses',
    'Common.DepositPayment': 'Pago inicial',
    'Common.CostsOfPurchase': 'Costes de adquisición',
    'Common.SelectCategory': 'Seleccionar categoría...',
    'Common.Dropdown.NoSelection': 'Seleccionar...',
  },
  fr: {
    'Widgets.UpdateCalculation': 'Mettre à jour le calcul',
    'Widgets.StartRequest': 'Démarrer la demande',
    'Widgets.Field.ObjectPriceNetto': "Coûts d'acquisition (net)",
    'Widgets.Field.Maturity': 'Durée de contrat souhaitée',
    'Widgets.Field.DepositPayment': 'Acompte souhaité',
    'Widgets.Field.ClosingPayment': 'Valeur résiduelle souhaitée',
    'Widgets.Field.EndingRate': 'Dernière échéance souhaitée',
    'Widgets.Field.Category': 'Catégorie principale',
    'Widgets.Field.Subcategory': 'Sous-catégorie',
    'Widgets.LowestRate': 'taux le plus bas',
    'Widgets.MedianRate': 'taux médian',
    'Widgets.HighestRate': 'taux le plus élevé',
    'Widgets.MonthlyRate': 'Mensualité',
    'Widgets.RealTimeResult': 'Résultat en temps réel leasinGo',
    'Common.Months': 'mois',
    'Common.DepositPayment': 'Acompte',
    'Common.CostsOfPurchase': "Coûts d'acquisition",
    'Common.SelectCategory': 'Choisir une catégorie...',
    'Common.Dropdown.NoSelection': 'Sélectionner...',
  },
  pt: {
    'Widgets.UpdateCalculation': 'Atualizar cálculo',
    'Widgets.StartRequest': 'Iniciar pedido',
    'Widgets.Field.ObjectPriceNetto': 'Custos de aquisição (líquido)',
    'Widgets.Field.Maturity': 'Duração desejada do contrato',
    'Widgets.Field.DepositPayment': 'Entrada desejada',
    'Widgets.Field.ClosingPayment': 'Valor residual desejado',
    'Widgets.Field.EndingRate': 'Prestação final desejada',
    'Widgets.Field.Category': 'Categoria principal',
    'Widgets.Field.Subcategory': 'Subcategoria',
    'Widgets.LowestRate': 'taxa mais baixa',
    'Widgets.MedianRate': 'taxa média',
    'Widgets.HighestRate': 'taxa mais alta',
    'Widgets.MonthlyRate': 'Prestação mensal',
    'Widgets.RealTimeResult': 'Resultado em tempo real leasinGo',
    'Common.Months': 'meses',
    'Common.DepositPayment': 'Entrada',
    'Common.CostsOfPurchase': 'Custos de aquisição',
    'Common.SelectCategory': 'Selecionar categoria...',
    'Common.Dropdown.NoSelection': 'Selecionar...',
  },
  cn: {
    'Widgets.UpdateCalculation': '更新计算',
    'Widgets.StartRequest': '开始询价',
    'Widgets.Field.ObjectPriceNetto': '购置成本（净价）',
    'Widgets.Field.Maturity': '期望合同期限',
    'Widgets.Field.DepositPayment': '期望首付',
    'Widgets.Field.ClosingPayment': '期望残值',
    'Widgets.Field.EndingRate': '期望尾款',
    'Widgets.Field.Category': '主类别',
    'Widgets.Field.Subcategory': '子类别',
    'Widgets.LowestRate': '最低费率',
    'Widgets.MedianRate': '中位费率',
    'Widgets.HighestRate': '最高费率',
    'Widgets.MonthlyRate': '月费率',
    'Widgets.RealTimeResult': 'leasinGo 实时结果',
    'Common.Months': '月',
    'Common.DepositPayment': '首付',
    'Common.CostsOfPurchase': '购置成本',
    'Common.SelectCategory': '选择类别...',
    'Common.Dropdown.NoSelection': '请选择...',
  },
  nn: {
    'Widgets.UpdateCalculation': 'تحديث الحساب',
    'Widgets.StartRequest': 'بدء الطلب',
    'Widgets.Field.ObjectPriceNetto': 'تكاليف الشراء (صافي)',
    'Widgets.Field.Maturity': 'مدة العقد المطلوبة',
    'Widgets.Field.DepositPayment': 'الدفعة المقدمة المطلوبة',
    'Widgets.Field.ClosingPayment': 'القيمة المتبقية المطلوبة',
    'Widgets.Field.EndingRate': 'القسط الختامي المطلوب',
    'Widgets.Field.Category': 'الفئة الرئيسية',
    'Widgets.Field.Subcategory': 'الفئة الفرعية',
    'Widgets.LowestRate': 'أدنى قسط',
    'Widgets.MedianRate': 'القسط المتوسط',
    'Widgets.HighestRate': 'أعلى قسط',
    'Widgets.MonthlyRate': 'القسط الشهري',
    'Widgets.RealTimeResult': 'نتيجة leasinGo الفورية',
    'Common.Months': 'أشهر',
    'Common.DepositPayment': 'دفعة مقدمة',
    'Common.CostsOfPurchase': 'تكاليف الشراء',
    'Common.SelectCategory': 'اختر الفئة...',
    'Common.Dropdown.NoSelection': 'اختر...',
  },
};

const CONFIG_LABELS: Record<LeasingoLocaleCode, LeasingoConfigLabels> = {
  de: {
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
  },
  en: {
    objectConditions: [
      { id: 0, name: 'used' },
      { id: 1, name: 'new' },
    ],
    financeProducts: [
      { id: 1, name: 'Leasing', closingPaymentLabel: 'Residual value' },
      { id: 2, name: 'Hire purchase', closingPaymentLabel: 'Final installment' },
    ],
    categories: [
      { id: 44367, description: 'Machines' },
      { id: 44368, description: 'Processing machines' },
    ],
  },
  es: {
    objectConditions: [
      { id: 0, name: 'usado' },
      { id: 1, name: 'nuevo' },
    ],
    financeProducts: [
      { id: 1, name: 'Leasing', closingPaymentLabel: 'Valor residual' },
      { id: 2, name: 'Renting', closingPaymentLabel: 'Cuota final' },
    ],
    categories: [
      { id: 44367, description: 'Máquinas' },
      { id: 44368, description: 'Máquinas de procesamiento' },
    ],
  },
  fr: {
    objectConditions: [
      { id: 0, name: "d'occasion" },
      { id: 1, name: 'neuf' },
    ],
    financeProducts: [
      { id: 1, name: 'Leasing', closingPaymentLabel: 'Valeur résiduelle' },
      { id: 2, name: 'Location-vente', closingPaymentLabel: 'Dernière échéance' },
    ],
    categories: [
      { id: 44367, description: 'Machines' },
      { id: 44368, description: 'Machines de traitement' },
    ],
  },
  pt: {
    objectConditions: [
      { id: 0, name: 'usado' },
      { id: 1, name: 'novo' },
    ],
    financeProducts: [
      { id: 1, name: 'Leasing', closingPaymentLabel: 'Valor residual' },
      { id: 2, name: 'Locação financeira', closingPaymentLabel: 'Prestação final' },
    ],
    categories: [
      { id: 44367, description: 'Máquinas' },
      { id: 44368, description: 'Máquinas de processamento' },
    ],
  },
  cn: {
    objectConditions: [
      { id: 0, name: '二手' },
      { id: 1, name: '全新' },
    ],
    financeProducts: [
      { id: 1, name: '租赁', closingPaymentLabel: '残值' },
      { id: 2, name: '租购', closingPaymentLabel: '尾款' },
    ],
    categories: [
      { id: 44367, description: '机器' },
      { id: 44368, description: '加工机械' },
    ],
  },
  nn: {
    objectConditions: [
      { id: 0, name: 'مستعمل' },
      { id: 1, name: 'جديد' },
    ],
    financeProducts: [
      { id: 1, name: 'تأجير', closingPaymentLabel: 'القيمة المتبقية' },
      { id: 2, name: 'التأجير التمويلي', closingPaymentLabel: 'القسط الختامي' },
    ],
    categories: [
      { id: 44367, description: 'آلات' },
      { id: 44368, description: 'آلات المعالجة' },
    ],
  },
};

const normalizeLocale = (locale: string): LeasingoLocaleCode => {
  const base = locale.split('-')[0]?.toLowerCase() || 'de';
  if (base in CONFIG_LABELS) {
    return base as LeasingoLocaleCode;
  }
  return 'de';
};

export const getLeasingoTranslations = (locale: string): LeasingoTranslations => {
  const code = normalizeLocale(locale);
  if (code === 'de') {
    return {};
  }
  return {
    ...EN_TRANSLATIONS,
    ...(LOCALE_TRANSLATION_OVERRIDES[code] || {}),
  };
};

export const getLeasingoConfigLabels = (locale: string): LeasingoConfigLabels => {
  return CONFIG_LABELS[normalizeLocale(locale)];
};

export const getLeasingoCategoryDataAttrs = (
  locale: string,
): { category: string; subcategory: string } => {
  const labels = getLeasingoConfigLabels(locale);
  const main = labels.categories.find((c) => c.id === 44367)?.description || '';
  const sub = labels.categories.find((c) => c.id === 44368)?.description || '';
  return { category: main, subcategory: sub };
};

type LeasingoCalculatorConfig = {
  objectConditions?: { id: number; name: string }[];
  financeProducts?: {
    id: number;
    name: string;
    closingPaymentLabel?: string;
    [key: string]: unknown;
  }[];
  categories?: {
    id: number;
    description?: string;
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
};

const patchCalculatorConfig = (
  config: LeasingoCalculatorConfig,
  labels: LeasingoConfigLabels,
): LeasingoCalculatorConfig => {
  const conditionNames = new Map(labels.objectConditions.map((c) => [c.id, c.name]));
  const productLabels = new Map(labels.financeProducts.map((p) => [p.id, p]));
  const categoryNames = new Map(labels.categories.map((c) => [c.id, c.description]));

  if (Array.isArray(config.objectConditions)) {
    config.objectConditions = config.objectConditions.map((condition) => ({
      ...condition,
      name: conditionNames.get(condition.id) ?? condition.name,
    }));
  }

  if (Array.isArray(config.financeProducts)) {
    config.financeProducts = config.financeProducts.map((product) => {
      const override = productLabels.get(product.id);
      if (!override) {
        return product;
      }
      return {
        ...product,
        name: override.name,
        closingPaymentLabel: override.closingPaymentLabel,
      };
    });
  }

  if (Array.isArray(config.categories)) {
    config.categories = config.categories.map((category) => ({
      ...category,
      description: categoryNames.get(category.id) ?? category.description,
    }));
  }

  return config;
};

let interceptorInstalled = false;
let activeLocale: string = 'de';

/**
 * Installs getters/setters so leasinGo's loader receives localized strings
 * the moment it assigns `leasinGoTranslations` / `leasingoCalculatorConfig`.
 */
export const installLeasingoLocaleInterceptor = (locale: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  activeLocale = locale;
  const win = window as Window & {
    leasinGoTranslations?: LeasingoTranslations;
    leasingoCalculatorConfig?: LeasingoCalculatorConfig;
  };

  if (interceptorInstalled) {
    // Locale changed after install — refresh already-assigned globals before remount.
    const translations = getLeasingoTranslations(activeLocale);
    if (win.leasinGoTranslations && Object.keys(translations).length > 0) {
      Object.assign(win.leasinGoTranslations, translations);
    }
    if (win.leasingoCalculatorConfig) {
      patchCalculatorConfig(win.leasingoCalculatorConfig, getLeasingoConfigLabels(activeLocale));
    }
    return;
  }

  let translationsStore: LeasingoTranslations = { ...(win.leasinGoTranslations || {}) };
  let configStore: LeasingoCalculatorConfig | undefined = win.leasingoCalculatorConfig;

  Object.defineProperty(win, 'leasinGoTranslations', {
    configurable: true,
    enumerable: true,
    get() {
      return translationsStore;
    },
    set(value: LeasingoTranslations) {
      translationsStore = {
        ...(value || {}),
        ...getLeasingoTranslations(activeLocale),
      };
    },
  });

  Object.defineProperty(win, 'leasingoCalculatorConfig', {
    configurable: true,
    enumerable: true,
    get() {
      return configStore;
    },
    set(value: LeasingoCalculatorConfig) {
      configStore = value
        ? patchCalculatorConfig(
            JSON.parse(JSON.stringify(value)) as LeasingoCalculatorConfig,
            getLeasingoConfigLabels(activeLocale),
          )
        : value;
    },
  });

  // Apply immediately if script already populated globals.
  if (Object.keys(translationsStore).length > 0) {
    translationsStore = {
      ...translationsStore,
      ...getLeasingoTranslations(activeLocale),
    };
  }
  if (configStore) {
    configStore = patchCalculatorConfig(
      JSON.parse(JSON.stringify(configStore)) as LeasingoCalculatorConfig,
      getLeasingoConfigLabels(activeLocale),
    );
  }

  interceptorInstalled = true;
};
