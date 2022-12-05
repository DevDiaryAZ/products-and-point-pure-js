// --- popup script ---

let openPopupButtons = document.querySelectorAll('.open-popup-js'); // Кнопки для показа окна
let closePopupButton = document.querySelectorAll('.close-popup-js'); // Кнопка для скрытия окна
let popups = document.querySelectorAll('.popup'); // Кнопка для скрытия окна

// open popup function
function openPopup(e) {
  e.preventDefault();
  popups.forEach((popup) => {
    if (popup.id === e.target.getAttribute('data-id')) {
      popup.classList.add('active');
    }
  });

}

// close popup function
function closePopup() {
  popups.forEach((popup) => {
    popup.classList.remove('active');
  });
}

closePopupButton.forEach((closeButton) => {
  closeButton.addEventListener('click', closePopup);
});

openPopupButtons.forEach((openButton) => {
  openButton.addEventListener('click', (e) => openPopup(e));
});

// close popup by clicking outside the element
document.addEventListener('click', (e) => {
  let target = e.target;
  if (target.classList.contains('popup-center')) {
    target.closest('.popup').classList.remove('active');
  }
});

// change delivery address
let addressRadioButtons = document.getElementsByName('del-address');
let deliveryAddressElements = document.querySelectorAll(
  '.change-del-address-js'
);
let changeAddressBtn = document.querySelector('.change-del-address-btn-js');

function changeDeliveryAddress() {
  addressRadioButtons.forEach((addressRadioButton) => {
    if (addressRadioButton.checked) {
      deliveryAddressElements.forEach((el) => {
        el.innerHTML = addressRadioButton.value;
      });
    }
  });
  closePopup();
}

changeAddressBtn.addEventListener('click', changeDeliveryAddress);

// remove delivery address
let removeRadioBtns = document.querySelectorAll('.remove-radio-btn-js');

removeRadioBtns.forEach((removeRadioBtn) => {
  removeRadioBtn.addEventListener('click', (e) => {
    e.target.closest('.radio-item').style.display = 'none';
  });
});

// change payment
let cardRadioButtons = document.getElementsByName('card');
let cardElements = document.querySelectorAll('.change-card-js');
let changeCardBtn = document.querySelector('.change-card-btn-js');

function changeCard() {
  cardRadioButtons.forEach((cardRadioButton) => {
    if (cardRadioButton.checked) {
      cardElements.forEach((el) => {
        el.innerHTML = cardRadioButton.value;
        let iconCardElement = el.closest('.icon-change-card-js');
        let cardArr = ['mir', 'maestro', 'master', 'visa'];
        cardArr.map((card) => {
          iconCardElement.classList.remove(`icon-${card}`);
        });
        let newStyle = 'icon-' + cardRadioButton.getAttribute('data-cardtype');
        iconCardElement.classList.add(newStyle);
      });
    }
  });
  closePopup();
}

changeCardBtn.addEventListener('click', changeCard);

// change delivery type
let changeDeliveryTypeBtns = document.querySelectorAll(
  '.change-delivery-type-btn-js'
);
let deliveryTypeContainers = document.querySelectorAll(
  '.container-delivery-type-js'
);

changeDeliveryTypeBtns.forEach((changeDeliveryTypeBtn) => {
  changeDeliveryTypeBtn.addEventListener('click', (e) => {
    changeDeliveryTypeBtns.forEach((btn) => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    deliveryTypeContainers.forEach((deliveryTypeContainer) => {
      deliveryTypeContainer.classList.remove('active');
      if (
        deliveryTypeContainer.getAttribute('data-deliverytype') ===
        e.target.getAttribute('data-deliverytype')
      ) {
        deliveryTypeContainer.classList.add('active');
      }
    });
  });
});

// --- main script ---

let productPrices = document.querySelectorAll('.price-js');
let productOldPrices = document.querySelectorAll('.old-price-js');
let totalPrice = document.querySelector('.total-price-js');
let totalOldPrice = document.querySelector('.total-old-price-js');
let totalDiscount = document.querySelector('.total-discount-js');
let sum = 0; // total price number
let oldSum = 0; // total old price number

// format number function
function numberWithSpaces(x) {
  return x
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    .replace(/0*$/, '')
    .replace(/.$/, '')
    .replace('.', ',');
}

// sum function
function sumPrices() {
  sum = 0;
  productPrices.forEach((productPrice) => {
    if (
      productPrice
        .closest('.price-container-js')
        .querySelector('.product-checkbox-js').checked
    ) {
      let curProductPrice = parseFloat(productPrice.getAttribute('data-price'));
      sum += curProductPrice;
    }
    totalPrice.innerHTML = numberWithSpaces(sum.toFixed(2));
    totalPrice.setAttribute('data-price', sum.toFixed(2));
  });
}

// old price sum function
function sumOldPrices() {
  oldSum = 0;
  productOldPrices.forEach((productOldPrice) => {
    if (
      productOldPrice
        .closest('.price-container-js')
        .querySelector('.product-checkbox-js').checked
    ) {
      let curProductOldPrice = parseFloat(
        productOldPrice.getAttribute('data-old-price')
      );
      oldSum += curProductOldPrice;
    }
    totalOldPrice.innerHTML = numberWithSpaces(oldSum.toFixed(2));
    totalOldPrice.setAttribute('data-old-price', oldSum.toFixed(2));
  });
}

// get discount function
function getDiscount() {
  let total = parseFloat(totalPrice.getAttribute('data-price'));
  let oldTotal = parseFloat(totalOldPrice.getAttribute('data-old-price'));
  let totalDiscountValue = oldTotal - total;
  totalDiscount.innerHTML = `-${numberWithSpaces(
    totalDiscountValue.toFixed(2)
  )}`;
}

sumPrices();
sumOldPrices();
getDiscount();

// count minus function
let countMinusBtns = document.querySelectorAll('.count-minus-js');
let countPlusBtns = document.querySelectorAll('.count-plus-js');

countMinusBtns.forEach((countMinusBtn) => {
  countMinusBtn.addEventListener('click', (e) => {
    let currentCount = Number(
      e.target.parentNode.querySelector('.count-input-js').value
    );
    if (currentCount !== 0) {
      --currentCount;
      e.target.parentNode.querySelector('.count-input-js').value = currentCount;
      changeProductSum(e, 'minus');
      changeOldProductSum(e, 'minus');
      getDiscount();
    }
  });
});

countPlusBtns.forEach((countPlusBtn) => {
  countPlusBtn.addEventListener('click', (e) => {
    let currentCount = Number(
      e.target.parentNode.querySelector('.count-input-js').value
    );

    e.target.parentNode.querySelector('.count-input-js').value =
      currentCount + 1;
    changeProductSum(e, 'plus');
    changeOldProductSum(e, 'plus');
    getDiscount();
  });
});

// change product price
function changeProductSum(e, action) {
  let currentPriceElement = e.target
    .closest('.price-container-js')
    .querySelector('.price-js');
  let currentPrice = parseFloat(currentPriceElement.getAttribute('data-price'));
  let priceForOne = parseFloat(
    currentPriceElement.getAttribute('data-price-one')
  );
  if (action === 'minus') {
    currentPrice -= priceForOne;
  }
  if (action === 'plus') {
    currentPrice += priceForOne;
  }
  currentPriceElement.setAttribute('data-price', currentPrice.toFixed(2));
  e.target.closest('.price-container-js').querySelector('.price-js').innerHTML =
    numberWithSpaces(currentPrice.toFixed(2));
  e.target
    .closest('.price-container-js')
    .querySelector('.price-desktop-js').innerHTML = numberWithSpaces(
    currentPrice.toFixed(2)
  );
  sumPrices();
}

// change old product price
function changeOldProductSum(e, action) {
  let currentPriceElement = e.target
    .closest('.price-container-js')
    .querySelector('.old-price-js');
  let currentPrice = parseFloat(
    currentPriceElement.getAttribute('data-old-price')
  );
  let priceForOne = parseFloat(
    currentPriceElement.getAttribute('data-old-price-one')
  );
  if (action === 'minus') {
    currentPrice -= priceForOne;
  }
  if (action === 'plus') {
    currentPrice += priceForOne;
  }
  currentPriceElement.setAttribute('data-old-price', currentPrice.toFixed(2));
  e.target
    .closest('.price-container-js')
    .querySelector('.old-price-js').innerHTML = numberWithSpaces(
    currentPrice.toFixed(2)
  );
  e.target
    .closest('.price-container-js')
    .querySelector('.old-price-desktop-js').innerHTML = numberWithSpaces(
    currentPrice.toFixed(2)
  );
  sumOldPrices();
}

// pay now function
let payNowCheckbox = document.querySelector('.pay-now-js');
let submitBtn = document.querySelector('.submit-btn-js');

payNowCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    submitBtn.innerHTML = `Оплатить ${totalPrice.innerHTML} com`;
  } else {
    submitBtn.innerHTML = `Заказать`;
  }
});

// select all function
let selectAllBtn = document.querySelector('.select-all-btn-js');
let productsCheckbox = document.querySelectorAll('.product-checkbox-js');

selectAllBtn.addEventListener('change', () => {
  if (selectAllBtn.checked) {
    productsCheckbox.forEach((poductCheckbox) => {
      poductCheckbox.checked = true;
    });
  } else {
    productsCheckbox.forEach((poductCheckbox) => {
      poductCheckbox.checked = false;
    });
  }
  sumPrices();
  sumOldPrices();
  getDiscount();
});

productsCheckbox.forEach((productCheckbox) => {
  productCheckbox.addEventListener('change', (e) => {
    let flag = true;
    productsCheckbox.forEach((checkbox) => {
      if (checkbox.checked === false) {
        flag = false;
      }
    });
    if (flag) {
      selectAllBtn.checked = true;
    } else {
      selectAllBtn.checked = false;
    }
    sumPrices();
    sumOldPrices();
    getDiscount();
  });
});

// delete product
let deleteProductBtns = document.querySelectorAll('.delete-product-js');

deleteProductBtns.forEach((deleteProductBtn) => {
  deleteProductBtn.addEventListener('click', (e) => {
    e.target.closest('.price-container-js').style.display = 'none';
    e.target
      .closest('.price-container-js')
      .querySelector('.product-checkbox-js').checked = false;
    sumPrices();
    sumOldPrices();
    getDiscount();
  });
});

// delete missing product
let deleteMissingProductBtns = document.querySelectorAll(
  '.delete-missing-product-js'
);

deleteMissingProductBtns.forEach((deleteMissingProductBtn) => {
  deleteMissingProductBtn.addEventListener('click', (e) => {
    e.target.closest('.missing-product-container-js').style.display = 'none';
  });
});

// drop-down function
let dropDownBtns = document.querySelectorAll('.collapse-container-btn-js');

dropDownBtns.forEach((dropDownBtn) => {
  dropDownBtn.addEventListener('click', (e) => {
    if (
      e.target
        .closest('.drop-down-js')
        .classList.contains('active-collapse-drop-down-js')
    ) {
      e.target
        .closest('.drop-down-js')
        .classList.remove('active-collapse-drop-down-js');
    } else {
      e.target
        .closest('.drop-down-js')
        .classList.add('active-collapse-drop-down-js');
    }
  });
});

// form validation
let form = document.getElementById('form');
let formFields = document.querySelectorAll('.form-field-js');
let fieldValidation = false;

// поведение полей формы
formFields.forEach((field) => {
  field.addEventListener('input', (e) => {
    deleteError(e.target.parentNode);
    if (e.target.value !== '') {
      field.parentNode.classList.add('not-empty');
    } else {
      field.parentNode.classList.remove('not-empty');
    }
    let checkName = e.target.getAttribute('name');
    switch (checkName) {
      case 'inn':
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        break;
      case 'name':
      case 'sername':
        e.target.value = e.target.value.replace(/[^a-zа-яё]+$/i, '');
        break;
    }
  });
  field.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
  }
  });
  field.addEventListener('focus', () => {
    field.parentNode.classList.add('focus');
  });
  field.addEventListener('blur', (e) => {
    field.parentNode.classList.remove('focus');
    let target = e.target;
    let checkName = e.target.getAttribute('name');
    switch (checkName) {
      case 'email':
        let regEmail =
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (target.value != '' && !regEmail.test(target.value)) {
          target.parentNode.classList.add('show-error-valid');
          fieldValidation = false;
        } else {
          target.parentNode.classList.remove('show-error-valid');
          fieldValidation = true;
        }
        break;
      case 'phone':
        if (
          (target.value.replace(/\D/g, '').length === 1 &&
            target.value.replace(/\D/g, '') == '7') ||
          !(
            target.value != '' &&
            target.value.replace(/\D/g, '').length < 12 &&
            target.value.replace(/\D/g, '').length > 1
          )
        ) {
          target.parentNode.classList.add('show-error-valid');
          fieldValidation = false;
        } else {
          target.parentNode.classList.remove('show-error-valid');
          fieldValidation = true;
        }
        break;
      case 'inn':
        if (target.value != '' && target.value.length > 10) {
          target.parentNode.classList.add('show-error-valid');
          fieldValidation = false;
        } else {
          target.parentNode.classList.remove('show-error-valid');
          fieldValidation = true;
        }
        break;
    }
  });
});

function deleteError(element) {
  element.classList.remove('show-error');
}

let voidValidation = false;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  for (i = 0; i < formFields.length; i++) {
    if (formFields[i].value === '') {
      formFields[i].parentNode.classList.add('show-error');
      formFields[i].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      voidValidation = false;
      break;
    } else {
      voidValidation = true;
    }
  }

  if (voidValidation && fieldValidation) {
    e.target.submit();
    alert('form send!');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  var eventCalllback = function (e) {
    var el = e.target,
      clearVal = el.dataset.phoneClear,
      pattern = el.dataset.phonePattern,
      matrix_def = '+7(___) ___-__-__',
      matrix = pattern ? pattern : matrix_def,
      i = 0,
      def = matrix.replace(/\D/g, ''),
      val = e.target.value.replace(/\D/g, '');
    if (clearVal !== 'false' && e.type === 'blur') {
      if (val.length < matrix.match(/([\_\d])/g).length) {
        e.target.value = '';
        return;
      }
    }
    if (def.length >= val.length) val = def;
    e.target.value = matrix.replace(/./g, function (a) {
      return /[_\d]/.test(a) && i < val.length
        ? val.charAt(i++)
        : i >= val.length
        ? ''
        : a;
    });
  };
  var phone_inputs = document.querySelectorAll('[data-phone-pattern]');
  for (let elem of phone_inputs) {
    for (let ev of ['input', 'blur', 'focus']) {
      elem.addEventListener(ev, eventCalllback);
    }
  }
});
