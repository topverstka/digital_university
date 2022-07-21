
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

function getScrollWidth() {
    let div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '40px';
    div.style.height = '40px';

    document.body.append(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;

    div.remove();

    return scrollWidth;
}

function bodyLock(con) {
    if (con === true) {
        body.classList.add('_lock');
        body.style.paddingRight = `${getScrollWidth()}px`
    } else if (con === false) {
        body.classList.remove('_lock');
        body.style.paddingRight = null
    } else if (con === undefined) {
		if (!body.classList.contains('_lock')) {
			body.classList.add('_lock');
            body.style.paddingRight = `${getScrollWidth()}px`
		}
		else {
			body.classList.remove('_lock')
            body.style.paddingRight = null
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
    const header = find('.header');
	const burger = find('.header__burger');
	const menu = find('.header__bottom');

    document.addEventListener('scroll', (evt) => {
        if (window.scrollY > 0) {
            header.classList.add('header_sticky');
        } else {
            header.classList.remove('header_sticky');
        }
    });

	burger.addEventListener('click', (e) => {
		burger.classList.toggle('btn-burger_active');
		menu.classList.toggle('header__bottom_active');
		bodyLock();
	})
}

initAccordionVertical();
function initAccordionVertical() {
    const accordionNodes = document.querySelectorAll('.accordion-vertical');

    accordionNodes.forEach(accordionNode => {
        const buttonNodes = accordionNode.querySelectorAll('.accordion-vertical__control');
        const contentNodes = accordionNode.querySelectorAll('.accordion-vertical__content');
        const activeNode = accordionNode.querySelector('.accordion-vertical__control_active');
        const toggleNode = accordionNode.querySelector('.accordion-vertical__toggle span');

        if (activeNode) {
            buttonNodes.forEach((buttonNode, i) => {
                if (buttonNode === activeNode) setActive(i);
            });
        } else if (buttonNodes.length) {
            setActive(0);
        }

        buttonNodes.forEach((buttonNode, i) => {
            buttonNode.addEventListener('click', () => {
                if(buttonNode.classList.contains('accordion-vertical__control_active')) return;

                setActive(i);
            });
        });

        function setActive(i) {
            buttonNodes.forEach(buttonNode => buttonNode.classList.remove('accordion-vertical__control_active'));
            buttonNodes[i].classList.add('accordion-vertical__control_active');
            contentNodes.forEach(contentNode => contentNode.classList.remove('accordion-vertical__content_visible'));
            contentNodes[i].classList.add('accordion-vertical__content_visible');
            if (toggleNode) toggleNode.textContent = buttonNodes[i].textContent;
        }
    });
}

new Swiper('.articles-slider', {
  slidesPerView: 1,
  spaceBetween: 20,

  breakpoints: {
    768: {
        slidesPerView: 1.33,
        spaceBetween: 20,
    },
    992: {
        slidesPerView: 2.3,
        spaceBetween: 24,
    },
  },

  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

const tabletMq = window.matchMedia('(max-width: 991px)');
let otherCasesSlider = null;

initOtherCasesSlider();

tabletMq.addEventListener('change', () => {
    initOtherCasesSlider();
});

function initOtherCasesSlider() {
    if (tabletMq.matches) {
        otherCasesSlider = new Swiper('.other-cases__slider', {
            slidesPerView: 1,
            spaceBetween: 20,
            init: true,

            breakpoints: {
                768: {
                    slidesPerView: 2,
                }
            },

            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });
    } else {
        if (otherCasesSlider && otherCasesSlider.initialized) otherCasesSlider.destroy();
    }
}

initTextSlider();
function initTextSlider() {
    const swiperThumbs = new Swiper(".text-slider__thumbs", {
        spaceBetween: 8,
        slidesPerView: 3,

        breakpoints: {
            768: {
                spaceBetween: 16,
                slidesPerView: 5,
            },
            992: {
                spaceBetween: 16,
                slidesPerView: 8,
            },
        }
    });
    new Swiper(".text-slider__slider", {
        spaceBetween: 25,

        breakpoints: {
            992: {
                spaceBetween: 16,
            },
        },

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
          swiper: swiperThumbs,
        },
    });
}

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
        setTimeout(() => { modal.classList.add('modal_shown') }, 300)
    }

    // Закрытие модального окна
    function closeModal(modal) {
        modal.classList.remove('modal_show')
        bodyLock(false)
        resetHash()
        modal.classList.remove('modal_shown')
    }
}
