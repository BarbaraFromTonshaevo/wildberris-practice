const getGoods = () => {
    const links = document.querySelectorAll('.navigation-link')

    const getData = () => {
        fetch('https://wildberris-159d3-default-rtdb.firebaseio.com/db.json')
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem('goods', JSON.stringify(data))
        })
    }


    links.forEach((link) => {
        link.addEventListener('click',(event) => {
            getData()
        })
    })
}

getGoods()