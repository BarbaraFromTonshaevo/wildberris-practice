const cart = function () {
    const cartBtn = document.querySelector('.button-cart')
    const cart = document.getElementById('modal-cart')
    const closeBtn = cart.querySelector('.modal-close')
    const goodsContainer = document.querySelector('.long-goods-list')
    const cartTable = document.querySelector('.cart-table__goods')
    const cartTableTotal = document.querySelector('.cart-table__total')
    const modalForm = document.querySelector('.modal-form')
    const modalInputName = document.querySelector('.modal-input[name="nameCustomer"]')
    const modalInputPhone = document.querySelector('.modal-input[name="phoneCustomer"]')


    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.filter(good => {
            return good.id !== id
        })
        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if(good.id === id){
                good.count++
            }
            return good
        })
        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if(good.id === id){
                if(good.count > 0){
                    good.count--
                }
            }
            return good
        })
        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'))
        const clickedGood = goods.find(good => good.id === id)
        const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        console.log(clickedGood)
        console.log(cart.some(good => good.id === clickedGood.id))

        if(cart.some(good => good.id === clickedGood.id)){
            cart.map(good => {
                if(good.id === clickedGood.id){
                    good.count++
                }
                return good
            })
        } else {
            clickedGood.count = 1
            cart.push(clickedGood)
        }
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    const renderCartGoods = (goods) => {
        cartTable.innerHTML = ''
        goods.forEach(good => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}$</td>
                <td><button class="cart-btn-minus">-</button></td>
                <td>${good.count}</td>
                <td><button class="cart-btn-plus">+</button></td>
                <td>${+good.price * +good.count}$</td>
                <td><button class="cart-btn-delete">x</button></td>
            `
            cartTable.append(tr)

            tr.addEventListener('click', (event) => {
                if(event.target.classList.contains('cart-btn-minus')){
                    minusCartItem(good.id)
                } else if(event.target.classList.contains('cart-btn-plus')){
                    plusCartItem(good.id)
                } else if(event.target.classList.contains('cart-btn-delete')) {
                    deleteCartItem(good.id)
                }
            })
        })
        cartTableTotal.textContent = goods.reduce((accumulator, good) => accumulator + good.price * good.count, 0)
    }
    
    const sendForm = () => {
        const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({cart: cartArray, name: modalInputName.value, phone: modalInputPhone.value})
        }).then(() => {
            cart.style.display = ''
            localStorage.removeItem('cart')
            modalInputName.value = ''
            modalInputPhone.value = ''
        })
    }

    modalForm.addEventListener('submit', (event) => {
        event.preventDefault()
        sendForm()
    })

    cartBtn.addEventListener('click', function(){
        const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        renderCartGoods(cartArray)
        cart.style.display = 'flex'
        // рендер корзины таблица
    })
    
    closeBtn.addEventListener('click', function() {
        cart.style.display = ''
    })

    cart.addEventListener('click', (event) => {
        if(!event.target.closest('.modal') && event.target.classList.contains('overlay')){
            cart.style.display = ''
        }
    })

    if(goodsContainer){
        goodsContainer.addEventListener('click', (event) => {
            if(event.target.closest('.add-to-cart')) {
                const buttonToCart = event.target.closest('.add-to-cart')
                const goodId = buttonToCart.dataset.id 
                addToCart(goodId)
            }
        })
    }
}
cart()