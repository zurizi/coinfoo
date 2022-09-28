
const main = () => {
  
  const url = 'https://api.coingecko.com/api/v3'

  let vs_currency = 'idr'
  let order = 'market_cap_desc'
  let per_page = 50
  let page = 1
  let price_change_percentage = '1h,24h,7d'

  const formatPrice = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: vs_currency
    }).format(number);
  }

  const formatNumber = (number) => {
    return parseInt(number)
    .toLocaleString(["ban", "id"])
    .replace(/,/g, ".")
  }

  const getCoin = () => {
    fetch(`${url}/coins/markets?vs_currency=${vs_currency}&order=${order}&per_page=${per_page}&page=${page}&price_change_percentage=${price_change_percentage}`)
      .then(res => {
        return res.json();
      })
      .then(response => {
        renderCoin(response)
      })
      .catch(error => {
        console.log(error)
      })
  }
  
  const searchCoin = (query) => {
    fetch(`${url}/search?query=${query}`)
    .then(res => {
      return res.json()
    })
    .then(response => {
      renderSearchCoin(response.coins)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const detailCoin = (coin) => {
    fetch(`${url}/coins/${coin}`)
    .then(res => {
      return res.json()
    })
    .then(response => {
      renderDetailCoin(response)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const renderCoin = (coins) => {
    const container = document.querySelector('.container-fluid')
    container.innerHTML = ''

    const rowHead = document.createElement('div')
    rowHead.classList.add('row', 'p-4')
    const h2 = document.createElement('h2')
    h2.innerText = 'Harga Mata Uang Kripto berdasarkan Kapitalisasi Pasar'

    const rowTable = document.createElement('div')
    rowTable.classList.add('row', 'px-4')
    const table = document.createElement('table')
    table.classList.add('table')
    const thead = document.createElement('thead')
    thead.innerHTML = `<tr>
                        <th scope="col">#</th>
                        <th scope="col">Koin</th>
                        <th scope="col">Harga</th>
                        <th scope="col">1 jam</th>
                        <th scope="col">24 jam</th>
                        <th scope="col">7 hari</th>
                        <th scope="col">Volume 24 jam</th>
                        <th scope="col">Kap Pasar</th>
                      </tr>`
    const tbody = document.createElement('tbody')
    tbody.innerHTML = '';

    rowHead.appendChild(h2)
    container.appendChild(rowHead)
    
    rowTable.appendChild(table)
    table.appendChild(thead)
    table.appendChild(tbody)
    container.appendChild(rowTable)
    
    coins.forEach(coin => {
      tbody.innerHTML += `
      <tr>
        <td>${coin['market_cap_rank']}</td>
        <td>
          <button type="button" class="btn btn-link m-0 p-0 text-dark detail-coin" style="text-decoration: none;" data-toggle="modal" data-id='${coin['id']}' data-target="#detailModal">
            <h6><img width="20" class="mr-2" src="${coin['image']}">${coin['name']} <span class="badge text-uppercase ml-1 badge-secondary">${coin['symbol']}</span></h6>
          </button>  
        </td>
        <td>${formatPrice(coin['current_price'])}</td>
        <td class="${coin['price_change_percentage_1h_in_currency'] > 0 ? 'text-success' : 'text-danger'}">
          ${parseFloat(coin['price_change_percentage_1h_in_currency']).toFixed(1)}%  
        </td>
        <td class="${coin['price_change_percentage_24h_in_currency'] > 0 ? 'text-success' : 'text-danger'}">
          ${parseFloat(coin['price_change_percentage_24h_in_currency']).toFixed(1)}% 
        </td>
        <td class="${coin['price_change_percentage_7d_in_currency'] > 0 ? 'text-success' : 'text-danger'}">
          ${parseFloat(coin['price_change_percentage_7d_in_currency']).toFixed(1)}% 
        </td>
        <td>${formatPrice(coin['total_volume'])}</td>
        <td>${formatPrice(coin['market_cap'])}</td>
      </tr>
      `;

      const buttons = document.querySelectorAll('.detail-coin')
      buttons.forEach(button =>{
        button.addEventListener('click', event => {
          const element = event.currentTarget
          detailCoin(element.getAttribute("data-id"))
        })
      })
    })
  }

  const renderSearchCoin = (coins) => {
    const container = document.querySelector('.container-fluid')
    container.innerHTML = ''

    const rowHead = document.createElement('div')
    rowHead.classList.add('row', 'p-4')
    const h2 = document.createElement('h2')
    h2.innerText = 'Koin yang dicari'

    const rowTable = document.createElement('div')
    rowTable.classList.add('row', 'px-4')
    const table = document.createElement('table')
    table.classList.add('table')
    const thead = document.createElement('thead')
    thead.innerHTML = `<tr>
                        <th scope="col">Koin</th>
                        <th scope="col">#</th>
                      </tr>`
    const tbody = document.createElement('tbody')
    tbody.innerHTML = '';

    rowHead.appendChild(h2)
    container.appendChild(rowHead)
    
    rowTable.appendChild(table)
    table.appendChild(thead)
    table.appendChild(tbody)
    container.appendChild(rowTable)

    if(coins.length > 0){
      coins.forEach( coin => {
          tbody.innerHTML += `
            <tr>
              <td>
                <button type="button" class="btn btn-link m-0 p-0 text-dark detail-coin" style="text-decoration: none;" data-toggle="modal" data-id='${coin['id']}' data-target="#detailModal">
                  <h6><img width="20" class="mr-2" src="${coin['large']}"> ${coin['name']} <span class="badge text-uppercase ml-1 badge-secondary">${coin['symbol']}</span></h6>
                </button>  
              </td>
              <td>#${coin['market_cap_rank']}</td>
            </tr>
          `
      })

      const buttons = document.querySelectorAll('.detail-coin')
      buttons.forEach(button =>{
        button.addEventListener('click', event => {
          const element = event.currentTarget
          detailCoin(element.getAttribute("data-id"))
        })
      })
    } else {
      tbody.innerHTML += `
        <tr>
          <td colspan='2' class="text-center">
            <h5>Koin tidak ditemukan</h5>
          </td>
        </tr>
      `
    }
  }

  const renderDetailCoin = (coin) => {
    const header = document.querySelector("#detailModal .modal-header")
    const body = document.querySelector("#detailModal .modal-body")

    header.innerHTML = `
      <h4>
        <img width="25" src="${coin['image']['large']}" class="img-fluid">  
        ${coin['name']}
        <span class="badge text-uppercase badge-secondary">${coin['symbol']}</span>
      </h4>
      
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `

    body.innerHTML = `
      <div class="row">
        <div class="col-12">
          Harga ${coin['name']} <span class="text-uppercase"> (${coin['symbol']}) </span> <br>
          <h5>${formatPrice(coin['market_data']['current_price']['idr'])}
            <span class="badge text-uppercase ${coin['market_data']['price_change_percentage_24h'] > 0 ? 'badge-success' : 'badge-danger'}">
            ${coin['market_data']['price_change_percentage_24h'] > 0 ? '<i class="fas fa-sort-down"></i>': '<i class="fas fa-sort-up"></i>'}
            ${coin['market_data']['price_change_percentage_24h']}%
            </span> 
          </h5>
        </div>
        <div class="col-3 pr-0">
          <div class="card mt-2">
            <p>Kap Pasar</p>
            <h6>${formatNumber(coin['market_data']['market_cap']['idr'] == null ? '-' : coin['market_data']['market_cap']['idr'])}</h6>
          </div>
        </div>
        <div class="col-3 pr-0">
          <div class="card mt-2">
            <p>Volume 24 jam</p>
            <h6>${formatNumber(coin['market_data']['total_volume']['idr'] == null ? '-' : coin['market_data']['total_volume']['idr'])}</h6>
          </div>
        </div>
        <div class="col-3 pr-0 ">
          <div class="card mt-2">
            <p>Suplai Maks</p>
            <h6>${formatNumber(coin['market_data']['max_supply'] == null ? '-' : coin['market_data']['max_supply'])}</h6>
          </div>
        </div>        
        <div class="col-3 ">
          <div class="card mt-2">
            <p>Peredaran Suplai</p>
            <h6>${formatNumber(coin['market_data']['circulating_supply'] == null ? '-' : coin['market_data']['circulating_supply'])}</h6>
          </div>
        </div>
        <div class="col-12">
          <div class="card mt-2 pb-1">
            <h6>Link</h6>
            <div class="row col-12">
              ${coin['links']['homepage'][0] != '' ? `<div class="px-1"><a href="${coin['links']['homepage'][0]}" class="badge badge-info" target="_blank">Homepage</a></div>` : ''}
              ${coin['links']['blockchain_site'][0] != '' ? `<div class="px-1"><a href="${coin['links']['blockchain_site'][0]}" class="badge badge-info" target="_blank">Blockchain site</a></div>` : ''}
              ${coin['links']['official_forum_url'][0] != '' ? `<div class="px-1"><a href="${coin['links']['official_forum_url'][0]}" class="badge badge-info" target="_blank">Official Forum</a></div>` : ''}
              ${coin['links']['announcement_url'][0] != '' ? `<div class="px-1"><a href="${coin['links']['announcement_url'][0]}" class="badge badge-info" target="_blank">Announcement</a></div>` : ''}
              ${coin['links']['chat_url'][0] != '' ? `<div class="px-1"><a href="${coin['links']['chat_url'][0]}" class="badge badge-info" target="_blank">Chat Group</a></div>` : ''}
              ${coin['links']['twitter_screen_name'] != '' ? `<div class="px-1"><a href="https://twitter.com/${coin['links']['twitter_screen_name']}" class="badge badge-info" target="_blank">Twitter</a></div>` : ''}
              ${coin['links']['telegram_channel_identifier'] != '' ? `<div class="px-1"><a href="https://t.me/${coin['links']['telegram_channel_identifier']}" class="badge badge-info" target="_blank">Telegram</a></div>` : ''}
              ${coin['links']['subreddit_url'] != '' && coin['links']['subreddit_url'] != null ? `<div class="px-1"><a href="${coin['links']['subreddit_url']}" class="badge badge-info" target="_blank">Reddit</a></div>` : ''}
              ${coin['links']['repos_url']['github'][0] != '' && coin['links']['repos_url']['github'][0] != null? `<div class="px-1"><a href="${coin['links']['repos_url']['github'][0]}" class="badge badge-info" target="_blank">Github</a></div>` : ''}
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="card mt-2">
            <h6>Deskripsi</h6>
            <p>${coin['description']['en'] == null ? '-' : coin['description']['en']}</p>
          </div>
        </div>
      </div>
    `
  }

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#search-input')
    searchInput.addEventListener("input", function () {
      if (searchInput.value.length > 2){
        setTimeout(() => {
          searchCoin(searchInput.value)
        }, 500);
      } else {
        getCoin()
      }
    })
    setInterval(() => {
      if(searchInput.value.length < 3){
        getCoin()
      }
    }, 10000);

    getCoin();
  });
}

export default main;
