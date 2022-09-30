'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-09-25T17:01:17.194Z',
    '2022-09-26T23:36:17.929Z',
    '2022-09-27T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-08-10T14:43:26.374Z',
    '2022-09-10T18:49:59.371Z',
    '2022-09-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Gianluca Giovannini',
  movements: [5000, -4000, -150, 6700, -150, -200, 9500, -30, -872],
  interestRate: 1.7,
  pin: 3333,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-08-10T14:43:26.374Z',
    '2022-09-28T18:49:59.371Z',
    '2022-09-29T12:01:20.894Z',
    '2022-09-30T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'it-IT',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

/**
 * ### formatMovementDate
 * - confronta la data attuale con la data del movimento
 * - in base al risultato restituisce o la data o quanti giorni fa è stato fatto il movimento
 *
 * @param {string} date
 * @returns
 */
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

/**
 * ### formatCur
 * - formatta i valori in base alla località
 * @param {number} value
 * @param {string} locale
 * @param {string} currency
 * @returns
 */
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * ### displayMovements
 * - elimina il contenuto html dove sono i movimenti
 * - cicla i movimenti e inserisce l'html
 * @param {array} movements
 */
const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/**
 * ### calcDisplayBalance
 * - somma e sottrae tutti i valori dell'array
 * - stampa il "balance"
 * @param {object} movements
 */
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

/**
 * ### calcDisplaySummary
 * questa funzione serve a mostrare in totale dei versamenti e dei prelievi e gli interessi sull'attivo
 *
 * - const incomes = calcolo di tutti i versamenti fatti
 * - const out  = calcolo di tutte le uscite
 * - const interest = calcolo degli interessi
 *
 *
 * @param {object} acc
 */
const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);  // per fare debugging aggiungo i parametri
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

/**
 * ### createUsernames
 * - cicla l'oggetto
 * - crea la proprietà username (.username)
 * - prende il valore della proprietà owner
 * - - usa .toLowerCase() "lettere minuscole"
 * - - usa .split(" ") per dividere le parole in un array
 * - - usa .map() per prendere la prima lettera
 * - - usa .join("") per unire l'array in una stringa
 * risultato: prime lettere del nome e cognome
 * @param {object} account
 */
const createUsernames = account => {
  account.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

/**
 * ### updateUI
 * - Mostra i movimenti
 * - Mostra le tue finanze
 * - Mostra le somme delle tue finanze
 * @param {object} acc
 */
const updateUI = acc => {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// LOG-OUT timer
const startLogOutTimer = function () {
  // function to print min to log out
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call print the remaining time to UI
    labelTimer.textContent = `${min}: ${sec}`;

    // When the timer is 0s, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';

      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// // FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Login
btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();
  containerApp.style.opacity = 100;

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Current Date
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    // LINGUA LOCALE
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // serve a togliere il focus

    // Timer
    if (timer) clearInterval(timer);

    timer = startLogOutTimer();

    // Display movements, balance, summary
    updateUI(currentAccount);
  }
});

// Transferimento soldi
btnTransfer.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);

  // Clear input to transfer money
  inputTransferAmount.value = inputTransferTo.value = '';

  // Transfer control
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Prestito
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1) &&
    amount < 10000
  ) {
    setTimeout(function () {
      // add movement
      currentAccount.movements.push(amount);

      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }

  inputLoanAmount.value = '';

  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

// Eliminazione account
btnClose.addEventListener('click', e => {
  // Prevent form from submitting
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    // Find index to delete
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);

    // Delete user
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clear close account form
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* Converting and Checking numbers */
// // base 10 - 0 to 9 . 1/10 = 0.1   -  3/10 = 3.3333333
// // binary base 2 - 0 1

// // converting string to numbers
// console.log(Number('23')); // 23
// console.log(+'23'); // 23

/* 
/////////////////////////////////////////////////
/////////////////////////////////////////////////
 PARSING  */
/* .parseInt */
// console.log(Number.parseInt('30px', 10)); //  30
// console.log(Number.parseInt('e23', 10)); // NaN
// console.log(Number.parseInt('  2.5rem  ')); // 2
/* .parseFloat */
// // miglior modo per leggere un valore che passi dal css
// console.log(Number.parseFloat('  2.5rem  ')); // 2.5
// // console.log(parseFloat('  2.5rem  ')); // 2.5
/* .isNaN */
// // utile a verificare se non è un numero
// console.log(Number.isNaN(20)); // false
// console.log(Number.isNaN('20')); // false
// console.log(Number.isNaN(+'20X')); // true
// console.log(Number.isNaN(23 / 0)); // false
/* .isFinite */
// // miglior modo per verificare se è un numero
// console.log(Number.isFinite(20)); // true
// console.log(Number.isFinite('20')); // false
// console.log(Number.isFinite(+'20x')); // false
// console.log(Number.isFinite(23 / 0)); // false
/* .isInteger */
// console.log(Number.isInteger(23)); // true
// console.log(Number.isInteger(23.0)); // true
// console.log(Number.isInteger(23 / 0)); // false

/*/////////////////////////////////////////////////
/////////////////////////////////////////////////
 MATH AND ROUNDING */

/* Radice quadrata */
// console.log(Math.sqrt(25)); // 5
// console.log(25 ** (1 / 2)); // 5
// console.log(8 ** (1 / 3)); // 2 RADICE CUBICA

/* Massimo valore tra numeri*/
// console.log(Math.max(5, 18, 23, 11, 2)); // 23
// console.log(Math.max(5, 18, '23', 11, 2)); // 23
// console.log(Math.max(5, 18, '23px', 11, 2)); // NaN

/* Minimo valore tra numeri */
// console.log(Math.min(5, 18, 23, 11, 2)); // 2
// console.log(Math.min(5, 18, '23', 11, 2)); // 2
// console.log(Math.min(5, 18, '23px', 11, 2)); // NaN

/* Area di un cerchio */
// console.log(Math.PI * Number.parseFloat('10px') ** 2); // 314.1592653589793

/* Numeri random  */
// console.log(Math.trunc(Math.random() * 6) + 1); // numeri da 1 a 6
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10, 20)); //

/* Rounding Integers */
// // tutti questi metodi fanno la coercizione quindi puoi usare una stringa e la transforma in numero
// // .trunc - arrotonda in base al numero intero
// console.log(Math.trunc(23.9)); // 23
// console.log(Math.trunc('23.9')); // 23
// // .round - arrotonda in base al più vicino
// console.log(Math.round(23.3)); // 23
// console.log(Math.round(23.9)); // 24
// console.log(Math.round('23.9')); // 24
// // .ceil - arrotonda per eccesso
// console.log(Math.ceil(23.3)); // 24
// console.log(Math.ceil(23.9)); // 24
// console.log(Math.ceil('23.9')); // 24
// // .floor - arrotonda per difetto
// console.log(Math.floor(23.3)); // 23
// console.log(Math.floor(23.9)); // 23
// console.log(Math.floor('23.9')); // 23

/* ///////////////////////
Numeri negativi */
// console.log(Math.trunc(-23.9)); // -23
// console.log(Math.floor(-23.9)); // -24 con il floor l'arrotondamento funziona al contrario quindi arrotonda per eccesso

/* Rounding  decimals*/
/* .toFixed() arrotonda in base al più vicino e transforma il numero in stringa */
// console.log((2.4).toFixed(0)); // "2"
// console.log((2.5).toFixed(0)); // '3'
// console.log((2.7).toFixed(0)); // '3'
// console.log((2.4).toFixed(1)); // '2.4'
// console.log((2.5).toFixed(2)); // '2.50'
// console.log((2.7).toFixed(3)); // '2.700'
// console.log((2.345).toFixed(2)); // '2.35'
// console.log(+(2.345).toFixed(2)); // 2.35

/* /////////////////////////////////////////////////
/////////////////////////////////////////////////
THE REMAINDER OPERATOR (resto )*/
// console.log(5 % 2); // 1
// console.log(5 / 2); // 2.5 (5 = 2 * 2 + 1) 1 è il resto

// console.log(8 % 3); // 2
// console.log(8 / 3); // 2.666666 (8 = 2 * 3 + 2) 2 è il resto

// console.log(6 % 2); // 0
// console.log(6 / 2); // 3 (6 =  2 * 3 ) 0 è il resto

// console.log(7 % 2); // 1
// console.log(7 / 2); // 3.5 (6 =  2 * 3.5 + 1) 1 è il resto

// /* pari o dispari */
// const isEven = n => n % 2 === 0;
// console.log(isEven(8)); // true ( pari )
// console.log(isEven(23)); // false ( dispari )
// console.log(isEven(214)); // true ( pari )

// // esempio ( colorare le row ( tag ) una si e una no )
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     console.log(row);
//     // 0 - 2 - 4 - 6
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     // 0 - 3 - 6 - 9
//     if (i % 3 === 0) row.style.backgroundColor = ' blue';
//   });
// });

/* /////////////////////////////////////////////////
/////////////////////////////////////////////////
NUMERIC SEPARATORS*/
// // Serve a formare numeri in modo più facile da leggere
// // rappresentiamo il diametro del nostro sistema solare
// // 287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter); // 287460000000

// const price = 345_99;
// console.log(price); // 34599

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.14_15;
// console.log(PI); // 3.1415

// console.log(Number('230000')); // non puoi scrivere 230_000 perchè si riceve NaN
// console.log(parseInt('230_000')); // non puoi scrivere 230_000 perché si riceverebbe 230

/* /////////////////////////////////////////////////
/////////////////////////////////////////////////
WORKING WITH BIGINT*/
// // I numeri sono divisi in 64 bit - 53 per i numeri ed il resto per le virgole
// console.log(2 ** 53 - 1); // 9007199254740991 il numero più grande che javascript può rappresentare
// console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
// console.log(2 ** 53 - 9); // 9007199254740983 è più piccolo

// // se aggiungiamo n in fondo al numero allora sarà un bigInt
// console.log(456431423465416165465416516546516465161654); // 4.564314234654162e+41
// console.log(456431423465416165465416516546516465161654n); // 456431423465416165465416516546516465161654n
// console.log(BigInt(4564314234654)); // solo per numeri più piccoli

// // operations ( non si può mescolare numeri normali con numeri bigInt)
// console.log(10000n + 10000n); // 20000n
// console.log(543213654651616546511651651651n * 10000000000000000n); // 5432136546516165465116516516510000000000000000n

// // console.log(Math.sqrt(16n)); // script.js:485 Uncaught TypeError: Cannot convert a BigInt value to a number

// const huge = 13513546516516541n;
// const num = 23;
// // console.log(huge * num); // script.js:487 Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions

// console.log(huge * BigInt(num)); // 310811569879880443n

// // eccezioni
// console.log(20n > 15); // true
// console.log(20n === 20); // false perché js non fa la coercizione
// console.log(typeof 20n); // bigint
// console.log(20n == 20); // true
// console.log(20n == '20'); // true

// console.log(huge + '  is REALLY big!!!'); // "13513546516516541  is REALLY big!!!"

// // Divisions
// console.log(10n / 3n); // 3n ( taglia la parte decimale)
// console.log(10 / 3); // 3.3333333333333335

/* /////////////////////////////////////////////////
/////////////////////////////////////////////////
CREATING DATES   - DATE */
//// Create a Date ( mese  giorno anno ora minuti secondi)
// const now = new Date();
// console.log(now);
// // Tue Sep 27 2022 20:11:38 GMT+0200 (Ora legale dell’Europa centrale)

// console.log(new Date('Sep 27 2022 20:12:03'));
// // Tue Sep 27 2022 20:12:03 GMT+0200 (Ora legale dell’Europa centrale)

// console.log(new Date('December 24, 2015'));
// // Thu Dec 24 2015 00:00:00 GMT+0100 (Ora standard dell’Europa centrale)

// console.log(new Date(account1.movementsDates[0]));
// // Mon Nov 18 2019 22:31:17 GMT+0100 (Ora standard dell’Europa centrale)

// /////// I mesi in javascript partono da 0 per questo il decimo mese è novembre e non ottobre
// console.log(new Date(2037, 10, 19, 15, 23, 5));
// // Thu Nov 19 2037 15:23:05 GMT+0100 (Ora standard dell’Europa centrale)

// /////// se sbagliamo il giorno in automatico js se ne accorge e corregge
// console.log(new Date(2037, 10, 31));
// // Tue Dec 01 2037 00:00:00 GMT+0100 (Ora standard dell’Europa centrale)

// console.log(new Date(0));
// // Thu Jan 01 1970 01:00:00 GMT+0100 (Ora standard dell’Europa centrale)

// // 3giorni * 24ore * 60minuti *60minuti * 1000millisecondi
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// // Sun Jan 04 1970 01:00:00 GMT+0100 (Ora standard dell’Europa centrale)

/* Working with Dates */
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future); // Thu Nov 19 2037 15:23:00 GMT+0100
// console.log(future.getFullYear()); // 2037
// console.log(future.getMonth()); // 10 (Novembre perchè i mesi partono da 0)
// console.log(future.getDate()); // 19 ( il numero del giorno)
// console.log(future.getDay()); // 4 (il giorno della settimana ( 0 è domenica quindi 4 è il giovedì))
// console.log(future.getHours()); // 15
// console.log(future.getMinutes()); // 23
// console.log(future.getSeconds()); // 0

// //// PER CONSERVARE LE DATE UTILIZZARE IL FORMATO ISO
// // data in formato ISO in stringa ( standard internazionale )
// console.log(future.toISOString()); // 2037-11-19T14:23:00.000Z

// //// TIMESTAMP sono i millisecondi che sono passati dal 1 gennaio 1970
// console.log(future.getTime()); // 2142253380000

// // per avere il timestamp attuale
// console.log(Date.now()); // 1664303618724

// // si può invertire il timestamp in un data
// console.log(new Date(2142253380000)); // Thu Nov 19 2037 15:23:00 GMT+0100

// // SETTARE LE DATE O PARTI DELLA DATA
// console.log(future); // Thu Nov 19 2037 15:23:00 GMT+0100
// future.setFullYear(2040);
// future.setMonth(2);
// future.setDate(15);
// future.setHours(7);
// future.setMinutes(56);
// future.setSeconds(15);
// console.log(future); // Thu Mar 15 2040 07:56:15 GMT+0100

/* Operation with Dates */
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future); // 2142253380000 TIMESTAMP

// const calcDaysPassed = (date1, date2) =>
//   Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

// const days1 = calcDaysPassed(
//   new Date(2037, 3, 4),
//   new Date(2037, 3, 14, 10, 8)
// );
// console.log(days1); // 10 (days)

/* /////////////////////////////////////////////////
Internationalizing Dates (INTL) */
// JAVASCRIPT HA UN'API CHE CONVERTE TUTTE LE LINGUE DEL MONDO
// const dataAttuale = new Date();
// labelDate.textContent = new Intl.DateTimeFormat('en-US').format(dataAttuale); // 9/28/2022 mm/gg/yy
// labelDate.textContent = new Intl.DateTimeFormat('en-GB').format(dataAttuale); // 28/09/2022 gg/mm/yy
// labelDate.textContent = new Intl.DateTimeFormat('ar-SY').format(date); //As of ٢٠٢٢/٩/٢٨

/* PER VEDERE TUTTI I CODICI ISO DELLE LINUGE */
// http://www.lingoes.net/en/translator/langcode.htm

// experimenting api date
// const now = new Date();
// const options = {
//   hour: 'numeric', // 6 pm
//   minute: 'numeric', // 6:22 pm
//   day: 'numeric', // 28
//   // month: 'numeric', // 9
//   // month: 'long', // semptember
//   month: '2-digit', // 09
//   year: 'numeric', // 2022
//   // year: '2-digit', // 2022
//   weekday: 'long', // Wednesday
// };
// labelDate.textContent = new Intl.DateTimeFormat('en-US').format(now); // As of 9/28/2022
// labelDate.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);

/* prendere la lingua locale dal browser */
// const locale = navigator.language;
// console.log(locale); // it-IT
// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now); // mercoledì 28/09/2022, 18:27

/* /////////////////////////////////////////////////
Internationalizing Numbers (INTL) */
// const num = 3884764.23;

// const options = {
//   // //  style: 'unit',
//   //   style: 'percent',
//   style: 'currency',
//   // //  unit: 'mile-per-hour',
//   // //  unit: 'celsius',
//   currency: 'EUR', // VA SPECIFICATO perchè non è determinata dal "locale"
//   // useGrouping: false, // toglie le virgole e i punti prima dei decimali
// };

// console.log('us: ', new Intl.NumberFormat('en-US').format(num)); // us:  3,884,764.23
// console.log('gb: ', new Intl.NumberFormat('en-GB').format(num)); // gb:  3,884,764.23
// console.log('it: ', new Intl.NumberFormat('it-IT').format(num)); // it:  3.884.764,23
// // // // console.log('it: ', new Intl.NumberFormat('it-IT', options).format(num)); // it:  3.884.764,23 mi/h
// // // console.log('it: ', new Intl.NumberFormat('it-IT', options).format(num)); // it:  3.884.764,23 °C
// // console.log('it: ', new Intl.NumberFormat('it-IT', options).format(num)); // it:  388.476.423%
// console.log('it: ', new Intl.NumberFormat('it-IT', options).format(num)); // it:  3.884.764,23 €

// /* prendere la formattazione locale dal browser */
// console.log(
//   'browser: ',
//   navigator.language,
//   ' ',
//   new Intl.NumberFormat(navigator.language).format(num)
// ); // browser:  it-IT   3.884.764,23

/* /////////////////////////////////////////////////
/////////////////////////////////////////////////
TIMER: setTimout and setInterval*/

/* setTimout ( asincrono )
viene eseguito una volta dopo un tempo definito*/
// // quando il codice viene letto esegue il timeout e prosegue a leggere il codice quindi la funzione che eseguirà viene messa dopo nello stack
// setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
//   3000,
//   'olives',
//   'spinach'
// ); // 3 secondi dopo
// console.log('Waiting pizza...'); // apparte prima

// // ClearTimout ( stopprare )
// const ingredients = ['olives', 'spinach'];

// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
//   3000,
//   ...ingredients
// ); // 3 secondi dopo
// console.log('Waiting pizza...'); // apparte prima

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

/* setInterval 
viene eseguito di continuo fino a che non viene stoppato*/
// setInterval(function () {
//   const options = {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   };
//   const now = new Intl.DateTimeFormat(navigator.locale, options).format(
//     new Date()
//   );
//   console.log(now);
// }, 1000);
