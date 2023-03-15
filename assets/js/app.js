const fetchJson = async (url, data, method = 'post') => {
  // faz o request
  const request = await fetch(url, {
    method: method, body: data,
  })

  // verifica o retorno
  if (request.status !== 200) {
    // retorna warning
    return {
      icon           : 'warning',
      title          : request.status,
      html           : request.statusText,
      showCloseButton: true,
    }
  }

  const response = await request.json()

  // retorna o json
  return response
}

const htmlStringParser = string => {
  const parser = new DOMParser()
  return parser.parseFromString(string, 'text/html').body.firstElementChild
}

const createModalFormWrapper = (modalSize = '', modalPosition = 'modal-dialog-centered') => {
  const modalWrapperTemplate = `<div class="modal fade" aria-hidden="true" tabindex="-1">
              <div class="modal-dialog ${modalPosition} ${modalSize}">
                <div class="modal-content">
                <form>
                  <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Modal body text goes here.</p>
                  </div>
                  <div class='modal-footer text-end'>
                    <button type='reset' class='btn'>Cancelar</button> <button type='submit' class='btn btn-primary'>Salvar</button>
                  </div>
                </form>
                </div>
              </div>
            </div>`
  const modalWrapper = htmlStringParser(modalWrapperTemplate)
  return {
    modal      : modalWrapper,
    modalHeader: modalWrapper.querySelector('.modal-header'),
    modalBody  : modalWrapper.querySelector('.modal-body'),
    modalFooter: modalWrapper.querySelector('.modal-footer'),
  }
}

const $body = document.querySelector('body')
const table = $body.querySelector('table')
let superModal, mainModalBody

// escuta cliques dentro de table
table.addEventListener('click', async (e) => {

  const clickedElement = e.target
  // se o elemento clicado for uma <a>
  if (clickedElement.nodeName === 'A') {
    e.preventDefault()

    const hRef = clickedElement.getAttribute('href')

    // separa a id de href
    const id = hRef.split('/').pop()

    if (hRef.startsWith('details')) {
      //# prepara os dados
      const data = new FormData()
      data.append('id', id)

      //# faz o request
      const json = await fetchJson('api/albuns/', data)

      if (json.hasOwnProperty('body')) {
        // cria a modal
        const {
                modal,
                modalHeader,
                modalBody,
                modalFooter,
              } = createModalFormWrapper('modal-xl')
        mainModalBody = modalBody

        // alimentar a modal com conteúdo
        modalHeader.insertAdjacentHTML('afterbegin', json.header)
        modalBody.innerHTML = json.body
        json.footer && (modalFooter.innerHTML = json.footer)

        // adiciona a modal ao body
        $body.appendChild(modal)

        // define a bs modal
        const mainModal = new bootstrap.Modal(modal)

        // mostra a modal
        mainModal.show()

        // listen for click inside modal
        modal.addEventListener('click', handleClickInsideModal, false)

        modal.addEventListener('hidden.bs.modal', () => {
          mainModal.dispose()
          $body.removeChild(modal)
          modal.removeEventListener('click', handleClickInsideModal, false)
        })

      } else {
        Swal.fire(json)
      }
    } else if (hRef.startsWith('delete')) {
      Swal.fire({
        icon             : 'warning',
        title            : 'Oops!',
        html             : `Tem certeza? Deletar: ${id}`,
        showCloseButton  : true,
        showDenyButton   : true,
        showCancelButton : true,
        confirmButtonText: `Don't delete`,
        denyButtonText   : 'Delete',
      })
    }
  }
})

const handleClickInsideModal = async e => {

  const clickedElement = e.target
  // se o elemento clicado for uma <a>
  if (clickedElement.nodeName === 'A') {
    e.preventDefault()

    const hRef = clickedElement.getAttribute('href')

    // separa a id de href
    const id = hRef.split('/').pop()

    //# prepara os dados
    const data = new FormData()
    data.append('id', id)

    //# faz o request
    const json = await fetchJson('api/edit/', data)

    if (json.hasOwnProperty('body')) {
      // cria a modal
      const {
              modal,
              modalHeader,
              modalBody,
              modalFooter,
            } = createModalFormWrapper('', '')

      // alimentar a modal com conteúdo
      modalHeader.insertAdjacentHTML('afterbegin', json.header)
      modalBody.innerHTML = json.body
      json.footer && (modalFooter.innerHTML = json.footer)

      // adiciona a modal ao body
      $body.appendChild(modal)

      // define a bs modal
      superModal = new bootstrap.Modal(modal)

      // mostra a modal
      superModal.show()

      modal.style.zIndex = 1058
      modal.nextElementSibling.style.zIndex = 1056

      // listen for click inside modal
      modal.addEventListener('submit', handleSuperModalSubmit, false)

      modal.addEventListener('hidden.bs.modal', () => {
        superModal.dispose()
        $body.removeChild(modal)
        modal.removeEventListener('submit', handleClickInsideModal, false)
      })
    }
  }
}

const handleSuperModalSubmit = async e => {
  e.preventDefault()

  const form = e.target

  // prepara os dados
  const data = new FormData(form)

  //# faz o request
  const json = await fetchJson('api/save/', data)

  // atualizar somente o body da mainModal

  const tBody = mainModalBody.querySelector('tbody')
  tBody.innerHTML=''
  const row = tBody.insertRow()
  const id = 'asdfqwerafsd'

  row.insertCell(0).innerHTML = id
  for (let [_, value] of data) {
    row.insertCell().innerHTML = value
  }
  row.insertCell().innerHTML = `<a href="edit/${id}" class="btn btn-link">superModal</a>`


  // dispara o sweet alert
  Swal.fire(json).then(() => {
    superModal.hide()
  })
}
