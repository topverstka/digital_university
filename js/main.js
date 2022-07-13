
// Служебные переменные
const d = document;
const body = document.querySelector('body');

// Служебные функции

function find(selector) {
	return document.querySelector(selector)
}

function findAll(selectors) {
	return document.querySelectorAll(selectors)
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items,itemClass) {
    if (typeof items == 'string') {
      items = document.querySelectorAll(items)
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      item.classList.remove(itemClass)
    }
}

function bodyLock(con) {
    if (con === true) {
        body.classList.add('_lock');
    } else if (con === false) {
        body.classList.remove('_lock');
    } else if (con === undefined) {
		if (!body.classList.contains('_lock')) {
			body.classList.add('_lock');
		}
		else {
			body.classList.remove('_lock')
		}
	} else {
		console.error('Неопределенный аргумент у функции bodyLock()')
	}
}

// Инициализация кастомного input type=file
initCustomFile();
function initCustomFile() {
    const wrapperNodes = document.querySelectorAll('.form-file');

    wrapperNodes.forEach((wrapperNode) => {
        const inputNode = wrapperNode.querySelector('.form-file__area');
        const fileNode = wrapperNode.querySelector('.form-file__file');
        const nameNode = fileNode.querySelector('.form-file__name');
        const removeNode = fileNode.querySelector('.form-file__remove');

        inputNode.addEventListener('change', handleChange);
        removeNode.addEventListener('click', handleRemove);

        function handleRemove() {
            const inputNode = wrapperNode.querySelector('.form-file__area');

            inputNode.type = '';
            inputNode.type = 'file';
            inputNode.value = '';
            fileNode.classList.remove('form-file__file_visible');
        }

        function handleChange() {
            const inputNode = wrapperNode.querySelector('.form-file__area');

            nameNode.textContent = inputNode.files[0].name;
            if (!fileNode.classList.contains('form-file__file_visible'))
                fileNode.classList.add('form-file__file_visible');
        }
    });
}

// Валидация формы
validationForm('.form');
function validationForm(selector) {
    const formNodes = document.querySelectorAll(selector);

    formNodes.forEach((formNode) => {
        const submitNode = formNode.querySelector('.form__submit');
        const inputNodes = formNode.querySelectorAll('.form__input');

        formNode.setAttribute('novalidate', '');
        setEvents(inputNodes, submitNode);

        formNode.addEventListener('submit', (evt) => {
            if (hasInvalidInput(inputNodes)) {
                evt.preventDefault();

                inputNodes.forEach((inputNode) => {
                    checkInput(inputNode);
                    toggleSubmitState(inputNodes, submitNode);
                });
            }
        });
    });

    function setEvents(inputNodes, submitNode) {
        inputNodes.forEach((inputNode) => {
            inputNode.addEventListener('input', () => {
                checkInput(inputNode);
                toggleSubmitState(inputNodes, submitNode);
            });
        });

        // toggleSubmitState(inputNodes, submitNode);
    }

    function toggleSubmitState(inputNodes, submitNode) {
        if (!submitNode) return;

        if (hasInvalidInput(inputNodes)) {
            submitNode.disabled = true;
        } else {
            submitNode.disabled = false;
        }
    }

    function hasInvalidInput(inputNodes) {
        return Array.from(inputNodes).some((inputNode) => !inputNode.validity.valid);
    }

    function checkInput(inputNode) {
        const parentNode = inputNode.closest('.form__elem');
        const errorNode = parentNode.querySelector('.form__error');
        if (inputNode.validity.valid) {
            parentNode.classList.remove('form__elem_invalid');
        } else {
            errorNode.textContent = inputNode.validationMessage;
            parentNode.classList.add('form__elem_invalid');
        }
    }
}

// Мобильное меню
menu();
function menu() {
	const burger = find('.header__burger');
	const menu = find('.header__bottom');

	// Высота меню
    // let mql = window.matchMedia('(max-width: 991px)');

	// mql.addEventListener('change', (evt) => {
	// 	const headerHeight = find('.header').clientHeight;

	// 	if (evt.matches) {
	// 		menu.style.paddingTop = headerHeight + 'px';
	// 	}
	// 	else {
	// 		menu.style.paddingTop = null;
	// 	}
	// })

	burger.addEventListener('click', (e) => {
		burger.classList.toggle('btn-burger_active');
		menu.classList.toggle('header__bottom_active');
		bodyLock();
	})
}

const swiper = new Swiper('.swiper-container', {

  slidesPerView: 1, // Кол-во показываемых слайдов
  spaceBetween: 0, // Расстояние между слайдами
  loop: true, // Бесконечный слайдер
  freeMode: true, // Слайдеры не зафиксированны
  centeredSlides: false, // Размещать слайдеры по центру

  autoplay: { // автопрокрутка
      delay: 5000, // задержка
  },

  breakpoints: {
    1200: {

    },
    700: {

    },
    400: {

    }
  },

  pagination: {
    el: '.swiper-pagination',
  },

  navigation: {
    nextEl: '.swiper__arrow-next',
    prevEl: '.swiper__arrow-prev',
  },

  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

// Функции для модальных окон
modal()
function modal() {

    // Открытие модальных окон при клике по кнопке
    openModalWhenClickingOnBtn()
    function openModalWhenClickingOnBtn() {
        const btnsOpenModal = document.querySelectorAll('[data-modal-open]');

        for (let i = 0; i < btnsOpenModal.length; i++) {
            const btn = btnsOpenModal[i];

            btn.addEventListener('click', (e) => {
                const dataBtn = btn.dataset.modalOpen;
                const modal = document.querySelector(`#${dataBtn}`)

                openModal(modal)
                window.location.hash = dataBtn
            });
        }
    }

    // Открытие модального окна, если в url указан его id
    openModalHash()
    function openModalHash() {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1)
            const modal = document.querySelector(`.modal#${hash}`)

            if (modal) openModal(modal)
        }
    }

    // Показываем/убираем модальное окно при изменения хеша в адресной строке
    checkHash()
    function checkHash() {
        window.addEventListener('hashchange', e => {
            const hash = window.location.hash
            const modal = document.querySelector(`.modal${hash}`)

            if (find('.modal.modal_show')) find('.modal.modal_show').classList.remove('modal_show')
            if (modal && hash != '') openModal(modal)
        })
    }

    // Закрытие модального окна при клике по заднему фону
    closeModalWhenClickingOnBg()
    function closeModalWhenClickingOnBg() {
        document.addEventListener('click', (e) => {
            const target = e.target
            const modal = document.querySelector('.modal.modal_show')

            if (modal && target.classList.contains('modal__body')) closeModal(modal)
        })
    }

    // Закрытие модальных окон при клике по крестику
    closeModalWhenClickingOnCross()
    function closeModalWhenClickingOnCross() {
        const modalElems = document.querySelectorAll('.modal')
        for (let i = 0; i < modalElems.length; i++) {
            const modal = modalElems[i];
            const closeThisModal = modal.querySelector('.modal__close')

            closeThisModal.addEventListener('click', () => {
                closeModal(modal)
            })
        }
    }

    // Закрытие модальных окон при нажатии по клавише ESC
    closeModalWhenClickingOnESC()
    function closeModalWhenClickingOnESC() {
        const modalElems = document.querySelectorAll('.modal')
        for (let i = 0; i < modalElems.length; i++) {
            const modal = modalElems[i];

            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') closeModal(modal)
            })
        }
    }

    // Сброс id модального окна в url
    function resetHash() {
        const windowTop = window.pageYOffset
        window.location.hash = ''
        window.scrollTo(0, windowTop)
    }

    // Открытие модального окна
    function openModal(modal) {
        modal.classList.add('modal_show')
        bodyLock(true)
    }

    // Закрытие модального окна
    function closeModal(modal) {
        modal.classList.remove('modal_show')
        bodyLock(false)
        resetHash()
    }
}
