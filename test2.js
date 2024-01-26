// polyfill for IE /////////////////////////////////////////////////////////////////////

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// date block ////////////////////////////////////////////////////////////////////////
const date = document.querySelector(".date");
const month = document.querySelector(".month");
const year = document.querySelector(".year");
const hour = document.querySelector(".hour");
const minute = document.querySelector(".minute");

function curr_time() {
  const d1 = new Date();
  date.innerText = d1.getDate() < 10 ? `0${d1.getDate()}` : d1.getDate();
  month.innerText = d1.getMonth() < 10 ? `${d1.getMonth()}` : d1.getMonth();
  year.innerText = d1.getFullYear();
  hour.innerText = d1.getHours() < 10 ? `0${d1.getHours()}` : d1.getHours();
  minute.innerText =
    d1.getMinutes() < 10 ? `0${d1.getMinutes()}` : d1.getMinutes();
}

setInterval(curr_time, 1000);
curr_time();

const seconds = document.querySelector(".seconds");

setInterval(function () {
  seconds.classList.toggle("seconds_hidden");
}, 800);

// dropdown /////////////////////////////////////////////////////////////////////////////

document.querySelectorAll(".dropdown").forEach(function (item) {
  let dropdown_button_1 = document.querySelector(
    "[data-dropdown_button='dropdown_list_1']"
  );
  let dropdown_button_2 = document.querySelector(
    "[data-dropdown_button='dropdown_list_2']"
  );
  let list_items_1 = document.querySelectorAll(
    "[data-dropdown_list_item='dropdown_list_item_1']"
  );
  let list_items_2 = document.querySelectorAll(
    "[data-dropdown_list_item='dropdown_list_item_2']"
  );
  let dropdown_button = item.querySelector(".dropdown_button");
  let dropdown_list = item.querySelector(".dropdown_list");
  let dropd_list_i = dropdown_list.querySelectorAll(".dropdown_list_item");

  list_items_1.forEach(function (item) {
    item.addEventListener("click", function () {
      if (this.innerText === dropdown_button_2.innerText) {
        dropdown_button_2.innerText = dropdown_button_1.innerText;
      }
    });
  });

  list_items_2.forEach(function (item) {
    item.addEventListener("click", function () {
      if (this.innerText === dropdown_button_1.innerText) {
        dropdown_button_1.innerText = dropdown_button_2.innerText;
      }
    });
  });

  dropdown_button_1.addEventListener("click", function () {
    list_items_1.forEach(function (item) {
      if (dropdown_button_1.innerText === item.innerText) {
        item.style.display = "none";
      }
    });
  });

  dropdown_button_2.addEventListener("click", function () {
    list_items_2.forEach(function (item) {
      if (dropdown_button_2.innerText === item.innerText) {
        item.style.display = "none";
      }
    });
  });

  dropdown_button.addEventListener("click", function () {
    dropdown_list.classList.toggle("dropdown_list_active");
    this.classList.toggle("dropdown_button_active");
  });

  dropd_list_i.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown_button.innerText = this.innerText;
      dropdown_button.focus();
      dropdown_button.classList.remove("dropdown_button_active");
      dropdown_list.classList.remove("dropdown_list_active");
    });
  });

  document.addEventListener("click", function (e) {
    if (e.target !== dropdown_button) {
      dropdown_button.classList.remove("dropdown_button_active");
      dropdown_list.classList.remove("dropdown_list_active");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab" || e.key === "Escape") {
      dropdown_button.classList.remove("dropdown_button_active");
      dropdown_list.classList.remove("dropdown_list_active");
    }
  });
});

// get currencies //////////////////////////////////////////////////////////////////
const dropdown_button_1 = document.querySelector(
  "[data-dropdown_button='dropdown_list_1']"
);
const dropdown_button_2 = document.querySelector(
  "[data-dropdown_button='dropdown_list_2']"
);

const currencies = document.querySelectorAll(".currencies");

const KZT_table = document.querySelector("[data-currencies='kzt']");
const RUB_table = document.querySelector("[data-currencies='rub']");
const USD_table = document.querySelector("[data-currencies='usd']");
const EUR_table = document.querySelector("[data-currencies='eur']");
const GBP_table = document.querySelector("[data-currencies='gbp']");

const KZT_value = document.querySelector("[data-value='KZT']");
const RUB_value = document.querySelector("[data-value='RUB']");
const USD_value = document.querySelector("[data-value='USD']");
const EUR_value = document.querySelector("[data-value='EUR']");
const GBP_value = document.querySelector("[data-value='GBP']");

const curr_block_title = document.querySelector(".currencies_block_title");

const rates = {};

async function get_currencies() {
  let url = "https://www.cbr-xml-daily.ru/daily_json.js";
  let response = await fetch(url);
  let data = await response.json();
  renders_rate(data);
  change_color(data);
  from_to(data);
}
get_currencies();

function renders_rate(data) {
  // from SOM to other currencies
  rates.som_to_tenge = (
    ((1 / data.Valute.KZT.Value) * 100) /
    (1 / (data.Valute.KGS.Value / 10))
  ).toFixed(2);
  rates.som_to_rouble = (data.Valute.KGS.Value / 10).toFixed(2);
  rates.som_to_dollar = (
    data.Valute.KGS.Value /
    10 /
    data.Valute.USD.Value
  ).toFixed(2);
  rates.som_to_euro = (
    data.Valute.KGS.Value /
    10 /
    data.Valute.EUR.Value
  ).toFixed(2);
  rates.som_to_pounds = (
    data.Valute.KGS.Value /
    10 /
    data.Valute.GBP.Value
  ).toFixed(2);
  //
  // from TENGE to other currencies
  rates.tenge_to_som = (
    1 /
    (data.Valute.KGS.Value / 10) /
    ((1 / data.Valute.KZT.Value) * 100)
  ).toFixed(2);
  rates.tenge_to_rouble = ((1 * data.Valute.KZT.Value) / 100).toFixed(2);
  rates.tenge_to_dollar = (
    (1 * data.Valute.KZT.Value) /
    100 /
    data.Valute.USD.Value
  ).toFixed(4);
  rates.tenge_to_euro = (
    (1 * data.Valute.KZT.Value) /
    100 /
    data.Valute.EUR.Value
  ).toFixed(4);
  rates.tenge_to_pounds = (
    (1 * data.Valute.KZT.Value) /
    100 /
    data.Valute.GBP.Value
  ).toFixed(4);
  //
  // from ROUBLE to other currencies
  rates.rouble_to_tenge = (1 / ((1 * data.Valute.KZT.Value) / 100)).toFixed(2);
  rates.rouble_to_som = (1 / (data.Valute.KGS.Value / 10)).toFixed(2);
  rates.rouble_to_dollar = (1 / data.Valute.USD.Value).toFixed(2);
  rates.rouble_to_euro = (1 / data.Valute.EUR.Value).toFixed(2);
  rates.rouble_to_pounds = (1 / data.Valute.GBP.Value).toFixed(2);
  //
  // from DOLLAR to other currencies
  rates.dollar_to_tenge = (
    data.Valute.USD.Value *
    (1 / (data.Valute.KZT.Value / 100))
  ).toFixed(2);
  rates.dollar_to_som = (
    data.Valute.USD.Value *
    (1 / (data.Valute.KGS.Value / 10))
  ).toFixed(2);
  rates.dollar_to_rouble = data.Valute.USD.Value.toFixed(2);
  rates.dollar_to_euro = (
    data.Valute.USD.Value / data.Valute.EUR.Value
  ).toFixed(2);
  rates.dollar_to_pounds = (
    data.Valute.USD.Value / data.Valute.GBP.Value
  ).toFixed(2);
  //
  // from EURO to other currencies
  rates.euro_to_tenge = (
    data.Valute.EUR.Value *
    (1 / (data.Valute.KZT.Value / 100))
  ).toFixed(2);
  rates.euro_to_som = (
    data.Valute.EUR.Value *
    (1 / (data.Valute.KGS.Value / 10))
  ).toFixed(2);
  rates.euro_to_rouble = data.Valute.EUR.Value.toFixed(2);
  rates.euro_to_dollar = (
    data.Valute.EUR.Value / data.Valute.USD.Value
  ).toFixed(2);
  rates.euro_to_pounds = (
    data.Valute.EUR.Value / data.Valute.GBP.Value
  ).toFixed(2);
  //
  // from POUNDS to other currencies
  rates.pounds_to_tenge = (
    data.Valute.GBP.Value *
    (1 / (data.Valute.KZT.Value / 100))
  ).toFixed(2);
  rates.pounds_to_som = (
    data.Valute.GBP.Value *
    (1 / (data.Valute.KGS.Value / 10))
  ).toFixed(2);
  rates.pounds_to_rouble = data.Valute.GBP.Value.toFixed(2);
  rates.pounds_to_dollar = (
    data.Valute.GBP.Value / data.Valute.USD.Value
  ).toFixed(2);
  rates.pounds_to_euro = (
    data.Valute.GBP.Value / data.Valute.EUR.Value
  ).toFixed(2);

  if (dropdown_button_1.innerText === "Som KG") {
    KZT_value.innerText = rates.tenge_to_som;
    RUB_value.innerText = rates.rouble_to_som;
    USD_value.innerText = rates.dollar_to_som;
    EUR_value.innerText = rates.euro_to_som;
    GBP_value.innerText = rates.pounds_to_som;
    currencies.forEach(function (item) {
      item.style.display = "flex";
    });
    curr_block_title.innerText = "Som KG";
  }
  if (dropdown_button_1.innerText === "Rouble Russ") {
    KZT_value.innerText = rates.tenge_to_rouble;
    USD_value.innerText = rates.dollar_to_rouble;
    EUR_value.innerText = rates.euro_to_rouble;
    GBP_value.innerText = rates.pounds_to_rouble;
    currencies.forEach(function (item) {
      item.style.display = "flex";
    });
    RUB_table.style.display = "none";
    curr_block_title.innerText = "Rouble Russ.";
  }
  if (dropdown_button_1.innerText === "Tenge Kaz") {
    RUB_value.innerText = rates.rouble_to_tenge;
    USD_value.innerText = rates.dollar_to_tenge;
    EUR_value.innerText = rates.euro_to_tenge;
    GBP_value.innerText = rates.pounds_to_tenge;
    currencies.forEach(function (item) {
      item.style.display = "flex";
    });
    KZT_table.style.display = "none";
    curr_block_title.innerText = "Tenge Kaz.";
  }
  if (dropdown_button_1.innerText === "US Dollar") {
    KZT_value.innerText = rates.tenge_to_dollar;
    RUB_value.innerText = rates.rouble_to_dollar;
    USD_value.innerText = rates.dollar_to_dollar;
    EUR_value.innerText = rates.euro_to_dollar;
    GBP_value.innerText = rates.pounds_to_dollar;
    currencies.forEach(function (item) {
      item.style.display = "flex";
    });
    USD_table.style.display = "none";
    curr_block_title.innerText = "US Dollar";
  }
  if (dropdown_button_1.innerText === "Euro") {
    KZT_value.innerText = rates.tenge_to_euro;
    RUB_value.innerText = rates.rouble_to_euro;
    USD_value.innerText = rates.dollar_to_euro;
    EUR_value.innerText = rates.euro_to_euro;
    GBP_value.innerText = rates.pounds_to_euro;
    currencies.forEach(function (item) {
      item.style.display = "flex";
    });
    EUR_table.style.display = "none";
    curr_block_title.innerText = "Euro";
  }
  if (dropdown_button_1.innerText === "GB Pounds") {
    KZT_value.innerText = rates.tenge_to_pounds;
    RUB_value.innerText = rates.rouble_to_pounds;
    USD_value.innerText = rates.dollar_to_pounds;
    EUR_value.innerText = rates.euro_to_pounds;
    GBP_value.innerText = rates.pounds_to_pounds;
    currencies.forEach(function (item) {
      item.style.display = "flex";
    });
    GBP_table.style.display = "none";
    curr_block_title.innerText = "GB Pounds";
  }
}
// change color /////////////////////////////////////////////////////////////////////
function change_color(data) {
  if (data.Valute.KZT.Value > data.Valute.KZT.Previous) {
    KZT_value.style.color = "var(--success)";
  } else if (data.Valute.KZT.Value < data.Valute.KZT.Previous) {
    KZT_value.style.color = "var(--primary)";
  }

  if (1 / (data.Valute.KGS.Value / 10) > 1 / (data.Valute.KGS.Previous / 10)) {
    RUB_value.style.color = "var(--success)";
  } else if (
    1 / (data.Valute.KGS.Value / 10) <
    1 / (data.Valute.KGS.Previous / 10)
  ) {
    RUB_value.style.color = "var(--primary)";
  }

  if (data.Valute.USD.Value > data.Valute.USD.Previous) {
    USD_value.style.color = "var(--success)";
  } else if (data.Valute.USD.Value < data.Valute.USD.Previous) {
    USD_value.style.color = "var(--primary)";
  }

  if (data.Valute.EUR.Value > data.Valute.EUR.Previous) {
    EUR_value.style.color = "var(--success)";
  } else if (data.Valute.EUR.Value < data.Valute.EUR.Previous) {
    EUR_value.style.color = "var(--primary)";
  }

  if (data.Valute.GBP.Value > data.Valute.GBP.Previous) {
    GBP_value.style.color = "var(--success)";
  } else if (data.Valute.GBP.Value < data.Valute.GBP.Previous) {
    GBP_value.style.color = "var(--primary)";
  }
}
// from to block/////////////////////////////////////////////////////////////////////

const list_items = document.querySelectorAll(".dropdown_list_item");
const number = document.querySelector(".number");
const result = document.querySelector(".result");
const exchange = {};

number.addEventListener("input", function () {
  get_currencies();
});

function from_to(data) {
  //
  // from TENGE to other currencies
  exchange.tenge_to_som = (
    (data.Valute.KZT.Value / 10 / data.Valute.KGS.Value) *
    number.value
  ).toFixed(2);
  exchange.tenge_to_rouble = (
    (data.Valute.KZT.Value / 100) *
    number.value
  ).toFixed(2);
  exchange.tenge_to_dollar = (
    (data.Valute.KZT.Value / 100 / data.Valute.USD.Value) *
    number.value
  ).toFixed(4);
  exchange.tenge_to_euro = (
    number.value *
    (data.Valute.KZT.Value / 100 / data.Valute.EUR.Value)
  ).toFixed(4);
  exchange.tenge_to_pounds = (
    number.value *
    (data.Valute.KZT.Value / 100 / data.Valute.GBP.Value)
  ).toFixed(4);
  //
  // from SOM to other currencies
  exchange.som_to_tenge = (
    (data.Valute.KGS.Value / data.Valute.KZT.Value) *
    10 *
    number.value
  ).toFixed(2);
  exchange.som_to_rouble = (
    (data.Valute.KGS.Value / 10) *
    number.value
  ).toFixed(2);
  exchange.som_to_dollar = (
    (data.Valute.KGS.Value / 10 / data.Valute.USD.Value) *
    number.value
  ).toFixed(2);
  exchange.som_to_euro = (
    number.value *
    (data.Valute.KGS.Value / 10 / data.Valute.EUR.Value)
  ).toFixed(2);
  exchange.som_to_pounds = (
    number.value *
    (data.Valute.KGS.Value / 10 / data.Valute.GBP.Value)
  ).toFixed(2);
  //
  // from ROUBLE to other currencies
  exchange.rouble_to_tenge = (
    (1 / data.Valute.KZT.Value) *
    100 *
    number.value
  ).toFixed(2);
  exchange.rouble_to_som = (
    (1 / (data.Valute.KGS.Value / 10)) *
    number.value
  ).toFixed(2);
  exchange.rouble_to_dollar = (
    (1 / data.Valute.USD.Value) *
    number.value
  ).toFixed(2);
  exchange.rouble_to_euro = (
    (1 / data.Valute.EUR.Value) *
    number.value
  ).toFixed(2);
  exchange.rouble_to_pounds = (
    (1 / data.Valute.GBP.Value) *
    number.value
  ).toFixed(2);
  //
  // from USD to other currencies
  exchange.dollar_to_tenge = (
    data.Valute.USD.Value *
    (1 / (data.Valute.KZT.Value / 100)) *
    number.value
  ).toFixed(2);
  exchange.dollar_to_som = (
    data.Valute.USD.Value *
    (1 / (data.Valute.KGS.Value / 10)) *
    number.value
  ).toFixed(2);
  exchange.dollar_to_rouble = (data.Valute.USD.Value * number.value).toFixed(2);
  exchange.dollar_to_euro = (
    data.Valute.USD.Value *
    (1 / data.Valute.EUR.Value) *
    number.value
  ).toFixed(2);
  exchange.dollar_to_pounds = (
    data.Valute.USD.Value *
    (1 / data.Valute.GBP.Value) *
    number.value
  ).toFixed(2);
  //
  // from EURO to other currencies
  exchange.euro_to_tenge = (
    data.Valute.EUR.Value *
    (1 / (data.Valute.KZT.Value / 100)) *
    number.value
  ).toFixed(2);
  exchange.euro_to_som = (
    data.Valute.EUR.Value *
    (1 / (data.Valute.KGS.Value / 10)) *
    number.value
  ).toFixed(2);
  exchange.euro_to_rouble = (data.Valute.EUR.Value * number.value).toFixed(2);
  exchange.euro_to_dollar = (
    data.Valute.EUR.Value *
    (1 / data.Valute.USD.Value) *
    number.value
  ).toFixed(2);
  exchange.euro_to_pounds = (
    data.Valute.EUR.Value *
    (1 / data.Valute.GBP.Value) *
    number.value
  ).toFixed(2);
  //
  // from POUNDS to other currencies
  exchange.pounds_to_tenge = (
    data.Valute.GBP.Value *
    (1 / (data.Valute.KZT.Value / 100)) *
    number.value
  ).toFixed(2);
  exchange.pounds_to_som = (
    data.Valute.GBP.Value *
    (1 / (data.Valute.KGS.Value / 10)) *
    number.value
  ).toFixed(2);
  exchange.pounds_to_rouble = (data.Valute.GBP.Value * number.value).toFixed(2);
  exchange.pounds_to_dollar = (
    data.Valute.GBP.Value *
    (1 / data.Valute.USD.Value) *
    number.value
  ).toFixed(2);
  exchange.pounds_to_euro = (
    data.Valute.GBP.Value *
    (1 / data.Valute.EUR.Value) *
    number.value
  ).toFixed(2);
  // exchange///////////////////////////////////////////////////////////////
  if (
    dropdown_button_1.innerText === "Som KG" &&
    dropdown_button_2.innerText === "Rouble Russ"
  ) {
    result.innerText = exchange.som_to_rouble;
  } else if (
    dropdown_button_1.innerText === "Som KG" &&
    dropdown_button_2.innerText === "Tenge Kaz"
  ) {
    result.innerText = exchange.som_to_tenge;
  } else if (
    dropdown_button_1.innerText === "Som KG" &&
    dropdown_button_2.innerText === "US Dollar"
  ) {
    result.innerText = exchange.som_to_dollar;
  } else if (
    dropdown_button_1.innerText === "Som KG" &&
    dropdown_button_2.innerText === "Euro"
  ) {
    result.innerText = exchange.som_to_euro;
  } else if (
    dropdown_button_1.innerText === "Som KG" &&
    dropdown_button_2.innerText === "GB Pounds"
  ) {
    result.innerText = exchange.som_to_pounds;
  } else if (
    dropdown_button_1.innerText === "Rouble Russ" &&
    dropdown_button_2.innerText === "Tenge Kaz"
  ) {
    result.innerText = exchange.rouble_to_tenge;
  } else if (
    dropdown_button_1.innerText === "Rouble Russ" &&
    dropdown_button_2.innerText === "Som KG"
  ) {
    result.innerText = exchange.rouble_to_som;
  } else if (
    dropdown_button_1.innerText === "Rouble Russ" &&
    dropdown_button_2.innerText === "US Dollar"
  ) {
    result.innerText = exchange.rouble_to_dollar;
  } else if (
    dropdown_button_1.innerText === "Rouble Russ" &&
    dropdown_button_2.innerText === "Euro"
  ) {
    result.innerText = exchange.rouble_to_euro;
  } else if (
    dropdown_button_1.innerText === "Rouble Russ" &&
    dropdown_button_2.innerText === "GB Pounds"
  ) {
    result.innerText = exchange.rouble_to_pounds;
  } else if (
    dropdown_button_1.innerText === "US Dollar" &&
    dropdown_button_2.innerText === "Tenge Kaz"
  ) {
    result.innerText = exchange.dollar_to_tenge;
  } else if (
    dropdown_button_1.innerText === "US Dollar" &&
    dropdown_button_2.innerText === "Som KG"
  ) {
    result.innerText = exchange.dollar_to_som;
  } else if (
    dropdown_button_1.innerText === "US Dollar" &&
    dropdown_button_2.innerText === "Rouble Russ"
  ) {
    result.innerText = exchange.dollar_to_rouble;
  } else if (
    dropdown_button_1.innerText === "US Dollar" &&
    dropdown_button_2.innerText === "Euro"
  ) {
    result.innerText = exchange.dollar_to_euro;
  } else if (
    dropdown_button_1.innerText === "US Dollar" &&
    dropdown_button_2.innerText === "GB Pounds"
  ) {
    result.innerText = exchange.dollar_to_pounds;
  } else if (
    dropdown_button_1.innerText === "Euro" &&
    dropdown_button_2.innerText === "Tenge Kaz"
  ) {
    result.innerText = exchange.euro_to_tenge;
  } else if (
    dropdown_button_1.innerText === "Euro" &&
    dropdown_button_2.innerText === "Som KG"
  ) {
    result.innerText = exchange.euro_to_som;
  } else if (
    dropdown_button_1.innerText === "Euro" &&
    dropdown_button_2.innerText === "Rouble Russ"
  ) {
    result.innerText = exchange.euro_to_rouble;
  } else if (
    dropdown_button_1.innerText === "Euro" &&
    dropdown_button_2.innerText === "US Dollar"
  ) {
    result.innerText = exchange.euro_to_dollar;
  } else if (
    dropdown_button_1.innerText === "Euro" &&
    dropdown_button_2.innerText === "GB Pounds"
  ) {
    result.innerText = exchange.euro_to_pounds;
  } else if (
    dropdown_button_1.innerText === "GB Pounds" &&
    dropdown_button_2.innerText === "Tenge Kaz"
  ) {
    result.innerText = exchange.pounds_to_tenge;
  } else if (
    dropdown_button_1.innerText === "GB Pounds" &&
    dropdown_button_2.innerText === "Som KG"
  ) {
    result.innerText = exchange.pounds_to_som;
  } else if (
    dropdown_button_1.innerText === "GB Pounds" &&
    dropdown_button_2.innerText === "Rouble Russ"
  ) {
    result.innerText = exchange.pounds_to_rouble;
  } else if (
    dropdown_button_1.innerText === "GB Pounds" &&
    dropdown_button_2.innerText === "US Dollar"
  ) {
    result.innerText = exchange.pounds_to_dollar;
  } else if (
    dropdown_button_1.innerText === "GB Pounds" &&
    dropdown_button_2.innerText === "Euro"
  ) {
    result.innerText = exchange.pounds_to_euro;
  } else if (
    dropdown_button_1.innerText === "Tenge Kaz" &&
    dropdown_button_2.innerText === "Som KG"
  ) {
    result.innerText = exchange.tenge_to_som;
  } else if (
    dropdown_button_1.innerText === "Tenge Kaz" &&
    dropdown_button_2.innerText === "Rouble Russ"
  ) {
    result.innerText = exchange.tenge_to_rouble;
  } else if (
    dropdown_button_1.innerText === "Tenge Kaz" &&
    dropdown_button_2.innerText === "US Dollar"
  ) {
    result.innerText = exchange.tenge_to_dollar;
  } else if (
    dropdown_button_1.innerText === "Tenge Kaz" &&
    dropdown_button_2.innerText === "Euro"
  ) {
    result.innerText = exchange.tenge_to_euro;
  } else if (
    dropdown_button_1.innerText === "Tenge Kaz" &&
    dropdown_button_2.innerText === "GB Pounds"
  ) {
    result.innerText = exchange.tenge_to_pounds;
  }
}

list_items.forEach(function (item) {
  item.addEventListener("click", function () {
    get_currencies();
  });
});

// do not enter more than one zero /////////////////////////////////////////////////////////////////////////////////////
function do_not_enter_zeros() {
  if (number.value === "00") {
    number.value = "";
  }
}
number.addEventListener("input", do_not_enter_zeros);
number.addEventListener("change", do_not_enter_zeros);

// hide rates ///////////////////////////////////////////////////////////////////////////////////////////////
const dropdown_buttons = document.querySelectorAll(".dropdown_button");
const list_items_1 = document.querySelectorAll(
  "[data-dropdown_list_item='dropdown_list_item_1']"
);
const list_items_2 = document.querySelectorAll(
  "[data-dropdown_list_item='dropdown_list_item_2']"
);

list_items_1.forEach(function (item) {
  item.addEventListener("click", function () {
    list_items.forEach(function (item) {
      item.style.display = "block";
    });
    this.style.display = "none";
  });
});

list_items_2.forEach(function (item) {
  item.addEventListener("click", function () {
    list_items.forEach(function (item) {
      item.style.display = "block";
    });
    this.style.display = "none";
  });
});

// ////////////////////////////////////////////////////////////////////////////////////////////////////////

// const swap_button = document.querySelector(".swap_button");
// const swap_button_use = swap_button.querySelector(".swap_icon");

// swap_button.addEventListener("click", function () {
//   swap_button_use.classList.toggle("swap_button_active");
//   if (swap_button_use.classList.contains("swap_button_active")) {
//   }
// });
const clear_button = document.querySelector(".clear");

clear_button.addEventListener("click", function () {
  number.value = "";
  result.innerText = "0.00";
});
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelectorAll("button").forEach(function (item) {
  item.addEventListener("touchstart", function () {
    this.style.opacity = "0.7";
  });
  item.addEventListener("touchend", function () {
    this.style.opacity = "1";
  });
});
