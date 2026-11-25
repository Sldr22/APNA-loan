(() => {
  const form = document.getElementById('loanForm');
  const panels = [...document.querySelectorAll('.step-panel')];
  const progressFill = document.getElementById('progressFill');
  const stepCaption = document.getElementById('stepCaption');
  const backButton = document.getElementById('backButton');
  const nextButton = document.getElementById('nextButton');
  const resetButton = document.getElementById('resetButton');
  const formError = document.getElementById('formError');
  const summaryList = document.getElementById('summaryList');
  const languageToggle = document.getElementById('languageToggle');
  let currentStep = 0;
  let language = 'en';
  const fields = ['loanType', 'amount', 'work', 'income', 'period'];
  const labels = {
    loanType: ['Loan purpose', 'قرض کا مقصد'],
    amount: ['Amount requested', 'مطلوبہ رقم'],
    work: ['Work type', 'کام کی نوعیت'],
    income: ['Monthly income range', 'ماہانہ آمدنی'],
    period: ['Preferred repayment period', 'پسندیدہ ادائیگی کی مدت']
  };

  function valueOf(name) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
  }

  function showStep(step) {
    currentStep = step;
    panels.forEach((panel, index) => panel.classList.toggle('active', index === step));
    const pct = step === 5 ? 100 : ((step + 1) / 5) * 100;
    progressFill.style.width = pct + '%';
    stepCaption.textContent = step === 5
      ? (language === 'en' ? 'DEMO SUMMARY' : 'ڈیمو خلاصہ')
      : (language === 'en' ? `STEP ${step + 1} OF 5` : `مرحلہ ${step + 1} از 5`);
    backButton.disabled = step === 0;
    backButton.style.visibility = step === 5 ? 'hidden' : 'visible';
    nextButton.textContent = step === 4
      ? (language === 'en' ? 'View summary →' : 'خلاصہ دیکھیں ←')
      : (language === 'en' ? 'Continue →' : 'جاری رکھیں ←');
    nextButton.style.display = step === 5 ? 'none' : 'inline-flex';
    formError.textContent = '';
    if (step === 5) buildSummary();
  }

  function buildSummary() {
    summaryList.innerHTML = '';
    fields.forEach((field) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = labels[field][language === 'en' ? 0 : 1];
      const val = valueOf(field);
      dd.textContent = field === 'amount' && /^\d+$/.test(val)
        ? 'Rs. ' + Number(val).toLocaleString('en-PK')
        : val;
      row.append(dt, dd);
      summaryList.append(row);
    });
  }

  function validateStep() {
    const field = fields[currentStep];
    if (!valueOf(field)) {
      formError.textContent = language === 'en'
        ? 'Please select an option to continue.'
        : 'آگے بڑھنے کے لیے ایک آپشن منتخب کریں۔';
      return false;
    }
    return true;
  }

  nextButton.addEventListener('click', () => {
    if (currentStep < 5 && validateStep()) showStep(currentStep + 1);
  });
  backButton.addEventListener('click', () => {
    if (currentStep > 0) showStep(currentStep - 1);
  });
  resetButton.addEventListener('click', () => {
    form.reset();
    showStep(0);
  });
  form.addEventListener('submit', (event) => event.preventDefault());

  languageToggle.addEventListener('click', () => {
    language = language === 'en' ? 'ur' : 'en';
    document.body.classList.toggle('urdu', language === 'ur');
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en][data-ur]').forEach((el) => {
      el.innerHTML = el.dataset[language];
    });
    languageToggle.textContent = language === 'en' ? 'اردو' : 'English';
    showStep(currentStep);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  showStep(0);
})();