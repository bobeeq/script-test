// ==UserScript==
// @name     .tomczukToolKit
// @version  1.0
// @grant    none
// ==/UserScript==
// ======================= USER CONFIG ======================
var USER_CFG = {
    department: 'handlowy',
    z_ilu_dni_liczyc_sprzedaz: 7,
    na_ile_dni_wyliczac_zaporzebowanie: 14,
    min_zapotrz_na_14_dni: 40,
    min_il_do_zwrotu: 50,
    mnoznik_zapotrz_a_dost: 2,
    min_zysk_w_zl: 0.5
  }
  // ======================= USER CONFIG ======================
  
  // ======================= DEV CONFIG =======================
  var cbaMachine = true
  var run = true
  var testMode = true
  // ======================= DEV CONFIG =======================
  
  // ========================== GLOBAL ==========================
  HTMLElement.prototype.qs = function (sel) {
    return this.querySelector(sel)
  }
  HTMLElement.prototype.qsa = function (sel) {
    return [...this.querySelectorAll(sel)]
  }
  Map.prototype.add = function (key, val) {
    let current = this.get(key)
    if (current) {
      if (!Array.isArray(current)) throw new Error('Powinna być tablica')
      current.push(val)
    } else {
      this.set(key, [val])
    }
  }
  
  var app
  // ========================== GLOBAL ==========================
  
  /** @DONE
   *
   */
  function useTomczukToolbarStyles () {
    let style = html('style')
    style.id = 'tomczuk-toolbar-styles'
    let customUpdateableCSS = `:root {
      --right-panel-width: 400px;
      --main-transition: 250ms;
      --silver-color: #dedede;
      --red-color: #f55;
  }
  
  .tomczuk {
      all: revert;
      font-family: calibri;
      outline: none;
      font-size: 17px;
      line-height: normal;
  }
  
  .tomczuk-right-panel {
      padding: 0;
      color: var(--silver-color);
      font-size: 1.2em;
      position: fixed;
      top: 0;
      right: 0;
      z-index: 2147483645;
      /* max: 2147483647 */
      border-left: 3px solid #000;
      background: rgba(0, 0, 0, 0.5);
      height: 100vh;
      width: var(--right-panel-width);
      transition: var(--main-transition) ease-out;
      box-shadow: inset 80px 0 80px -60px rgba(0, 0, 0, 0.5);
      user-select: none;
  }
  
  .tomczuk-right-panel.tomczuk-click-through {
      opacity: .03;
      pointer-events: none;
  }
  
  .tomczuk-right-panel.tomczuk-pinned {
      right: 0;
  }
  
  .tomczuk-right-panel.tomczuk-full {
      right: 0;
  }
  
  .tomczuk-right-panel.tomczuk-invisible {
      top: 100vh;
      right: calc(var(--right-panel-width) * -1) !important;
  }
  
  .tomczuk-right-panel.tomczuk-hidden {
      right: calc(30px - var(--right-panel-width));
  }
  
  .tomczuk-right-panel.tomczuk-hidden:hover {
      opacity: .7;
  }
  
  .tomczuk-right-panel-header {
      padding: 7px 2px;
      background: rgba(0, 0, 0, 0.8);
      letter-spacing: 1px;
      display: flex;
      align-items: center;
  }
  
  .tomczuk-panel-toggler {
      background-color: var(--silver-color);
      border-radius: 5px;
      padding: 2px;
      font-size: .9em;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
  }
  
  .tomczuk-panel-toggler:hover {
      cursor: pointer;
      background-color: #ababab;
  }
  
  .tomczuk-panel-toggler.tomczuk-active {
      background-color: greenyellow;
  }
  
  .tomczuk-utility-container {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 0;
  }
  
  .tomczuk-primary,
  .tomczuk-secondary {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 5px;
      max-height: 90vh;
      overflow-y: auto;
  }
  
  .tomczuk-box {
      border: 1px solid var(--silver-color);
      border-radius: 5px;
      margin: 4px 0;
      flex: 1;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
  }
  
  .tomczuk-right-panel.tomczuk-hidden .tomczuk-box {
      display: none;
  }
  
  .tomczuk-box-title {
      background: #000;
      padding: 3px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      border-radius: inherit;
      border-bottom: 2px solid var(--silver-color);
      letter-spacing: 1px;
      text-transform: uppercase;
  }
  
  .tomczuk-box-title-arrow {
      display: flex;
      align-items: center;
      font-size: .6em;
      color: var(--red-color);
  }
  
  .tomczuk-box-title-arrow.arrow-minimized {
      transform: rotate(-90deg);
  }
  
  .tomczuk-box-title:hover {
      filter: contrast(2);
  }
  
  .tomczuk-box-title-arrow:hover {
      color: #f00;
  }
  
  .tomczuk-box-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: stretch;
      padding: 5px;
      overflow: hidden;
      opacity: 1;
      max-height: 220px;
      pointer-events: inherit;
      transition: .5s;
  }
  
  .tomczuk-box-container.tomczuk-minimized-box {
      transition: .8s cubic-bezier(0, 1, 0, 1);
      pointer-events: none;
      opacity: 0;
      max-height: 0;
  }
  
  .tomczuk-sales-box>.tomczuk-box-container {
      background-color: #000;
      margin: 3px;
      padding: 4px;
      display: block;
      border-radius: 5px;
  }
  
  .tomczuk-self-input {
      border: 1px solid black;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
      font-size: 1em;
      padding: 3px;
      cursor: copy;
      border-radius: 3px;
  }
  
  .tomczuk-self-input.tomczuk-self-input-copying {
      color: var(--red-color);
      font-weight: 800;
      background-color: #fff;
      border-color: var(--red-color);
      cursor: progress;
  }
  
  .tomczuk-row-btns {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 4px;
  }
  
  .tomczuk-btn,
  .tomczuk-btn:visited {
      cursor: pointer;
      border: 1px solid black;
      text-decoration: none;
      flex: 1;
      font-size: 1em;
      border-radius: 5px;
      padding: 2px 0;
      background: var(--silver-color);
      color: #000;
      transition: filter 80ms;
      text-transform: uppercase;
  }
  
  .tomczuk-btn:hover {
      text-decoration: none;
      color: #000;
      filter: contrast(1.3);
  }
  
  .tomczuk-nav-btn {
      background-size: 30%;
      background-origin: content-box;
      background-position: center;
      background-repeat: no-repeat;
      font-size: 1.5em;
      padding: 5px;
  }
  
  .tomczuk-sale-control-panel-container {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  
  .tomczuk-input-ctrl {
      all: initial!important;
      background-color: white!important;
      transform: scale(1.2)!important;
      padding: 2px!important;
      margin: 5px 20px!important;
      text-align: center!important;
      border-radius: 3px!important;
      -webkit-appearance: auto!important;
      -moz-appearance: auto!important;
      appearance: auto!important;
  }
  
  .tomczuk-mobile-mode {
      background-color: greenyellow;
      border-color: var(--red-color);
  }
  
  .tomczuk-mobile-mode:hover {
      background-color: orange;
  }
  
  .tomczuk-goup-btn {
      opacity: 1;
      transition: opacity 600ms;
  }
  
  .tomczuk-hidden {
      opacity: .5;
      cursor: default;
  }
  
  .tomczuk-hidden:hover {
      filter: none;
  }
  
  .tomczuk-goup-btn.tomczuk-hidden {
      filter: none;
  }
  
  .tomczuk-product-info-box {
      text-align: center;
      display: flex;
      flex-direction: column;
      max-height: 120px;
      margin: 3px 1px;
  }
  
  .tomczuk-product-info-box.tomczuk-hidden {
      display: none;
  }
  
  .tomczuk-product-info-box>.tomczuk-box-child {
      margin: 3px;
      background: green;
      color: white;
      z-index: 1;
  }
  
  .tomczuk-btn.tomczuk-product-list-mode {
      background: greenyellow;
  }
  
  .tomczuk-copy-product-list,
  .tomczuk-modify-product-list {
      font-size: 1.5em;
  }
  
  .tomczuk-invisible-btn {
      position: fixed;
      cursor: pointer;
      right: 0;
      bottom: 0;
      font-size: 12px;
      z-index: 2147483647;
  }
  
  .tomczuk-invisible-btn:hover {
      filter: brightness(1.5);
  }
  
  .tomczuk-container-hovered {
      transition: 600ms;
      background-color: #e6e6e6;
  }
  
  .tomczuk-box-adjusted {
      height: auto!important;
  }
  
  .tomczuk-box-adjusted .product-container {
      height: auto!important;
  }
  
  .tomczuk-box-adjusted.tomczuk-tk-promo-list {
      height: 410px!important;
  }
  
  .tomczuk-box-adjusted.tomczuk-tk-promo-list>.tomczuk-list-sales-box {
      top: 0;
  }
  
  .tomczuk-remember-sales-cfg {
      cursor: pointer;
      font-size: .8rem;
  }
  
  .tomczuk-remember-sales-cfg input {
      margin-right: 5px;
  }
  
  .tomczuk-remember-sales-cfg:hover {
      color: #0060df;
  }
  
  .tomczuk-box-adjusted.tomczuk-tk-promo-list>.has-available {
      top: 220px;
  }
  
  .tomczuk-sales-box-table {
      font-size: inherit;
      margin-top: 5px;
      width: 100%;
      box-sizing: border-box;
      white-space: nowrap;
      border-collapse: collapse;
  }
  
  .tomczuk-sales-box-table td {
      border: 1px solid black;
      font-size: inherit;
      padding: 3px 6px;
  }
  
  .tomczuk-sales-box-table td:first-child {
      text-align: right;
  }
  
  .tomczuk-sales-box-table td:last-child {
      text-align: center;
      font-weight: 800;
      min-width: 42%;
  }
  
  .tomczuk-list-sales-box {
      padding: 3px;
      font-size: .8rem;
      height: 225px;
  }
  
  .tomczuk-list-sales-box table,
  .tomczuk-list-sales-box tr,
  .tomczuk-list-sales-box button,
  .tomczuk-list-sales-box input,
  .tomczuk-list-sales-box div,
  .tomczuk-list-sales-box td {
      font-size: inherit;
  }
  
  .tomczuk-supply-low {
      box-shadow: inset 0 0 20px 5px #f00;
      background-color: rgba(255, 0, 0, .2);
  }
  
  .tomczuk-supply-check {
      box-shadow: inset 0 0 20px 5px #00f;
      background-color: rgba(0, 0, 255, .2);
  }
  
  .tomczuk-supply-medium {
      box-shadow: inset 0 0 20px 5px #ffa500;
      background-color: rgba(255, 165, 0, .2);
  }
  
  .tomczuk-supply-overload {
      box-shadow: inset 0 0 20px 5px #000;
      background-color: rgba(0, 0, 0, .2);
  }
  
  .tomczuk-supply-availab-danger {
      box-shadow: inset 0 0 20px 10px #ff1493;
      background-color: rgba(255,20,147, .5);
      transition: 450ms;
  }
  
  .tomczuk-supply-availab-danger:hover {
      background-color: rgba(255,20,147, .8);
  }
  
  .tomczuk-height-auto {
      height: auto!important;
  }
  
  .tomczuk-wholesale-btn {
      width: 100%;
      margin: 5px 0;
      cursor: pointer;
  }
  
  .tomczuk-wholesale-box {
      position: relative;
      overflow: visible;
  }
  
  .tomczuk-wholesale-box table {
      border-collapse: collapse;
      position: absolute;
      padding: 2px;
      background-color: white;
      top: 0;
      width: 100%;
      z-index: 100;
  }
  
  .tomczuk-wholesale-box tr:first-child {
      font-weight: 800;
  }
  
  .tomczuk-wholesale-box td,
  .tomczuk-wholesale-box th {
      border: 1px solid black;
      text-align: center;
      font-size: inherit;
  }
  
  .tomczuk-tk-slider-btns {
      bottom: 700px!important;
  }
  
  .tomczuk-go-to-cba {
      text-align: center;
      display: block;
      font-size: inherit;
      color: black;
      margin: 3px;
  }
  
  .tomczuk-go-to-cba:hover {
      background-color: rgba(0, 0, 0, .2);
  }`
  
    style.textContent = customUpdateableCSS
    let head = qs('head')
    if (head) head.append(style)
  }
  
  class App {
    /** @DONE
     *
     */
    constructor () {
      test(this)
      app = this
      app.startUpTime = Date.now()
      app.department = USER_CFG.department
      app.storage = new Storage()
      switch (true) {
        case isCBA():
          app.ctrl = new CBAController()
          break
        case isTK():
        case isCurrentPage('tk.dev.kierushop'):
          app.ctrl = new TKController()
          break
        case isBEE():
          app.ctrl = new BEEController()
          break
        case isCurrentPage('fantastyczneswiaty.pl'):
          app.ctrl = new FantastyczneSwiatyController()
          break
        case isCurrentPage('bonito.pl'):
          app.ctrl = new BonitoController()
          break
        case isCurrentPage('nowe.bonito.pl'):
          app.ctrl = new NoweBonitoController()
          break
        case isCurrentPage('gandalf.com.pl'):
          app.ctrl = new GandalfController()
          break
        case isCurrentPage('swiatksiazki.pl'):
          app.ctrl = new SwiatKsiazkiController()
          break
        case isCurrentPage('tantis.pl'):
          app.ctrl = new TantisController()
          break
        case isCurrentPage('czytam.pl'):
          app.ctrl = new CzytamController()
          break
        case isCurrentPage('wydawnictwokobiece.pl'):
          app.ctrl = new WKController()
          break
        case isCurrentPage('czarymary.pl'):
          app.ctrl = new CMController()
          break
        case isCurrentPage('allegro.pl/oferta'):
          app.ctrl = new AllegroController()
          break
        case isCurrentPage('matras.pl'):
          app.ctrl = new MatrasController()
          break
        case isCurrentPage('lubimyczytac.pl'):
          app.ctrl = new LubimyCzytacController()
          break
        default:
          app.ctrl = new BasicController()
      }
  
      app.getRightPanel()
    }
  
    /** @DONE
     * @param {array} departments
     * @param {string} feature
     * @returns
     */
    allow (departments, feature) {
      test('Odpalam funkcję app.allow()')
      return (
        departments.includes(app.department) &&
        app.ctrl.native.showFeature(feature)
      )
    }
  
    /** @DONE
     * @param {array} departments
     * @param {string} feature
     * @returns
     */
    forbid (departments, feature) {
      return (
        !departments.includes(app.department) &&
        app.ctrl.native.showFeature(feature)
      )
    }
  
    /** @DONE
     * @returns {object}
     */
    getRightPanel () {
      let rightPanel = html('div', { classes: 'tomczuk-right-panel' })
      app.rightPanel = rightPanel
  
      rightPanel.adjustWidth = () => {
        if (rightPanel.classList.contains('tomczuk-pinned')) return
        let panelWidth = 400
        let minSpace = 30
        let space = app.ctrl.native.spaceForPanel()
        if (!space) {
          rightPanel.hide()
        } else {
          rightPanel.classList.remove('tomczuk-hidden')
          rightPanel.style.right =
            Math.min(0, Math.max(space - panelWidth, minSpace - panelWidth)) +
            'px'
        }
      }
  
      rightPanel.fullWidth = () => {
        if (rightPanel.classList.contains('tomczuk-pinned')) return
        rightPanel.removeAttribute('style')
        rightPanel.classList.remove('tomczuk-hidden')
        rightPanel.classList.add('tomczuk-full')
      }
  
      rightPanel.hide = () => {
        if (rightPanel.classList.contains('tomczuk-pinned')) return
        rightPanel.classList.remove('tomczuk-full')
        rightPanel.classList.add('tomczuk-hidden')
      }
  
      rightPanel.pin = () => {
        rightPanel.removeAttribute('style')
        rightPanel.classList.add('tomczuk-pinned')
        rightPanel.classList.remove('tomczuk-full', 'tomczuk-hidden')
        app.storage.set('panelToggler', 'pinned')
      }
  
      rightPanel.unpin = () => {
        rightPanel.classList.remove('tomczuk-pinned')
        rightPanel.fullWidth()
        app.storage.set('panelToggler', 'unpinned')
      }
  
      if (app.storage.get('panelToggler') == 'pinned') {
        rightPanel.pin()
      } else rightPanel.adjustWidth()
  
      let timeOutId
      rightPanel.addEventListener('mouseleave', () => {
        if (rightPanel.classList.contains('tomczuk-pinned')) return
        timeOutId = setTimeout(() => {
          rightPanel.adjustWidth()
        }, 800)
      })
  
      rightPanel.addEventListener('mouseover', () => clearTimeout(timeOutId))
  
      rightPanel.addEventListener('click', e => {
        let classes = e.target.classList
  
        if (
          classes.contains('tomczuk-right-panel') ||
          classes.contains('tomczuk-primary') ||
          classes.contains('timczuk-secondary') ||
          classes.contains('tomczuk-utility-container') ||
          classes.contains('tomczuk-right-panel-header') ||
          classes.contains('tomczuk-right-panel-header-title')
        ) {
          rightPanel.fullWidth()
          rightPanel.classList.remove('tomczuk-hidden')
        }
      })
  
      app.getHeader()
      app.makeUtilityContainer()
      document.body.append(rightPanel)
      return rightPanel
    }
  
    setInitListeners () {
      document.addEventListener('click', e => {
        if (e.target.closest('.tomczuk-right-panel')) return
        app.rightPanel.adjustWidth()
      })
  
      window.addEventListener('resize', () => {
        app.rightPanel.adjustWidth()
      })
  
      document.addEventListener('scroll', showGoUpBtn)
      document.addEventListener('resize', showGoUpBtn)
  
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          setTimeout(() => {
            app.rightPanel.classList.add('tomczuk-click-through')
            setTimeout(() => {
              app.rightPanel.classList.remove('tomczuk-click-through')
            }, 3000)
          }, 150)
        }
      })
    }
  
    /** @DONE
     *
     */
    getInvisibleBtn () {
      let btn = html('a', { classes: 'tomczuk-invisible-btn tomczuk-invisible' })
      if (app.storage.get('rightPanelInvisible') == false) {
        app.rightPanel.classList.remove('tomczuk-invisible')
        btn.innerHTML = '&#128317;'
      } else {
        app.rightPanel.classList.add('tomczuk-invisible')
        app.storage.set('rightPanelInvisible', 'true')
        btn.innerHTML = '&#128316;'
      }
  
      btn.addEventListener('click', () => {
        app.rightPanel.classList.toggle('tomczuk-invisible')
        if (app.rightPanel.classList.contains('tomczuk-invisible')) {
          btn.innerHTML = '&#128316;'
          app.storage.set('rightPanelInvisible', 'true')
        } else {
          btn.innerHTML = '&#128317;'
          app.storage.set('rightPanelInvisible', 'false')
        }
      })
  
      app.rightPanel.after(btn)
    }
    /** @DONE
     *
     */
    makeUtilityContainer () {
      const container = html('div', { classes: 'tomczuk-utility-container' })
      container.primary = html('div', { classes: 'tomczuk-primary' })
      container.secondary = html('div', { classes: 'tomczuk-secondary' })
      container.append(container.primary, container.secondary)
      app.rightPanel.append(container)
      app.rightPanel.container = container
    }
  
    /** @DONE
     *
     */
    getHeader () {
      const header = html('div', { classes: 'tomczuk-right-panel-header' })
      header.append(
        html('div', {
          textContent: '.tomczukToolKit',
          classes: 'tomczuk-right-panel-header-title'
        })
      )
      const panelToggler = app.getPanelToggler(app.storage.get('panelToggler'))
  
      header.prepend(panelToggler)
      app.rightPanel.append(header)
      app.rightPanel.header = header
    }
  
    /** @DONE
     *
     */
    getPanelToggler (pinned) {
      const panelToggler = html('div', {
        classes: 'tomczuk-panel-toggler',
        innerHTML: '&#128204;',
        title: 'Przypnij'
      })
      const activeClass = 'tomczuk-active'
  
      if (pinned == 'pinned') panelToggler.classList.add(activeClass)
  
      panelToggler.addEventListener('click', () => {
        if (panelToggler.classList.contains(activeClass)) {
          app.rightPanel.unpin()
          panelToggler.classList.remove(activeClass)
        } else {
          app.rightPanel.pin()
          panelToggler.classList.add(activeClass)
        }
      })
      return panelToggler
    }
  
    /** @DONE
     *
     */
    navBox () {
      const allowed = app.forbid([], 'navBox')
  
      if (!allowed) return
  
      let nav = box('Nawigacja')
      const navBtnsContainer = html('div', {
        classes: 'tomczuk-nav-btns-container tomczuk-row-btns'
      })
  
      let reCacheBtn = app.getReCacheBtn()
      if (reCacheBtn) navBtnsContainer.append(reCacheBtn)
  
      const mobileBtn = app.getMobileBtn()
      if (mobileBtn) navBtnsContainer.append(mobileBtn)
  
      const goUpBtn = html('a', {
        innerHTML: '&#11014;&#65039;',
        classes: 'tomczuk-btn tomczuk-nav-btn tomczuk-goup-btn',
        title: 'Do góry strony'
      })
      goUpBtn.classList.toggle('tomczuk-hidden', !window.scrollY)
  
      goUpBtn.addEventListener('click', e => {
        e.preventDefault()
        window.scrollTo(0, 0)
      })
  
      navBtnsContainer.append(goUpBtn)
  
      nav.container.append(navBtnsContainer)
      app.rightPanel.container.primary.append(nav)
    }
  
    /** @DONE
     *
     * @returns
     */
    getReCacheBtn () {
      const allowed = app.forbid([], 'reCacheBtn')
      if (!allowed) return null
      const reCacheBtn = html('a', {
        classes: 'tomczuk-btn tomczuk-nav-btn tomczuk-recache-btn',
        innerHTML: '&#128260;',
        title: 'ReCache'
      })
  
      reCacheBtn.addEventListener('click', async () => {
        let url = window.location.href
        if (url.match(/recache=1/i)) {
          window.location.reload()
          return
        }
        url += (url.match(/\?/) ? '&' : '?') + 'ReCache=1'
        window.location.href = url
        // window.location.reload();
      })
  
      return reCacheBtn
    }
  
    /** @DONE
     *
     */
    getMobileBtn () {
      const allowed = app.forbid([], 'mobileBtn')
      if (!allowed) return null
  
      const mobileBtn = html('a', {
        innerHTML: '&#128241;',
        classes: 'tomczuk-btn tomczuk-nav-btn tomczuk-mobile-btn',
        title: 'Mobile Mode'
      })
  
      if (sessionStorage.tomczukMobileMode !== 'true') {
        mobileBtn.classList.remove('tomczuk-mobile-mode')
      } else {
        mobileBtn.classList.add('tomczuk-mobile-mode')
      }
      mobileBtn.addEventListener('click', async () => {
        const basicUrl = window.location.href.match(/^https?:\/\/[^\/]*/)
        if (!mobileBtn.classList.contains('tomczuk-mobile-mode')) {
          mobileBtn.classList.add('tomczuk-mobile-mode')
          sessionStorage.tomczukMobileMode = 'true'
          try {
            await fetch(basicUrl + '/?Theme=Mobile')
          } catch (e) {}
          window.location.reload(true)
        } else {
          mobileBtn.classList.remove('tomczuk-mobile-mode')
          sessionStorage.tomczukMobileMode = 'false'
          try {
            await fetch(basicUrl + '/?Theme=')
          } catch (e) {}
  
          window.location.reload(true)
        }
      })
  
      return mobileBtn
    }
  
    /** @DONE
     *
     */
    productBox () {
      const allowed = app.forbid([], 'productBox')
      if (!allowed) return
  
      let model = app.ctrl.cfg.model
      if (isDev() && !model) model = '9788382158106'
      if (!model) return
  
      const productBox = box('Produkt')
      const input = selfCopyInput({ value: model })
      productBox.container.append(input)
  
      const btnsContainer = html('div', {
        classes: 'tomczuk-product-btns-container tomczuk-row-btns'
      })
      if (!isCBA())
        btnsContainer.append(
          btn({
            value: 'cba',
            url: `https://cba.kierus.com.pl/?p=EditProduct&load=*${model}`
          })
        )
      if (!isTK())
        btnsContainer.append(
          btn({
            value: 'tk',
            url: `https://www.taniaksiazka.pl/Szukaj/q-${model}`
          })
        )
      if (!isBEE())
        btnsContainer.append(
          btn({
            value: 'bee',
            url: `https://www.bee.pl/Szukaj/q-${model}?pf-size=24&pf-page=1`
          })
        )
  
      const comingBasketsUrlBtn = app.comingBasketsUrlBtn(model)
      productBox.container.append(btnsContainer)
      if (comingBasketsUrlBtn) productBox.container.append(comingBasketsUrlBtn)
      app.rightPanel.container.primary.append(productBox)
    }
    /** @DONE
     *
     * @param {string} model
     * @returns {object}
     */
    comingBasketsUrlBtn (model) {
      const allowed = app.allow('handlowy', 'comingBasketsUrlBtn')
      if (!allowed) return null
      return btn({ value: 'Jadące koszyki', url: arrivingBasketsUrl(model) })
    }
  
    /** @DONE
     *
     */
    async productListBox () {
      const allowed = app.forbid([], 'productListBox')
      if (!allowed) return
  
      const productListBox = box('Lista produktów')
      const btnsContainer = html('div', {
        classes: 'tomczuk-product-btns-container tomczuk-row-btns'
      })
      const copyListBtn = html('a', {
        innerHTML: '&#128203;',
        classes: 'tomczuk-btn tomczuk-copy-product-list',
        title: 'Kopiuj listy produktów'
      })
  
      const modifyListBtn = html('a', {
        innerHTML: '&#128200;',
        classes: 'tomczuk-btn tomczuk-modify-product-list',
        title: 'Pokaż statystyki'
      })
  
      modifyListBtn.classList.toggle(
        'tomczuk-product-list-mode',
        app.storage.get('productListMode')
      )
  
      modifyListBtn.addEventListener('click', async () => {
        let className = 'tomczuk-product-list-mode'
        let currentMode = modifyListBtn.classList.contains(className)
        modifyListBtn.classList.toggle(className, !currentMode)
        app.storage.set('productListMode', !currentMode)
  
        app.ctrl.native.loadLists()
      })
  
      copyListBtn.addEventListener('click', e => {
        e.preventDefault()
        copyListBtn.classList.add('tomczuk-hidden')
        setTimeout(() => {
          copyListBtn.classList.remove('tomczuk-hidden')
        }, 1200)
        this.ctrl.native.copyProductList()
      })
  
      productListBox.container.append(btnsContainer)
      btnsContainer.append(copyListBtn)
      btnsContainer.append(modifyListBtn)
      app.rightPanel.container.primary.append(productListBox)
  
      let sortBtn = html('button', {
        textContent: 'SORTUJ (beta)',
        classes: 'tomczuk-btn'
      })
      sortBtn.addEventListener('click', () => {
        app.ctrl.listBundle.sortByProfit()
      })
      productListBox.append(sortBtn)
    }
  
    /** @DONE
     *
     */
    salesBox () {
      const allowed = app.allow(['handlowy'], 'salesBox')
      if (!allowed || !app.ctrl.cfg.model) return
  
      const salesBox = box('Sprzedaż')
      salesBox.classList.add('tomczuk-sales-box')
      salesBox.container.controlPanel = app.getSalesControlPanel()
      salesBox.container.append(salesBox.container.controlPanel)
      app.rightPanel.container.primary.append(salesBox)
      app.rightPanel.container.primary.salesBox = salesBox
  
      const remember = html('label', {
        textContent: 'zapamiętuj',
        classes: 'tomczuk-remember-sales-cfg'
      })
      const rememberInput = html('input', { type: 'checkbox' })
      remember.prepend(rememberInput)
      salesBox.container.controlPanel.after(remember)
      if (app.storage.get('saleReportDuration')) {
        rememberInput.checked = true
      } else rememberInput.checked = false
      rememberInput.addEventListener('change', e => {
        if (e.target.checked) {
          app.storage.set(
            'saleReportDuration',
            salesBox.container.controlPanel.qs('.tomczuk-duration').value
          )
          app.storage.set(
            'saleReportDelay',
            salesBox.container.controlPanel.qs('.tomczuk-delay').value
          )
        } else {
          app.storage.set('saleReportDuration', '')
          app.storage.set('saleReportDelay', '')
        }
      })
      getSaleReportForProduct()
    }
  
    /** @DONE
     * @returns {HTMLElement}
     */
    getSalesControlPanel () {
      let container = html('div', {
        classes: 'tomczuk-sale-control-panel-container'
      })
      container.append(html('span', { innerText: 'wstecz' }))
      container.append(html('span', { innerText: 'dni' }))
  
      let delayInput = html('input', {
        type: 'number',
        min: '-1',
        value: app.storage.get('saleReportDelay') ?? '0',
        classes: 'tomczuk-input-ctrl tomczuk-delay',
        title:
          'Ile dni temu był ostatni dzień sprzedaży\n0 dla wczoraj\n-1 dla dzisiaj'
      })
      delayInput.addEventListener('click', () => delayInput.select())
      delayInput.addEventListener('change', getSaleReportForProduct)
      container.append(delayInput)
  
      let durationInput = html('input', {
        type: 'number',
        min: '0',
        value: app.storage.get('saleReportDuration') ?? '14',
        step: '7',
        classes: 'tomczuk-input-ctrl tomczuk-duration',
        title: 'Długość okresu sprzedaży'
      })
      durationInput.addEventListener('click', () => durationInput.select())
      durationInput.addEventListener('change', getSaleReportForProduct)
      container.append(durationInput)
      return container
    }
  }
  
  class NativeCtrl {
    /** @DONE
     * @param {Controller} controller
     */
    constructor (controller) {
      test(this)
      this.ctrl = controller
      this.init()
    }
  
    /** @DONE ... so far
     *
     * @returns
     */
    async init () {
      this.ctrl.cfg = this.basicCfg()
      this.overrideCfg()
  
      if (this.ctrl.cfg.access === false) {
        test('ctrl.cfg.access == false, kończę inicjację NativeCtrl', 1)
        return
      }
      if (isDev() && !this.ctrl.cfg.model) this.ctrl.cfg.model = '9788382158106'
      this.ctrl.listBundle = new ListBundle(this.ctrl.getLists())
      this.ctrl.cfg.model = this.ctrl.productModel()
  
      this.runListsObserver()
    }
  
    /** @TODO - do przeanalizowania
     *
     * @returns {object}
     */
    basicCfg () {
      test('Pobieram basicCfg() dla kontrolera')
      return {
        access: true, // @DEPRECATED?
        mutationBreakTimeMs: 3600,
        daysForSalesBundleReport: USER_CFG.z_ilu_dni_liczyc_sprzedaz,
        checkLastMutationIntervalMs: 200,
        model: null,
        lastMutationOccuredAt: Date.now()
      }
    }
  
    /** @DONE
     * Nadpisuje bazową konfigurację z Native konfiguracją z Controllera.
     * @see basicCfg
     * @see Controller.getCfg
     * @see TKController.getCfg
     */
    overrideCfg () {
      test('Nadpisuję cfg kontrolera za pomocą overrideCfg()')
      let cfg = this.ctrl.getCfg()
      for (let setting of Object.keys(cfg)) {
        this.ctrl.cfg[setting] = cfg[setting]
      }
    }
  
    /** @DONE? @CHECK @TODO?
     * @returns {void}
     */
    runListsObserver () {
      // var mutationSecondCheck = false;    // @DEBUG do debugowania, przed produkcją wyjebać.
      let longestGap = 0
      let observer = new MutationObserver(entries => {
        let now = Date.now()
        let diff = now - this.ctrl.cfg.lastMutationOccuredAt
        if (diff > longestGap) longestGap = diff
  
        this.ctrl.cfg.lastMutationOccuredAt = Date.now()
        // if(mutationSecondCheck) log('JESZCZE COŚ TAM PYKŁO!'); // @DEBUG
        // secFromStart();      // @DEBUG
        // log(entries);        // @DEBUG
      })
      observer.observe(document.body, { childList: true, subtree: true })
  
      let checkLastMutationInterval = setInterval(() => {
        let mutationStopped =
          Date.now() - this.ctrl.cfg.lastMutationOccuredAt >=
          this.ctrl.cfg.mutationBreakTimeMs
  
        if (mutationStopped) {
          log(
            `Mutation finished, turning off interval... ${secFromStart(
              false,
              false
            )}`
          )
          log(`Longest gap between mutations: ${(longestGap / 1000).toFixed(2)}s`)
          clearInterval(checkLastMutationInterval)
          observer.disconnect()
          // mutationSecondCheck = true; // @DEBUG, na proda -> observer.disconnect();
          this.loadLists()
        }
      }, this.ctrl.cfg.checkLastMutationIntervalMs)
    }
  
    /** @TODO - metoda będzie odpalana po załadowaniu boxów produktowych w DOMie
     * @see {runListsObserver()}
     *
     */
    async loadLists () {
      this.ctrl.listBundle.loadLists()
      if (this.ctrl.cfg.model) {
        this.ctrl.allModels.push(this.ctrl.cfg.model)
      }
      await this.salesReportForLoadedBoxes()
      this.ctrl.listBundle.loadProductsFromReport()
      this.showLists()
    }
  
    copyProductList () {
      let copyVal =
        'model\ttytul\tautor\tcena_tk\tcena_detal\trabat\ttyp\tdost\tlink_sklep\tstan\tsprzedaz_dzienna'
      this.ctrl.allBoxes.forEach(boxArr => {
        boxArr.forEach(box => {
          let shop = box.product?.shopData?.rawData
          let report = box.product?.reportData
          copyVal += `\n${box.model}\t${shop.title}\t${shop.authors ?? '-'}\t${
            shop.price
          }\t${shop.retail}\t${box.product.discount ?? '-'}\t${shop.type ??
            '-'}\t${shop.availab ?? '-'}\t${shop.realShopUrl}\t${report?.data
            ?.magQty ?? '?'}\t${report?.data?.dailySaleQty
            ?.toString()
            .replace('.', ',') ?? '?'}`
        })
      })
      navigator.clipboard.writeText(copyVal)
    }
  
    /** @THINK
     *
     */
    async salesReportForLoadedBoxes () {
      if (
        this.ctrl.cfg.salesReportForXDays ||
        !app.storage.get('productListMode')
      ) {
        return
      }
  
      this.ctrl.cfg.salesReportForXDays = prepareReport(
        await getSalesBundleReport(
          this.ctrl.allModels,
          this.ctrl.cfg.daysForSalesBundleReport
        )
      )
  
      this.ctrl.cfg.wholesaleBundleReport = prepareReport(
        await getWholesaleBundleReport(this.ctrl.allModels)
      )
  
      return
    }
  
    /**
     *
     */
    showLists () {
      if (app.storage.get('productListMode')) {
        this.ctrl.listBundle.adjustAll()
        this.ctrl.listBundle.buildAll()
      } else {
        this.ctrl.listBundle.unadjustAll()
        this.ctrl.listBundle.unbuildAll()
      }
    }
  
    /** @DONE
     *
     * @returns {number}
     */
    spaceForPanel () {
      let selectors = this.ctrl.mainContainerSelectors()
      let selector = !Array.isArray(selectors)
        ? selectors
        : selectors.find(sel => qs(sel))
  
      if (!selector) return null
      let container = qs(selector)
      if (!container) return null
  
      return (
        (noPx(window.getComputedStyle(document.body).width) -
          container.clientWidth) /
          2 -
        10
      )
    }
  
    /** @DONE
     * @THINK: czy na pewno NativeCtrl? Może gdzieś to przenieść?
     */
    redirectFromSearchPage () {
      if (!this.ctrl.isSearchPage()) return
      const url = this.ctrl.searchedElementUrl(this.ctrl.searchText())
      if (url) window.location.href = url
    }
  
    /** @DONE
     * @param {string} feature
     * @returns {boolean}
     */
    showFeature (feature) {
      const { accepted, forbidden } = this.ctrl.featuresPermissions()
      if (forbidden.length > 0) return !forbidden.find(el => el === feature)
      if (accepted.length > 0) return accepted.find(el => el === feature)
      return true
    }
  }
  
  class Controller {
    constructor () {
      test(this)
      this.allBoxes = new Map()
      this.allModels = []
      this.native = new NativeCtrl(this)
    }
  
    /** @OVERRIDE
     *
     * @returns array
     */
    getLists () {
      return []
    }
  
    /** @DONE
     *
     * @param {string} text
     * @param {string} color
     */
    log (text, color = 'white') {
      this.native.log(text, color)
    }
  
    /** @DONE
     * @OVERRIDE
     */
    getCfg () {
      return {}
    }
  
    /**
     * OVERRIDE
     * @returns
     */
    mainContainerSelectors () {
      return null
    }
  
    /** @OVERRIDE if needed
     *
     * @param {HTMLElement} dom
     * @returns
     */
    productModel (dom = null) {
      if (dom === null) dom = document.body
      return dom?.qs('meta[itemprop="productID"]')?.getAttribute('content')
    }
    /**
     * @OVERRIDE
     * @returns
     */
    isSearchPage () {
      return null
    }
    searchText () {
      return null
    }
    searchedElementUrl () {
      return null
    }
  
    /**
     * @OVERRIDE
     * @returns {object}
     */
    featuresPermissions () {
      return {
        accepted: [],
        forbidden: ['mobileBtn', 'reCacheBtn', 'productListBox']
      }
    }
  }
  
  class TKController extends Controller {
    getLists () {
      return [
        new TKStandardList(),
        new TKProductPageList(),
        new TKBestsellersList(),
        new TKSliderList(),
        new TKPromoList()
      ]
    }
  
    getCfg () {
      return { mutationBreakTimeMs: 2600 }
    }
  
    mainContainerSelectors () {
      return sessionStorage.tomczukMobileMode === 'true'
        ? '#header > .container'
        : 'header#top'
    }
  
    isSearchPage () {
      return isCurrentPage('taniaksiazka.pl/Szukaj/q-')
    }
  
    searchText () {
      return qs('div.text.search-results.text-with-border > strong')?.textContent
    }
  
    searchedElementUrl (searchText) {
      return qs(`a[data-model="${searchText}"]`)?.href
    }
  
    featuresPermissions () {
      return {
        accepted: [],
        forbidden: []
      }
    }
  }
  
  class CMController extends Controller {
    mainContainerSelectors () {
      return ['header#top', 'header > div.container.clearfix']
    }
  
    featuresPermissions () {
      return {
        accepted: [],
        forbidden: []
      }
    }
  }
  
  class CBAController extends Controller {
    productModel () {
      return qs('input[name="products_model"]')?.value.trim()
    }
  
    mainContainerSelectors () {
      return 'body > center > table'
    }
  
    featuresPermissions () {
      return {
        accepted: [],
        forbidden: ['mobileBtn', 'reCacheBtn', 'productListBox']
      }
    }
  }
  
  class AllegroController extends Controller {
    mainContainerSelectors () {
      return 'div[data-role="header-primary-bar"]'
    }
  
    productModel () {
      let boxes = qsa(
        '[data-box-name="Parameters"] div[data-role="app-container"] ul li div div ul li'
      )
  
      for (let box of boxes) {
        let matches = box.innerText.match(/kod\s*producenta\:?\s*(\d+)/i)
        if (matches) return matches[1]
      }
      let description = qs('[data-box-name="Container Description"]')
      if (!description) return null
  
      let ean = description.innerText.match(/(?=ean)?(?=[\s\:\-]*)(\d{13,18})/i)
      if (ean && ean.length > 1) return ean[1]
  
      return null
    }
  
    featuresPermissions () {
      let permissions = super.featuresPermissions()
      permissions.forbidden.push('productListBox')
      return permissions
    }
  }
  
  class BEEController extends Controller {
    getLists () {
      return [new BEEStandardList(), new BEESliderList()]
    }
  
    mainContainerSelectors () {
      if (sessionStorage.tomczukMobileMode === 'true') return '#header .container'
      return '#header .container'
    }
  
    isSearchPage () {
      return isCurrentPage('bee.pl/Szukaj/q-')
    }
  
    searchText () {
      return window.location.href.match(/Szukaj\/q\-([^\?]*)/i)[1] ?? null
    }
  
    searchedElementUrl (searchText) {
      return qs(`a[data-model="${searchText}"]`)?.href
    }
  
    featuresPermissions () {
      return {
        accepted: [],
        forbidden: []
      }
    }
  }
  
  class FantastyczneSwiatyController extends Controller {
    mainContainerSelectors () {
      return ['.page div.header.container', '#header > div.container.clearfix']
    }
  
    productModel () {
      return document.body.innerText?.match(/Model:\s+([\d\w@_]{3,30})/)?.[1]
    }
  
    featuresPermissions () {
      return {
        accepted: [],
        forbidden: []
      }
    }
  }
  
  class BonitoController extends Controller {
    mainContainerSelectors () {
      return 'body > div.container'
    }
  
    productModel () {
      return qs('meta[itemprop="gtin"]')
        ?.getAttribute('content')
        .match(/\d{13,16}/)?.[0]
    }
  }
  
  class NoweBonitoController extends Controller {
    mainContainerSelectors () {
      return 'body > div.container'
    }
  
    productModel () {
      return qs('meta[property="og:upc"]')?.getAttribute('content')
    }
  }
  
  class LubimyCzytacController extends Controller {
    mainContainerSelectors () {
      return 'body > div.content > header > .container'
    }
  
    productModel () {
      return qs('meta[property="books:isbn"]')?.getAttribute('content')
    }
  }
  
  class WKController extends Controller {
    mainContainerSelectors () {
      return '.blog-header > div.container'
    }
  
    productModel () {
      return qsa('table.shop_attributes > tbody > tr > td')
        ?.map(el => el.innerText.replaceAll('-', '').trim())
        .find(el => el.match(/^\d{13,}$/))
    }
  }
  
  class GandalfController extends Controller {
    mainContainerSelectors () {
      return '.top-menu > .container:not(.infoheader)'
    }
  
    productModel () {
      let details = qs('#product-details.details-list')
      if (!details) return
      let elem = details.qsa('tr').filter(tr => {
        return tr.textContent.match(/ISBN:?\s*(\d{13,16})/i)
      })
      return elem[0]?.textContent.match(/\d+/)?.[0]
    }
  }
  
  class SwiatKsiazkiController extends Controller {
    mainContainerSelectors () {
      return '.header.content'
    }
  
    productModel () {
      return qs('meta[itemprop="gtin13"]')?.getAttribute('content')
    }
  }
  
  class TantisController extends Controller {
    mainContainerSelectors () {
      return '.header-main'
    }
  
    productModel (dom = null) {
      if (!dom) dom = document
      let json = dom.head.qs('script[type="application/ld+json"]')?.textContent
      json = json ? JSON.parse(json) : null
      if (
        !json ||
        !json.hasOwnProperty('@graph') ||
        !Array.isArray(json['@graph'])
      )
        return null
      json = json['@graph'].pop()
      return json['@id'] ?? null
    }
  }
  
  class CzytamController extends Controller {
    mainContainerSelectors () {
      return 'body > header > div.container:first-child'
    }
  
    productModel () {
      return (
        qs('#schemaimage')
          ?.getAttribute('content')
          ?.match(/\d{13,18}/)[0] ?? null
      )
    }
  }
  
  class MatrasController extends Controller {
    mainContainerSelectors () {
      return 'header.mainHeader'
    }
  
    productModel () {
      return (
        qs('div.content div.colsInfo')
          ?.innerText.replaceAll('-', '')
          .match(/[^\d](\d{13})[^\d]?/)[1] ?? null
      )
    }
  }
  
  class BasicController extends Controller {}
  
  /** @DONE ?
   *
   */
  class Storage {
    /** @DONE
     *
     */
    constructor () {
      test(this)
      if (window.localStorage) {
        test('Ustawiam localStorage')
        this.type = 'localStorage'
      } else if (window.sessionStorage) {
        test('Ustawiam sessionStorage')
        this.type = 'sessionStorage'
      } else {
        test('Nie mogę ustawić storage', 1)
        this.type = null
        this.storage = null
      }
  
      if (this.type && !window[this.type].getItem('tomczukToolKit')) {
        window[this.type].setItem('tomczukToolKit', '')
        test('Tworzę nowy klucz "tomczukToolKit" dla ' + this.type)
      }
    }
  
    /** @DONE
     * @returns {string}
     */
    str () {
      if (!this.type) return undefined
      return window[this.type].getItem('tomczukToolKit') ?? ''
    }
  
    /** @DONE
     * @param {string} key
     * @param {string} value
     */
    set (key, value) {
      if (!this.type) return false
      let keyVal = `${key}=${value}`
      if (this.str().length === 0) {
        window[this.type].setItem('tomczukToolKit', keyVal)
        return
      }
      let match = this.str().match(new RegExp(`(.*)(${key}=[^=&]+)(.*)`, 'i'))
      if (!match) {
        window[this.type].setItem(
          'tomczukToolKit',
          window[this.type].getItem('tomczukToolKit') + `&${keyVal}`
        )
      } else {
        match.shift()
        match[1] = keyVal
        window[this.type].setItem('tomczukToolKit', match.join(''))
      }
    }
  
    /** @DONE
     *
     * @param {string} key
     * @returns {string|boolean|null}
     */
    get (key) {
      if (!this.type) return false
      let match = this.str()?.match(new RegExp(`(?:${key}\=)([^=&]+)`, 'i'))
      if (match) match = match[1]
      if (match === null) return null
      if (match === 'true') return true
      if (match === 'false') return false
      if (/^\d+$/.test(match)) return parseInt(match)
      if (/^\d+\.\d+$/.test(match)) return parseFloat(match)
      return match
    }
  }
  
  class ListBundle {
    constructor (listTypes = []) {
      test(this)
      this.listTypes = listTypes
      test('Przypisuję typy list:', 0, listTypes)
      this.loaded = false
      test('ListBundle.loaded = false')
    }
  
    addList (listType) {
      if (Array.isArray(listType)) {
        this.listTypes = [...this.listTypes, ...listType]
      } else {
        this.listTypes.push(listType)
      }
      test('Dodaję kolejne listy do BundleList', 0, this.listTypes)
    }
  
    loadLists () {
      if (this.loaded) return
      this.listTypes.forEach(listType => listType.load())
      this.loaded = true
    }
  
    loadProductsFromReport () {
      this.listTypes.forEach(listType => listType.loadProductsFromReport())
    }
  
    sortByProfit () {
      this.listTypes.forEach(listType => listType.sortByProfit())
    }
  
    adjustAll () {
      this.listTypes.forEach(listType => listType.adjust())
    }
  
    unadjustAll () {
      this.listTypes.forEach(listType => listType.unadjust())
    }
  
    buildAll () {
      this.listTypes.forEach(listType => listType.build())
    }
  
    unbuildAll () {
      this.listTypes.forEach(listType => listType.unbuild())
    }
  }
  
  class ListType {
    constructor () {
      test(this)
      this.lists = []
    }
    /**
     *
     * @returns {array} containers
     */
    getContainers () {
      return []
    }
  
    /** @OVERRIDE
     * @param {HTMLElement} container
     * @returns {array} boxes
     */
    getBoxes (container) {
      return []
    }
  
    adjust () {
      this.lists.forEach(list => list.adjust())
    }
  
    unadjust () {
      this.lists.forEach(list => list.unadjust())
    }
  
    build () {
      this.lists.forEach(list => list.build())
    }
  
    unbuild () {
      this.lists.forEach(list => list.unbuild())
    }
  
    load () {
      let containers = this.getContainers()
      for (let container of containers) {
        let list = new List(this, container)
        list.load()
        this.lists.push(list)
      }
    }
  
    loadProductsFromReport () {
      this.lists.forEach(list => list.loadProductsFromReport())
    }
  
    sortByProfit () {
      this.lists.forEach(list => list.sortByProfit())
    }
  
    insertFunctions (box) {
      ;[
        this.getModel,
        this.adjustBox,
        this.unadjustBox,
        this.buildBox,
        this.unbuildBox
      ].forEach(func => (box[func.name] = func))
    }
  
    getModel () {
      this.model = this.element?.qs('[data-model]')?.dataset.model.trim()
      return this.model
    }
  
    adjustBox () {
      this.element.classList.add('tomczuk-box-adjusted')
    }
  
    unadjustBox () {
      this.element.classList.remove('tomczuk-box-adjusted')
    }
  
    /** @OVERRIDE IF NEEDED. */
    adjustContainer (container) {}
    /** @OVERRIDE IF NEEDED. */
    unadjustContainer (container) {}
  
    /**
     * this keyword odnosi sie tu do:
     * @see Box
     */
    buildBox () {
      if (this.salesBox) return
  
      let data = this.product?.reportData?.data
  
      this.salesBox = html('div', {
        classes: 'tomczuk-list-sales-box'
      })
      this.element.prepend(this.salesBox)
      this.element.classList.add('tomczuk-list-built')
  
      this.salesBox.append(selfCopyInput({ value: this.product.model }))
      this.salesBox.append(
        html('a', {
          textContent: 'Idź do CBA',
          href: this.product.cbaUrl ?? '',
          classes: 'tomczuk-go-to-cba'
        })
      )
      if (
        data &&
        !this.product.isElectronic() &&
        !this.product.isPreview() &&
        !this.product.isOutlet()
      ) {
        switch (true) {
          case data.stockForDays <= 3 &&
            data.demandForOneDay * 14 >= USER_CFG.min_zapotrz_na_14_dni:
            this.element.classList.add('tomczuk-supply-low')
            break
          case data.stockForDays <= 6 &&
            data.demandForOneDay * 14 >= USER_CFG.min_zapotrz_na_14_dni:
            this.element.classList.add('tomczuk-supply-medium')
            break
          case data.stockForDays >= USER_CFG.na_ile_dni_wyliczac_zaporzebowanie &&
            data.demandForXDays < -USER_CFG.min_il_do_zwrotu &&
            data.dailySaleQty < 4:
            this.element.classList.add('tomczuk-supply-overload')
            break
          default:
            this.element.classList.add('tomczuk-supply-high')
            break
        }
      }
  
      const table = new Table()
  
      table.row('Sprz. dzienna', data?.dailySaleQty ?? '-')
  
      table.row('Stan MAG', data?.magQty ?? '-')
  
      table.row(
        'Śr cena sprz.',
        data?.averageSoldPrice == '-'
          ? '-'
          : data?.averageSoldPrice?.toFixed(2).replace('.', ',') + 'zł'
      )
  
      table.row(
        `Zapotrz ${USER_CFG.na_ile_dni_wyliczac_zaporzebowanie} dni`,
        data?.demandForXDays ?? '-'
      )
  
      table.row('Zapas na dni', data?.stockForDays ?? '-')
      this.salesBox.append(table.table)
      if (!data.wholesale) return
      const wholesale = new WholesaleEl()
      for (let supplier in data.wholesale) {
        wholesale.add(
          supplier,
          data.wholesale[supplier].cost,
          data.wholesale[supplier].qty
        )
      }
      wholesale.createTable()
      this.product.profit =
        wholesale.cheapest != 9999
          ? data.averageSoldPrice - wholesale.cheapest
          : 0
      if (isNaN(this.product.profit)) this.product.profit = 0
  
      if (
        wholesale.totalQty > 0 &&
        data.demandForXDays >= USER_CFG.min_zapotrz_na_14_dni &&
        wholesale.totalQty <
          data.demandForXDays * USER_CFG.mnoznik_zapotrz_a_dost &&
        this.product.profit >= USER_CFG.min_zysk_w_zl
      ) {
        this.element.classList.add('tomczuk-supply-availab-danger')
      }
      table.row('Zysk', this.product.profit.toFixed(2).replace('.', ',') + 'zł')
      if (this.product.profit < 0) {
        this.element.classList.remove('tomczuk-supply-low')
        this.element.classList.remove('tomczuk-supply-medium')
        this.element.classList.remove('tomczuk-supply-availab-danger')
        this.element.classList.add('tomczuk-supply-check')
      }
      this.salesBox.append(wholesale.btn)
      log(this.product)
    }
  
    unbuildBox () {
      if (this.salesBox) {
        this.salesBox.remove()
        this.salesBox = null
        ;[...this.element.classList].forEach(className => {
          if (/tomczuk/.test(className)) {
            this.element.classList.remove(className)
          }
        })
      }
    }
  
    getTitle (box) {
      return box.qs('[data-name]')?.dataset.name
    }
  
    getPrice (box) {
      return box.qs('.updateable > .product-price')?.textContent.trim()
    }
  
    getRetail (box) {
      return box.qs('.product-price + del')?.textContent.trim()
    }
  
    getAuthors (box) {
      return box.qs('.product-authors')?.textContent.trim()
    }
  
    getCategory (box) {
      return box.qs('[data-category]')?.dataset.category
    }
  
    getRealShopUrl (box) {
      return box.qs('a.ecommerce-datalayer[data-price][href]')?.href
    }
  
    getType (box) {
      return box
        .qs('.product-main-top-params > .produkt-listing.typename')
        ?.textContent.trim()
    }
  }
  
  class List {
    constructor (listType, container = null) {
      test(this)
      this.container = container
      this.listType = listType
      this.elements = new Map()
    }
  
    /**
     * @param {HTMLElement} container
     */
    addContainer (container) {
      this.container = container
    }
  
    load () {
      let boxes = this.listType.getBoxes(this.container)
      for (let box of boxes) {
        this.addBox(new Box(this.listType, box))
      }
    }
  
    loadProductsFromReport () {
      this.elements.forEach(boxes => {
        boxes.forEach(box => box.loadProductFromReport())
      })
    }
  
    sortByProfit () {
      this.container.innerHTML = ''
      let arr = []
      this.elements.forEach(elArr => {
        elArr.forEach(el => arr.push(el))
      })
      let sorted = arr.sort((a, b) => {
        if (!b.product.reportData.data.demandForXDays)
          b.product.reportData.data.demandForXDays = 0
        if (!a.product.reportData.data.demandForXDays)
          a.product.reportData.data.demandForXDays = 0
        return (
          b.product.reportData.data.demandForXDays -
          a.product.reportData.data.demandForXDays
        )
      })
      sorted.forEach(el => this.container.append(el.element))
    }
  
    addBox (box) {
      let model = box.getModel()
      if (!model) return
      this.elements.add(model, box)
      app.ctrl.allBoxes.add(model, box)
      app.ctrl.allModels.push(model)
    }
  
    adjust () {
      this.elements.forEach(elArr => {
        elArr.forEach(box => box.adjustBox())
      })
  
      this.adjustContainer()
    }
  
    adjustContainer () {
      this.listType.adjustContainer(this.container)
    }
  
    unadjust () {
      this.elements.forEach(elArr => {
        elArr.forEach(box => box.unadjustBox())
      })
      this.unadjustContainer()
    }
  
    unadjustContainer () {
      this.listType.unadjustContainer(this.container)
    }
  
    build () {
      this.elements.forEach(elArr => {
        elArr.forEach(box => box.buildBox())
      })
    }
  
    unbuild () {
      this.elements.forEach(elArr => {
        elArr.forEach(box => box?.unbuildBox(box))
      })
    }
  }
  
  class TKStandardList extends ListType {
    getContainers () {
      return qsa('.book-list.xs-hidden ul.toggle-view.grid')
    }
  
    getBoxes (container) {
      return container.qsa('.product-container').map(el => el.closest('li'))
    }
  
    getAvailab (box) {
      let avail = box.qs('.product-available')?.textContent.trim()
      if (!avail) avail = box.qs('.product-announce')?.textContent.trim()
      return avail
    }
  }
  
  class TKProductPageList extends TKStandardList {
    getContainers () {
      return qsa('.book-list.xs-hidden .list-container.grid-desc.clearfix')
    }
  
    getBoxes (container) {
      return container.qsa('.grid-desc-item')
    }
  
    getRetail (box) {
      return box.qs('.grid-desc-price > strong + del')?.textContent.trim()
    }
  }
  
  class TKSliderList extends TKStandardList {
    getContainers () {
      return qsa('.slider-grid.xs-hidden ul.toggle-view')
    }
  
    getBoxes (container) {
      let boxes = container.qsa('ul.clearfix > li')
      return boxes
    }
  
    adjustContainer (container) {
      container
        .closest('.slider-grid.xs-hidden')
        .qs('[id^=slider_]')
        .classList.add('tomczuk-height-auto')
      container
        .closest('.slider-grid.xs-hidden')
        .qs('.slider-next-prev')
        .classList.add('tomczuk-tk-slider-btns')
    }
    unadjustContainer (container) {
      container
        .closest('.slider-grid.xs-hidden')
        .qs('[id^=slider_]')
        .classList.remove('tomczuk-height-auto')
      container
        .closest('.slider-grid.xs-hidden')
        .qs('.slider-next-prev')
        .classList.remove('tomczuk-tk-slider-btns')
    }
  }
  
  class TKBestsellersList extends TKStandardList {
    getContainers () {
      return qsa('ul#pagi-slide')
    }
  
    getBoxes (container) {
      return container.qsa('li')
    }
  }
  
  class TKPromoList extends TKStandardList {
    getContainers () {
      return qsa('.book-list .list-container ul.list')
    }
  
    getBoxes (container) {
      return container.qsa('li')
    }
  
    adjustBox () {
      super.adjustBox()
      this.element.classList.add('tomczuk-tk-promo-list')
    }
  
    unadjustBox () {
      super.unadjustBox()
      this.element.classList.remove('tomczuk-tk-promo-list')
    }
  }
  
  class BEEStandardList extends ListType {
    getContainers () {
      return qsa('.product_list.row')
    }
  
    getBoxes (container) {
      return container.qsa('.product-container').map(el => el.parentElement)
    }
  }
  
  class BEESliderList extends ListType {
    getContainers () {
      return qsa('.slider')
    }
  
    getBoxes (container) {
      return container.qsa('.li.slider-item').map(el => el.parentElement)
    }
  }
  
  class Box {
    /**
     * @param {HTMLElement} element
     */
    constructor (listType, element) {
      this.element = element
      this.listType = listType
      listType.insertFunctions(this)
      this.getModel?.()
      this.product = new Product(this.model, element, listType)
    }
  
    loadProductFromReport () {
      this.product.loadFromReport()
    }
  }
  
  class Product {
    authors = []
  
    constructor (model = null, box = null, listType = null) {
      model && this.setModel(model)
      if (box) {
        this.box = box
        this.shopData = new ShopProductData(box, listType)
      }
      if (model) this.reportData = new ReportProductData(model)
      this.setPrice(this.shopData.rawData.price)
      this.setRetail(this.shopData.rawData.retail)
      this.countDiscount()
    }
  
    loadFromReport () {
      this.reportData.loadSales()
      this.reportData.loadWholesaleAvailab()
      this.reportData.prepare()
    }
  
    setModel (model) {
      this.model = model.trim()
      this.setUrls()
    }
  
    setRetail (retail) {
      this.retail = priceToFloat(retail)
    }
  
    setPrice (price) {
      this.price = priceToFloat(price)
    }
  
    setTitle (title) {
      this.title = title.trim()
    }
  
    setShopUrl (url) {
      this.shopUrl = url.trim()
    }
  
    setAuthors (authors) {
      if (typeof authors === 'string') this.authors.push(authors.trim())
      else this.authors = authors.map(a => a.trim())
    }
  
    setPublisher (publisher) {
      this.publisher = publisher.trim()
    }
  
    setShippingTime (shippingTime) {
      this.shippingTime = shippingTime
    }
  
    setUrls () {
      this.cbaUrl = `https://cba.kierus.com.pl/?p=EditProduct&load=*${this.model}`
      this.tkUrl = `https://www.taniaksiazka.pl/Szukaj/q-m:${this.model}`
    }
  
    countDiscount () {
      if (!this.retail || !this.price || this.price >= this.retail) {
        this.discount = '-'
        return
      }
  
      this.discount = ((1 - this.price / this.retail) * 100).toFixed(0) + '%'
    }
  
    isElectronic () {
      if (!this.model) return false
      return /^@/.test(this.model)
    }
  
    isPreview () {
      if (this.shopData?.rawData?.availab) {
        return /^dostępny za/i.test(this.shopData.rawData.availab)
      }
    }
  
    isOutlet () {
      if (!this.model) return false
      return /^\d{13}33$/.test(this.model)
    }
  }
  
  class ShopProductData {
    constructor (box, listType) {
      this.box = box
      this.listType = listType
      this.rawData = {}
      this.loadData()
    }
  
    loadData () {
      let obj = this.listType
      let box = this.box
      let data = this.rawData
  
      data.price = obj.getPrice(box)
      data.retail = obj.getRetail(box)
      data.title = obj.getTitle(box)
      data.authors = obj.getAuthors(box)
      data.realShopUrl = obj.getRealShopUrl(box)
      if (obj.getAvailab) data.availab = obj.getAvailab(box)
      data.type = obj.getType(box)
    }
  }
  
  class ReportProductData {
    constructor (model) {
      this.model = model
      this.rawData = {}
      this.data = {}
      this.wholesaleAvailab = null
    }
  
    loadSales () {
      if (!app.ctrl.cfg.salesReportForXDays) {
        log('brak raportu sprzedaży z dwóch dni', 1)
        return
      }
      this.rawData = app.ctrl.cfg.salesReportForXDays?.[this.model] ?? {}
    }
  
    loadWholesaleAvailab () {
      if (!app.ctrl.cfg.wholesaleBundleReport) {
        log('brak raportu dostępności w hurtowniach', 1)
        return
      }
      this.rawData.wholesale = app.ctrl.cfg.wholesaleBundleReport?.[this.model]
    }
  
    prepare () {
      this.data.title = this.rawData.tytul
      this.data.magQty = this.rawData.onallmags
      this.data.soldQty = this.rawData.ilosc_zamowionych
      this.data.soldOrders = this.rawData.ilosc_unikalnych_zamowien
      this.data.averageSoldPrice =
        this.data.soldQty == 0
          ? '-'
          : priceToFloat(
              priceToFloat(this.rawData.wartosc_produktow) / this.data.soldQty
            )
      this.data.dailySaleQty = parseFloat(
        (
          this.rawData.ilosc_zamowionych / app.ctrl.cfg.daysForSalesBundleReport
        ).toFixed(1)
      )
  
      this.data.stockForDays =
        this.data.dailySaleQty == 0
          ? '-'
          : parseInt(this.data.magQty / this.data.dailySaleQty)
  
      this.data.demandForXDays = toTens(
        this.data.dailySaleQty * USER_CFG.na_ile_dni_wyliczac_zaporzebowanie -
          this.data.magQty
      )
  
      this.data.demandForOneDay =
        this?.data?.demandForXDays / USER_CFG.na_ile_dni_wyliczac_zaporzebowanie
  
      if (this.rawData.wholesale) {
        this.data.wholesale = {}
        for (let property in this.rawData.wholesale) {
          let matches = property.match(/(\w+)_(qty|cost)/)
          if (!matches) continue
          if (!this.data.wholesale[matches[1]]) {
            this.data.wholesale[matches[1]] = {}
          }
          this.data.wholesale[matches[1]][matches[2]] = this.rawData.wholesale[
            property
          ]
        }
      }
    }
  }
  
  class Table {
    constructor () {
      this.table = html('table', { classes: 'tomczuk-sales-box-table' })
    }
  
    row (name, val) {
      const tr = html('tr')
      const tdName = html('td', { textContent: name })
      const tdVal = html('td', { textContent: val })
      tr.append(tdName, tdVal)
      this.table.append(tr)
    }
  }
  
  class WholesaleEl {
    data = []
    totalQty = 0
    cheapest = 9999
  
    constructor () {
      this.btn = html('button', {
        innerHTML: 'DOSTAWCY (0)',
        classes: 'tomczuk-wholesale-btn'
      })
      this.btn.disabled = true
      this.box = html('div', { classes: 'tomczuk-wholesale-box' })
    }
  
    add (supplier, price, qty) {
      qty = String(qty)
      if (qty == '') return
      if (/^(?:[1-9]|[1-9]\d*)$/.test(qty)) qty = parseInt(qty)
      if (supplier.match(/zapas|polautomat/i)) return
      price = parseFloat(price)
      if (Number.isInteger(qty)) this.totalQty += qty
      supplier = supplier.replaceAll('_', ' ').toUpperCase()
      this.data.push({ supplier, price, qty })
    }
  
    createTable () {
      if (this.data.length == 0) return null
      this.data = this.data.sort((a, b) => a.price - b.price)
      this.cheapest = this.data[0]?.price
      this.btn.disabled = false
      this.setUpListeners()
  
      this.btn.innerHTML = this.btn.innerHTML.replace(
        /\(\d+\)/,
        `(${this.totalQty})`
      )
      this.table = html('table')
      let header = html('tr')
      header.append(html('th', { textContent: 'dostawca' }))
      header.append(html('th', { textContent: 'brutto' }))
      header.append(html('th', { textContent: 'ile' }))
      this.table.append(header)
      for (let row of this.data) {
        let tr = html('tr')
        this.table.append(tr)
        tr.append(html('td', { textContent: row.supplier }))
        tr.append(html('td', { textContent: row.price }))
        tr.append(html('td', { textContent: row.qty }))
      }
      this.box.append(this.table)
      this.btn.after(this.box)
    }
  
    setUpListeners () {
      const box = this.box
      const btn = this.btn
      btn.innerHTML += ' &#128317;' // w dół
      btn.addEventListener('click', () => {
        box.classList.toggle('tomczuk-wholesale-visible')
  
        if (box.classList.contains('tomczuk-wholesale-visible')) {
          btn.after(box)
          btn.innerHTML = `DOSTAWCY (${this.totalQty}) &#128316;`
        } else {
          box.remove()
          btn.innerHTML = `DOSTAWCY (${this.totalQty}) &#128317;`
        }
      })
    }
  }
  
  function toPrice (price) {
    if (typeof price === 'number') price = price.toString()
    let stripped = price.match(/\d+(?:[.,]{1}\d{1,2})?/)?.[0].replace(',', '.')
    return (
      parseFloat(stripped)
        .toFixed(2)
        .replace('.', ',') + 'zł'
    )
  }
  
  function toTens (num) {
    if (isNaN(num)) {
      test('Musisz podać liczbę dla funkcji toTens()', 1)
    }
    return Math.ceil(num / 10) * 10
  }
  
  function priceToFloat (price) {
    price = String(price)
      ?.match(/(?:0|[1-9]\d*)[ \t]*([,.][ \t]*\d{1,2})?/)?.[0]
      .replace(',', '.')
      .replace(/\s*/, '')
    return parseFloat(price) ?? false
  }
  
  /** @DEPRECATED?
   *
   * @param {*} string
   * @returns
   */
  function pl2url (string) {
    let utf = {
      Ą: '%A1',
      Ć: '%C6',
      Ę: '%CA',
      Ł: '%A3',
      Ń: '%D1',
      Ó: '%D3',
      Ś: '%A6',
      Ź: '%AC',
      Ż: '%AF',
      ą: '%B1',
      ć: '%E6',
      ę: '%EA',
      ł: '%B3',
      ń: '%F1',
      ó: '%F3',
      ś: '%B6',
      ź: '%BC',
      ż: '%BF',
      ' ': '%20' // ? zostawić ?
    }
    string = string.trim()
    let result = ''
  
    let strlen = string.length
    for (i = 0; i < strlen; i++) {
      const letter = string[i]
      if (utf.hasOwnProperty(letter)) result += utf[letter]
      else result += letter
    }
    return result
  }
  
  function isCurrentPage (page) {
    page = page.replaceAll('.', '.').replaceAll('/', '/')
    return Boolean(window.location.href.match(new RegExp(page, 'ig')))
  }
  
  /** @THINK - może pomyśleć o stylach w konsoli?
   * @param {string} message
   * @param {number} type 0/1
   */
  function log (message, type = 0) {
    if (type === 1) console.error(message)
    if (type === 0) console.debug(message)
  }
  
  function isTK () {
    return isCurrentPage('taniaksiazka.pl')
  }
  
  function isCBA () {
    return isCurrentPage('cba.kierus.com.pl')
  }
  
  function isBEE () {
    return isCurrentPage('bee.pl')
  }
  
  function isDev () {
    return qs('meta[env="dev"]')?.getAttribute('env') == 'dev'
  }
  
  function arrivingBasketsUrl (model) {
    return `https://cba.kierus.com.pl/?p=SupplierBasket&a=Filter&sp=0&stm=&stl=&edtm=&edtl=&dtm=&dtl=&SbkStatus=unreceived&SbkOrderBy=Id&SbkViewBy=DESC&opiekun=&product_filter=${model}&doc_filter=&Magazine=-1&DocumentFilter=0`
  }
  
  /** @DONE
   * @param {number} value
   * @returns {string}
   */
  function px (value) {
    return value + 'px'
  }
  
  /** @DONE
   * @param {string} value
   * @returns {number}
   */
  function noPx (value) {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      let regexed = value.match(/(\d+\.?\d*)px/i)[1] ?? null
      if (!regexed) throw new Error('Błędny argument dla funkcji noPx')
      return regexed.match(/\./) ? parseFloat(regexed) : parseInt(regexed)
    }
  }
  
  /** @CHECK @DONE?
   *
   * @param {boolean} strong if true podaj drugi parametr
   * @param {string} exceptions lista wyjatkow...
   * @returns
   */
  function userSelection (strong = false, exceptions = '') {
    let result = ''
    if (exceptions) exceptions = exceptions.split('').join('\\')
  
    let active = document.activeElement
    if (active.localName == 'input' || active.localName == 'textarea') {
      let start = active.selectionStart
      let end = active.selectionEnd
      if (start != end) result = active.value.substr(start, end - start)
    } else result = window.getSelection().toString()
  
    if (strong)
      result = result.replace(
        new RegExp('[^a-z0-9ęóąśłżźćń' + exceptions + ']', 'ig'),
        ' '
      )
  
    return result.replace(/\s{2,}/gi, ' ').trim()
  }
  
  /** @CHECK @THINK @DONE?
   * @param {string} tagName
   * @param {object} attributes
   * @returns {HTMLElement}
   */
  function html (tagName, attributes = {}) {
    const el = document.createElement(tagName)
  
    for (const [key, value] of Object.entries(attributes)) {
      if (key !== 'classes') el[key] = value
      else {
        let classes = value.split(' ')
        if (!classes.length) continue
  
        if (classes.indexOf('tomczuk') > 0)
          classes.splice(classes.indexOf('tomczuk'), 1)
  
        classes.unshift('tomczuk')
        classes = classes.filter(cls => cls.length > 0)
        for (let className of classes) el.classList.add(className)
      }
    }
    if (!el.classList.contains('tomczuk')) el.classList.add('tomczuk')
    return el
  }
  
  function box (title) {
    const box = html('div', { classes: 'tomczuk-box' })
    const titleDiv = html('div', { classes: 'tomczuk-box-title' })
    titleDiv.append(
      html('div', { classes: 'tomczuk-box-title-arrow', innerHTML: '&#9660;' })
    )
    titleDiv.append(
      html('div', { classes: 'tomczuk-box-title-text', textContent: title })
    )
  
    const container = html('div', { classes: 'tomczuk-box-container' })
    const arrow = titleDiv.qs('.tomczuk-box-title-arrow')
    box.container = container
    box.append(titleDiv, container)
  
    let minimizeOptName = title.toLowerCase() + 'BoxMinimized'
    if (app.storage.get(minimizeOptName) == true) {
      titleDiv.classList.add('minimized')
      container.classList.add('tomczuk-minimized-box')
      arrow.classList.add('arrow-minimized')
    }
  
    titleDiv.addEventListener('click', e => {
      e.stopPropagation()
      arrow.classList.toggle('arrow-minimized')
      titleDiv.classList.toggle('minimized')
      const container = titleDiv.nextElementSibling
      container.classList.toggle('tomczuk-minimized-box')
  
      if (titleDiv.classList.contains('minimized'))
        app.storage.set(minimizeOptName, 'true')
      else app.storage.set(minimizeOptName, 'false')
    })
    return box
  }
  
  function btn ({ value, url }) {
    let attributes = {}
    if (value) attributes.textContent = value
    attributes.classes = 'tomczuk-btn'
    if (url) attributes.href = url
    return html('a', attributes)
  }
  
  function selfCopyInput ({ value, classes = '', id = null }) {
    classes = classes ? classes + ' tomczuk-self-input' : 'tomczuk-self-input'
    const input = html('input', { value, classes, id })
    input.title = 'Kopiuj do schowka'
    input.addEventListener('click', () => {
      navigator.clipboard.writeText(value).then(() => {
        const delayClassName = 'tomczuk-self-input-copying'
        input.value = 'KOPIUJĘ...'
        input.disabled = true
        input.classList.add(delayClassName)
  
        setTimeout(() => {
          input.value = value
          input.select()
          input.disabled = false
          input.classList.remove(delayClassName)
        }, 500)
      })
    })
  
    return input
  }
  
  async function getRawReport (url, additionalOptions = null) {
    let dom = await fetchPageDOM(url, additionalOptions)
    return {
      labels: dom?.querySelector('textarea#LabelsNames')?.value,
      report: dom?.querySelector('textarea#SqlReport')?.value
    }
  }
  
  async function getReport (url, additionalOptions = null) {
    let { labels, report } = await getRawReport(url, additionalOptions)
    if (!labels || !report) return null
    labels = labels.split('\t').map(label => label.toLowerCase().trim())
    let result = []
    report.split('\n').forEach(row => {
      let obj = {}
      row.split('\t').forEach((value, i) => {
        if (/^\d{1,7}$/.test(value)) value = parseInt(value)
        else if (/^\d+\.\d+$/.test(value)) value = parseFloat(value).toFixed(2)
        obj[labels[i]] = value
      })
      result.push(obj)
    })
    return result ?? null
  }
  
  function prepareReport (report) {
    let obj = {}
    for (let row of report ?? []) {
      obj[row.model] = row
    }
    return obj
  }
  
  async function getSalesBundleReport (models, duration = 14, delay = 0) {
    let [startDate, endDate] = prepareDates(duration, delay)
    let reqBody = new FormData()
    reqBody.append('lista_produktow', models.join('\r\n'))
    reqBody.append('data_od', startDate)
    reqBody.append('data_do', endDate)
    reqBody.append('promo', '')
    reqBody.append('sklep', '-1')
    reqBody.append('source', '-1')
    reqBody.append('csv', '0')
    let url = `https://cba.kierus.com.pl/?p=ShowSqlReport&r=ilosc+zamowionych+produktow+i+unikalnych+zamowien`
  
    // @DEBUGGING, wywalić po przesiadce na VPN.
    if (!cbaMachine) {
      return [
        {
          tytul: 'Gliniany most',
          model: '9788310134387',
          ean: '9788310134387',
          ilosc_zamowionych: 169,
          ilosc_unikalnych_zamowien: 47,
          wartosc_produktow: '1096.75',
          wartosc_zamowien: '9236.81',
          ilosc_zamowionych_w_promocji: 168,
          wartosc_produktow_w_promocji: '1090.26',
          na_mag_i_zapas: 106,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 106
        },
        {
          tytul: 'Empuzjon',
          model: '9788308075777',
          ean: '9788308075777',
          ilosc_zamowionych: 121,
          ilosc_unikalnych_zamowien: 109,
          wartosc_produktow: '4453.52',
          wartosc_zamowien: '26462.78',
          ilosc_zamowionych_w_promocji: 112,
          wartosc_produktow_w_promocji: '4120.61',
          na_mag_i_zapas: 385,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 385
        },
        {
          tytul: 'Mądre bajki',
          model: '9788375173864',
          ean: '9788375173864',
          ilosc_zamowionych: 104,
          ilosc_unikalnych_zamowien: 47,
          wartosc_produktow: '1235.32',
          wartosc_zamowien: '12643.28',
          ilosc_zamowionych_w_promocji: 103,
          wartosc_produktow_w_promocji: '1224.17',
          na_mag_i_zapas: 125,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 125
        },
        {
          tytul: 'All Of Your Flaws. Przypomnij mi naszą przeszłość',
          model: '9788328392670',
          ean: '9788328392670',
          ilosc_zamowionych: 99,
          ilosc_unikalnych_zamowien: 97,
          wartosc_produktow: '2733.01',
          wartosc_zamowien: '10824.74',
          ilosc_zamowionych_w_promocji: 96,
          wartosc_produktow_w_promocji: '2639.04',
          na_mag_i_zapas: 286,
          w_koszykach_z_zapasu: 183,
          w_kolejce: 0,
          onallmags: 469
        },
        {
          tytul: 'Heartstopper. Tom 4',
          model: '9788382661156',
          ean: '9788382661156',
          ilosc_zamowionych: 92,
          ilosc_unikalnych_zamowien: 92,
          wartosc_produktow: '2519.04',
          wartosc_zamowien: '22536.89',
          ilosc_zamowionych_w_promocji: 88,
          wartosc_produktow_w_promocji: '2396.95',
          na_mag_i_zapas: 525,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 525
        },
        {
          tytul: 'Tego lata stałam się piękna. Lato. Tom 1',
          model: '9788367247061',
          ean: '9788367247061',
          ilosc_zamowionych: 81,
          ilosc_unikalnych_zamowien: 81,
          wartosc_produktow: '1975.84',
          wartosc_zamowien: '8967.09',
          ilosc_zamowionych_w_promocji: 79,
          wartosc_produktow_w_promocji: '1920.06',
          na_mag_i_zapas: 9,
          w_koszykach_z_zapasu: 143,
          w_kolejce: 1,
          onallmags: 153
        },
        {
          tytul: 'Dla mnie',
          model: '9788381414579',
          ean: '9788381414579',
          ilosc_zamowionych: 78,
          ilosc_unikalnych_zamowien: 78,
          wartosc_produktow: '1736.96',
          wartosc_zamowien: '5395.83',
          ilosc_zamowionych_w_promocji: 66,
          wartosc_produktow_w_promocji: '1449.08',
          na_mag_i_zapas: 0,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 0
        },
        {
          tytul: 'Heartstopper. Tom 3',
          model: '9788382660807',
          ean: '9788382660807',
          ilosc_zamowionych: 76,
          ilosc_unikalnych_zamowien: 76,
          wartosc_produktow: '2114.28',
          wartosc_zamowien: '16738.05',
          ilosc_zamowionych_w_promocji: 72,
          wartosc_produktow_w_promocji: '1993.46',
          na_mag_i_zapas: 113,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 113
        },
        {
          tytul: 'It Ends with Us',
          model: '9788381351065',
          ean: '9788381351065',
          ilosc_zamowionych: 71,
          ilosc_unikalnych_zamowien: 70,
          wartosc_produktow: '2080.18',
          wartosc_zamowien: '15540.19',
          ilosc_zamowionych_w_promocji: 69,
          wartosc_produktow_w_promocji: '2010.20',
          na_mag_i_zapas: 0,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 0
        },
        {
          tytul: 'Heartstopper. Tom 2',
          model: '9788382660678',
          ean: '9788382660678',
          ilosc_zamowionych: 68,
          ilosc_unikalnych_zamowien: 67,
          wartosc_produktow: '1709.39',
          wartosc_zamowien: '16062.46',
          ilosc_zamowionych_w_promocji: 65,
          wartosc_produktow_w_promocji: '1627.52',
          na_mag_i_zapas: 932,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 932
        },
        {
          tytul: 'Start a Fire. Runda druga',
          model: '9788328388901',
          ean: '9788328388901',
          ilosc_zamowionych: 67,
          ilosc_unikalnych_zamowien: 65,
          wartosc_produktow: '2052.13',
          wartosc_zamowien: '7372.56',
          ilosc_zamowionych_w_promocji: 59,
          wartosc_produktow_w_promocji: '1776.21',
          na_mag_i_zapas: 183,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 183
        },
        {
          tytul: 'Heartstopper. Tom 1',
          model: '9788382660074',
          ean: '9788382660074',
          ilosc_zamowionych: 67,
          ilosc_unikalnych_zamowien: 66,
          wartosc_produktow: '1658.19',
          wartosc_zamowien: '15549.96',
          ilosc_zamowionych_w_promocji: 64,
          wartosc_produktow_w_promocji: '1576.32',
          na_mag_i_zapas: 818,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 818
        },
        {
          tytul: 'Flaw(less). Opowiedz mi naszą historię',
          model: '9788328377431',
          ean: '9788328377431',
          ilosc_zamowionych: 64,
          ilosc_unikalnych_zamowien: 64,
          wartosc_produktow: '1553.31',
          wartosc_zamowien: '14977.56',
          ilosc_zamowionych_w_promocji: 64,
          wartosc_produktow_w_promocji: '1553.31',
          na_mag_i_zapas: 0,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 0
        },
        {
          tytul: 'Reminders of Him. Cząstka ciebie, którą znam',
          model: '9788381351973',
          ean: '9788381351973',
          ilosc_zamowionych: 62,
          ilosc_unikalnych_zamowien: 61,
          wartosc_produktow: '2087.98',
          wartosc_zamowien: '10604.23',
          ilosc_zamowionych_w_promocji: 61,
          wartosc_produktow_w_promocji: '2048.99',
          na_mag_i_zapas: 82,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 82
        },
        {
          tytul: 'Długa noc. Komisarz Jakub Mortka. Tom 6',
          model: '9788367262170',
          ean: '9788367262170',
          ilosc_zamowionych: 57,
          ilosc_unikalnych_zamowien: 56,
          wartosc_produktow: '1493.84',
          wartosc_zamowien: '9866.50',
          ilosc_zamowionych_w_promocji: 51,
          wartosc_produktow_w_promocji: '1327.10',
          na_mag_i_zapas: 156,
          w_koszykach_z_zapasu: 103,
          w_kolejce: 0,
          onallmags: 259
        },
        {
          tytul: 'Start a Fire. Runda pierwsza',
          model: '9788328380165',
          ean: '9788328380165',
          ilosc_zamowionych: 57,
          ilosc_unikalnych_zamowien: 57,
          wartosc_produktow: '1744.25',
          wartosc_zamowien: '6067.95',
          ilosc_zamowionych_w_promocji: 50,
          wartosc_produktow_w_promocji: '1505.28',
          na_mag_i_zapas: 96,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 96
        },
        {
          tytul: 'Czuła przewodniczka. Kobieca droga do siebie',
          model: '9788326836442',
          ean: '9788326836442',
          ilosc_zamowionych: 53,
          ilosc_unikalnych_zamowien: 46,
          wartosc_produktow: '1279.17',
          wartosc_zamowien: '12973.83',
          ilosc_zamowionych_w_promocji: 50,
          wartosc_produktow_w_promocji: '1198.20',
          na_mag_i_zapas: 25,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 25
        },
        {
          tytul: 'Żadanica. Lipowo. Tom 14',
          model: '9788382950748',
          ean: '9788382950748',
          ilosc_zamowionych: 53,
          ilosc_unikalnych_zamowien: 53,
          wartosc_produktow: '1498.80',
          wartosc_zamowien: '11508.62',
          ilosc_zamowionych_w_promocji: 50,
          wartosc_produktow_w_promocji: '1405.83',
          na_mag_i_zapas: 509,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 509
        },
        {
          tytul: 'Kiedy ciało mówi nie. Koszty ukrytego stresu',
          model: '9788381437325',
          ean: '9788381437325',
          ilosc_zamowionych: 52,
          ilosc_unikalnych_zamowien: 50,
          wartosc_produktow: '1631.55',
          wartosc_zamowien: '10175.82',
          ilosc_zamowionych_w_promocji: 50,
          wartosc_produktow_w_promocji: '1561.57',
          na_mag_i_zapas: 127,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 127
        },
        {
          tytul: '11 papierowych serc',
          model: '9788367247054',
          ean: '9788367247054',
          ilosc_zamowionych: 51,
          ilosc_unikalnych_zamowien: 51,
          wartosc_produktow: '1243.44',
          wartosc_zamowien: '14006.63',
          ilosc_zamowionych_w_promocji: 49,
          wartosc_produktow_w_promocji: '1195.46',
          na_mag_i_zapas: 192,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 192
        },
        {
          tytul: 'Gdzie śpiewają raki',
          model: '9788381392686',
          ean: '9788381392686',
          ilosc_zamowionych: 50,
          ilosc_unikalnych_zamowien: 50,
          wartosc_produktow: '1293.79',
          wartosc_zamowien: '8234.98',
          ilosc_zamowionych_w_promocji: 50,
          wartosc_produktow_w_promocji: '1293.79',
          na_mag_i_zapas: 0,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 0
        },
        {
          tytul: 'Obrazy z przeszłości',
          model: '9788381959865',
          ean: '9788381959865',
          ilosc_zamowionych: 50,
          ilosc_unikalnych_zamowien: 50,
          wartosc_produktow: '1365.60',
          wartosc_zamowien: '16731.87',
          ilosc_zamowionych_w_promocji: 44,
          wartosc_produktow_w_promocji: '1179.66',
          na_mag_i_zapas: 50,
          w_koszykach_z_zapasu: 118,
          w_kolejce: 0,
          onallmags: 168
        },
        {
          tytul: 'Royal',
          model: '9788381788762',
          ean: '9788381788762',
          ilosc_zamowionych: 47,
          ilosc_unikalnych_zamowien: 46,
          wartosc_produktow: '1156.96',
          wartosc_zamowien: '6463.26',
          ilosc_zamowionych_w_promocji: 47,
          wartosc_produktow_w_promocji: '1156.96',
          na_mag_i_zapas: 33,
          w_koszykach_z_zapasu: 19,
          w_kolejce: 0,
          onallmags: 52
        },
        {
          tytul: 'Gniewa',
          model: '9788396458292',
          ean: '9788396458292',
          ilosc_zamowionych: 47,
          ilosc_unikalnych_zamowien: 45,
          wartosc_produktow: '1433.07',
          wartosc_zamowien: '14466.08',
          ilosc_zamowionych_w_promocji: 44,
          wartosc_produktow_w_promocji: '1337.10',
          na_mag_i_zapas: 0,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 0
        },
        {
          tytul: 'Bogaty ojciec, biedny ojciec',
          model: '45109902295KS',
          ean: '9788392256144',
          ilosc_zamowionych: 43,
          ilosc_unikalnych_zamowien: 41,
          wartosc_produktow: '973.88',
          wartosc_zamowien: '6902.71',
          ilosc_zamowionych_w_promocji: 42,
          wartosc_produktow_w_promocji: '952.29',
          na_mag_i_zapas: 37,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 37
        },
        {
          tytul: 'Potęga podświadomości',
          model: '9788381395199',
          ean: '9788381395199',
          ilosc_zamowionych: 43,
          ilosc_unikalnych_zamowien: 41,
          wartosc_produktow: '893.54',
          wartosc_zamowien: '6110.76',
          ilosc_zamowionych_w_promocji: 43,
          wartosc_produktow_w_promocji: '893.54',
          na_mag_i_zapas: 44,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 44
        },
        {
          tytul: 'Czerwona ziemia',
          model: '9788328086333',
          ean: '9788328086333',
          ilosc_zamowionych: 41,
          ilosc_unikalnych_zamowien: 40,
          wartosc_produktow: '1514.46',
          wartosc_zamowien: '14623.45',
          ilosc_zamowionych_w_promocji: 41,
          wartosc_produktow_w_promocji: '1514.46',
          na_mag_i_zapas: 26,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 26
        },
        {
          tytul: 'Obiecałem ci gwiazdy',
          model: '9788396287823',
          ean: '9788396287823',
          ilosc_zamowionych: 38,
          ilosc_unikalnych_zamowien: 38,
          wartosc_produktow: '1009.62',
          wartosc_zamowien: '7308.77',
          ilosc_zamowionych_w_promocji: 38,
          wartosc_produktow_w_promocji: '1009.62',
          na_mag_i_zapas: 0,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 0
        },
        {
          tytul: 'Almond. Ten, który nie czuł ',
          model: '9788366967434',
          ean: '9788366967434',
          ilosc_zamowionych: 32,
          ilosc_unikalnych_zamowien: 32,
          wartosc_produktow: '662.34',
          wartosc_zamowien: '4218.95',
          ilosc_zamowionych_w_promocji: 32,
          wartosc_produktow_w_promocji: '662.34',
          na_mag_i_zapas: 124,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 124
        },
        {
          tytul:
            'Pucio uczy się mówić. Zabawy dźwiękonaśladowcze dla najmłodszych',
          model: '9788310135971',
          ean: '9788310135971',
          ilosc_zamowionych: 27,
          ilosc_unikalnych_zamowien: 27,
          wartosc_produktow: '718.89',
          wartosc_zamowien: '3652.53',
          ilosc_zamowionych_w_promocji: 25,
          wartosc_produktow_w_promocji: '657.50',
          na_mag_i_zapas: 55,
          w_koszykach_z_zapasu: 0,
          w_kolejce: 0,
          onallmags: 55
        }
      ]
    }
    let report = await getReport(url, { method: 'post', body: reqBody })
    log(report)
    return report
  }
  
  async function getWholesaleBundleReport (models) {
    if (!cbaMachine) {
      return [
        {
          tytul: 'Empuzjon',
          model: '9788308075777',
          ean: '9788308075777',
          azymut_cost: '35.14',
          azymut_qty: 200,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '32.94',
          platon_qty: 100,
          dictum_cost: '33.50',
          dictum_qty: 282,
          ateneum_cost: '31.24',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '34.59',
          dressler_dublin_qty: 201,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '30.74',
          wyd_literackie_qty: 'D1',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 385
        },
        {
          tytul: 'Heartstopper. Tom 4',
          model: '9788382661156',
          ean: '9788382661156',
          azymut_cost: '28.30',
          azymut_qty: 100,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '22.45',
          platon_qty: 100,
          dictum_cost: '25.59',
          dictum_qty: 232,
          ateneum_cost: '23.44',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '22.72',
          lnl_qty: 4017,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '28.29',
          dressler_dublin_qty: 16,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 525
        },
        {
          tytul: 'Heartstopper. Tom 1',
          model: '9788382660074',
          ean: '9788382660074',
          azymut_cost: '25.14',
          azymut_qty: 90,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '19.95',
          platon_qty: 100,
          dictum_cost: '22.74',
          dictum_qty: 185,
          ateneum_cost: '20.83',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '20.19',
          lnl_qty: 13268,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '25.14',
          dressler_dublin_qty: 51,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 6,
          ilosc_unikalnych_zamowien: 6,
          na_mag_i_zapas: 818
        },
        {
          tytul: 'Heartstopper. Tom 3',
          model: '9788382660807',
          ean: '9788382660807',
          azymut_cost: '28.30',
          azymut_qty: 175,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '22.45',
          platon_qty: 41,
          dictum_cost: '25.59',
          dictum_qty: 267,
          ateneum_cost: '23.44',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '22.72',
          lnl_qty: 10829,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '28.29',
          dressler_dublin_qty: 201,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 113
        },
        {
          tytul: 'Heartstopper. Tom 2',
          model: '9788382660678',
          ean: '9788382660678',
          azymut_cost: '25.14',
          azymut_qty: 100,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '19.95',
          platon_qty: 66,
          dictum_cost: '22.74',
          dictum_qty: 86,
          ateneum_cost: '20.83',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '20.19',
          lnl_qty: 7067,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '25.14',
          dressler_dublin_qty: 101,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 4,
          ilosc_unikalnych_zamowien: 4,
          na_mag_i_zapas: 932
        },
        {
          tytul: 'Żadanica. Lipowo. Tom 14',
          model: '9788382950748',
          ean: '9788382950748',
          azymut_cost: '28.35',
          azymut_qty: 175,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '24.08',
          platon_qty: 100,
          dictum_cost: '25.65',
          dictum_qty: 127,
          ateneum_cost: '24.26',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '28.35',
          dressler_dublin_qty: 201,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 509
        },
        {
          tytul: 'All Of Your Flaws. Przypomnij mi naszą przeszłość',
          model: '9788328392670',
          ean: '9788328392670',
          azymut_cost: '27.04',
          azymut_qty: 'D0',
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '25.59',
          platon_qty: 'D0',
          dictum_cost: '26.04',
          dictum_qty: 3,
          ateneum_cost: '25.10',
          ateneum_qty: 331,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '28.28',
          dressler_dublin_qty: 151,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 286
        },
        {
          tytul: 'Gniewa',
          model: '9788396458292',
          ean: '9788396458292',
          azymut_cost: '26.95',
          azymut_qty: 100,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '26.99',
          platon_qty: 100,
          dictum_cost: '',
          dictum_qty: '',
          ateneum_cost: '',
          ateneum_qty: '',
          motyle_cost: '24.30',
          motyle_qty: 'D0',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '28.35',
          dressler_dublin_qty: 151,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 0
        },
        {
          tytul: 'It Ends with Us',
          model: '9788381351065',
          ean: '9788381351065',
          azymut_cost: '29.21',
          azymut_qty: 24,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '27.89',
          platon_qty: 5,
          dictum_cost: '33.19',
          dictum_qty: 'D0',
          ateneum_cost: '27.63',
          ateneum_qty: 2,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '',
          dressler_dublin_qty: '',
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 0
        },
        {
          tytul: 'Flaw(less). Opowiedz mi naszą historię',
          model: '9788328377431',
          ean: '9788328377431',
          azymut_cost: '24.03',
          azymut_qty: 175,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '22.34',
          platon_qty: 'D0',
          dictum_cost: '23.14',
          dictum_qty: 'D0',
          ateneum_cost: '22.29',
          ateneum_qty: 1,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '',
          dressler_dublin_qty: '',
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 0
        },
        {
          tytul: 'Czuła przewodniczka. Kobieca droga do siebie',
          model: '9788326836442',
          ean: '9788326836442',
          azymut_cost: '24.39',
          azymut_qty: 125,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '22.91',
          platon_qty: 100,
          dictum_cost: '23.99',
          dictum_qty: 23,
          ateneum_cost: '21.96',
          ateneum_qty: 857,
          motyle_cost: '26.00',
          motyle_qty: 9,
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '25.19',
          dressler_dublin_qty: 101,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 23,
          ilosc_unikalnych_zamowien: 22,
          na_mag_i_zapas: 25
        },
        {
          tytul: 'Kiedy ciało mówi nie. Koszty ukrytego stresu',
          model: '9788381437325',
          ean: '9788381437325',
          azymut_cost: '29.84',
          azymut_qty: 100,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '27.99',
          platon_qty: 100,
          dictum_cost: '49.99',
          dictum_qty: 65,
          ateneum_cost: '26.69',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '31.49',
          dressler_dublin_qty: 101,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 127
        },
        {
          tytul: 'Almond. Ten, który nie czuł ',
          model: '9788366967434',
          ean: '9788366967434',
          azymut_cost: '25.14',
          azymut_qty: 'D0',
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '20.75',
          platon_qty: 14,
          dictum_cost: '22.14',
          dictum_qty: 13,
          ateneum_cost: '20.75',
          ateneum_qty: 1,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '24.74',
          lnl_qty: 4,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '25.14',
          dressler_dublin_qty: 51,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 10,
          ilosc_unikalnych_zamowien: 10,
          na_mag_i_zapas: 124
        },
        {
          tytul: 'Obrazy z przeszłości',
          model: '9788381959865',
          ean: '9788381959865',
          azymut_cost: '27.30',
          azymut_qty: 200,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '25.24',
          platon_qty: 100,
          dictum_cost: '27.07',
          dictum_qty: 125,
          ateneum_cost: '25.34',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '25.15',
          lnl_qty: 49610,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '30.18',
          dressler_dublin_qty: 201,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 50
        },
        {
          tytul: 'Długa noc. Komisarz Jakub Mortka. Tom 6',
          model: '9788367262170',
          ean: '9788367262170',
          azymut_cost: '27.04',
          azymut_qty: 60,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '22.74',
          platon_qty: 100,
          dictum_cost: '24.45',
          dictum_qty: 257,
          ateneum_cost: '22.48',
          ateneum_qty: 1000,
          motyle_cost: '25.74',
          motyle_qty: 46,
          lnl_cost: '21.71',
          lnl_qty: 26143,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '27.03',
          dressler_dublin_qty: 201,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 156
        },
        {
          tytul: 'Gliniany most',
          model: '9788310134387',
          ean: '9788310134387',
          azymut_cost: '40.89',
          azymut_qty: 1,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '36.34',
          platon_qty: 'D0',
          dictum_cost: '',
          dictum_qty: '',
          ateneum_cost: '',
          ateneum_qty: '',
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '40.89',
          dressler_dublin_qty: 26,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 31,
          ilosc_unikalnych_zamowien: 29,
          na_mag_i_zapas: 106
        },
        {
          tytul: 'Mądre bajki',
          model: '9788375173864',
          ean: '9788375173864',
          azymut_cost: '12.50',
          azymut_qty: 'D0',
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '9.34',
          platon_qty: 3,
          dictum_cost: '11.01',
          dictum_qty: 1,
          ateneum_cost: '9.67',
          ateneum_qty: 350,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '',
          dressler_dublin_qty: '',
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 8,
          ilosc_unikalnych_zamowien: 8,
          na_mag_i_zapas: 125
        },
        {
          tytul: 'Reminders of Him. Cząstka ciebie, którą znam',
          model: '9788381351973',
          ean: '9788381351973',
          azymut_cost: '32.45',
          azymut_qty: 40,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '30.99',
          platon_qty: 100,
          dictum_cost: '36.89',
          dictum_qty: 21,
          ateneum_cost: '30.69',
          ateneum_qty: 382,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '31.49',
          dressler_dublin_qty: 101,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 82
        },
        {
          tytul: 'Potęga podświadomości',
          model: '9788381395199',
          ean: '9788381395199',
          azymut_cost: '20.63',
          azymut_qty: 3,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '22.43',
          platon_qty: 19,
          dictum_cost: '22.43',
          dictum_qty: 13,
          ateneum_cost: '18.21',
          ateneum_qty: 1000,
          motyle_cost: '19.44',
          motyle_qty: 16,
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '18.17',
          dressler_dublin_qty: 201,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 15,
          ilosc_unikalnych_zamowien: 15,
          na_mag_i_zapas: 44
        },
        {
          tytul: 'Start a Fire. Runda druga',
          model: '9788328388901',
          ean: '9788328388901',
          azymut_cost: '30.06',
          azymut_qty: 200,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '27.94',
          platon_qty: 100,
          dictum_cost: '28.94',
          dictum_qty: 403,
          ateneum_cost: '27.89',
          ateneum_qty: 161,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '30.44',
          lnl_qty: 16,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '31.44',
          dressler_dublin_qty: 201,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 183
        },
        {
          tytul: 'Dla mnie',
          model: '9788381414579',
          ean: '9788381414579',
          azymut_cost: '22.04',
          azymut_qty: 10,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '17.15',
          mtbiznes_qty: 5,
          platon_cost: '19.24',
          platon_qty: 'D0',
          dictum_cost: '19.41',
          dictum_qty: 'D0',
          ateneum_cost: '18.10',
          ateneum_qty: 'D0',
          motyle_cost: '22.40',
          motyle_qty: 15,
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '',
          dressler_dublin_qty: '',
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 0
        },
        {
          tytul: '11 papierowych serc',
          model: '9788367247054',
          ean: '9788367247054',
          azymut_cost: '25.14',
          azymut_qty: 12,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '20.75',
          platon_qty: 45,
          dictum_cost: '22.14',
          dictum_qty: 99,
          ateneum_cost: '20.75',
          ateneum_qty: 45,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '25.14',
          dressler_dublin_qty: 1,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 192
        },
        {
          tytul: 'Start a Fire. Runda pierwsza',
          model: '9788328380165',
          ean: '9788328380165',
          azymut_cost: '30.06',
          azymut_qty: 200,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '27.94',
          platon_qty: 100,
          dictum_cost: '28.94',
          dictum_qty: 719,
          ateneum_cost: '27.89',
          ateneum_qty: 529,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '31.43',
          dressler_dublin_qty: 26,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 36,
          ilosc_unikalnych_zamowien: 35,
          na_mag_i_zapas: 96
        },
        {
          tytul: 'Bogaty ojciec, biedny ojciec',
          model: '45109902295KS',
          ean: '9788392256144',
          azymut_cost: '21.42',
          azymut_qty: 9,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '21.84',
          platon_qty: 100,
          dictum_cost: '',
          dictum_qty: '',
          ateneum_cost: '18.61',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '',
          dressler_dublin_qty: '',
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 14,
          ilosc_unikalnych_zamowien: 14,
          na_mag_i_zapas: 37
        },
        {
          tytul: 'Gdzie śpiewają raki',
          model: '9788381392686',
          ean: '9788381392686',
          azymut_cost: '27.53',
          azymut_qty: 8,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '27.93',
          platon_qty: 23,
          dictum_cost: '29.93',
          dictum_qty: 9,
          ateneum_cost: '24.30',
          ateneum_qty: 538,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '24.24',
          dressler_dublin_qty: 201,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 0
        },
        {
          tytul: 'Czerwona ziemia',
          model: '9788328086333',
          ean: '9788328086333',
          azymut_cost: '36.79',
          azymut_qty: 90,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '32.19',
          platon_qty: 100,
          dictum_cost: '',
          dictum_qty: '',
          ateneum_cost: '39.09',
          ateneum_qty: 'D0',
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '',
          dressler_dublin_qty: '',
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 26
        },
        {
          tytul: 'Obiecałem ci gwiazdy',
          model: '9788396287823',
          ean: '9788396287823',
          azymut_cost: '27.04',
          azymut_qty: 3,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '25.74',
          platon_qty: 100,
          dictum_cost: '',
          dictum_qty: '',
          ateneum_cost: '23.57',
          ateneum_qty: 'D0',
          motyle_cost: '24.03',
          motyle_qty: 'D0',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '27.03',
          dressler_dublin_qty: 11,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 0
        },
        {
          tytul:
            'Pucio uczy się mówić. Zabawy dźwiękonaśladowcze dla najmłodszych',
          model: '9788310135971',
          ean: '9788310135971',
          azymut_cost: '28.29',
          azymut_qty: 70,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '25.14',
          platon_qty: 'D0',
          dictum_cost: '27.62',
          dictum_qty: 30,
          ateneum_cost: '24.65',
          ateneum_qty: 1000,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '26.94',
          dressler_dublin_qty: 76,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 9,
          ilosc_unikalnych_zamowien: 9,
          na_mag_i_zapas: 55
        },
        {
          tytul: 'Royal',
          model: '9788381788762',
          ean: '9788381788762',
          azymut_cost: '',
          azymut_qty: '',
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '20.95',
          platon_qty: 'D0',
          dictum_cost: '22.63',
          dictum_qty: 121,
          ateneum_cost: '23.01',
          ateneum_qty: 202,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '',
          lnl_qty: '',
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '26.40',
          dressler_dublin_qty: 6,
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 33
        },
        {
          tytul: 'Tego lata stałam się piękna. Lato. Tom 1',
          model: '9788367247061',
          ean: '9788367247061',
          azymut_cost: '25.14',
          azymut_qty: 30,
          kos_cost: '',
          kos_qty: '',
          mtbiznes_cost: '',
          mtbiznes_qty: '',
          platon_cost: '20.75',
          platon_qty: 100,
          dictum_cost: '22.14',
          dictum_qty: 3,
          ateneum_cost: '20.75',
          ateneum_qty: 59,
          motyle_cost: '',
          motyle_qty: '',
          lnl_cost: '21.95',
          lnl_qty: 47,
          egmont_cost: '',
          egmont_qty: '',
          wyd_dwie_siostry_cost: '',
          wyd_dwie_siostry_qty: '',
          mediarodzina_cost: '',
          mediarodzina_qty: '',
          niko_cost: '',
          niko_qty: '',
          morex_gm_cost: '',
          morex_gm_qty: '',
          wyd_sqn_cost: '',
          wyd_sqn_qty: '',
          troy_cost: '',
          troy_qty: '',
          poradnia_k_cost: '',
          poradnia_k_qty: '',
          sonia_draga_cost: '',
          sonia_draga_qty: '',
          ateneum_23_cost: '',
          ateneum_23_qty: '',
          dressler_dublin_cost: '',
          dressler_dublin_qty: '',
          copernicus_cost: '',
          copernicus_qty: '',
          aksjomat_cost: '',
          aksjomat_qty: '',
          wyd_literackie_cost: '',
          wyd_literackie_qty: '',
          mamania_cost: '',
          mamania_qty: '',
          rebis_cost: '',
          rebis_qty: '',
          wyd_literatura_cost: '',
          wyd_literatura_qty: '',
          fronda_cost: '',
          fronda_qty: '',
          edgard_outlet_cost: '',
          edgard_outlet_qty: '',
          burda_media_cost: '',
          burda_media_qty: '',
          debit_cost: '',
          debit_qty: '',
          harper_kids_cost: '',
          harper_kids_qty: '',
          ilosc_zamowionych: 0,
          ilosc_unikalnych_zamowien: 0,
          na_mag_i_zapas: 9
        }
      ]
    }
    let suppliersIds = '1'
    for (let i = 2; i <= 2000; i++) suppliersIds += `,${i}`
    let reqBody = new FormData()
    reqBody.append('lista_modeli', models.join('\r\n'))
    reqBody.append('dostawcy', suppliersIds)
    reqBody.append('data_od', '2022-01-01')
    reqBody.append('data_do', '2022-01-02')
    reqBody.append('sklep[]', '2')
    reqBody.append('csv', '0')
    let url = `https://cba.kierus.com.pl/?p=ShowSqlReport&r=ceny+i+stany+dostawcow+po+modelach`
  
    let report = await getReport(url, { method: 'post', body: reqBody })
    log(report)
    return report
  }
  
  async function getSaleReportForProduct (
    model = null,
    duration = null,
    delay = null
  ) {
    model = app.ctrl.cfg.model
    if (!model) return null
    if (delay === null) delay = app.rightPanel?.qs('.tomczuk-delay')?.value
    if (duration === null)
      duration = app.rightPanel?.qs('.tomczuk-duration')?.value
    if (!delay || !duration) return null
  
    delay = parseInt(delay)
    duration = parseInt(duration)
    if (duration < 1) duration = 1
  
    app.rightPanel.qs('.tomczuk-duration').value = duration
    if (app.rightPanel?.qs('label > input:checked')) {
      app.storage.set('saleReportDelay', delay)
      app.storage.set('saleReportDuration', duration)
    }
    let [startDate, endDate] = prepareDates(duration, delay)
    let box = app.rightPanel.container.primary.salesBox.container.qs(
      '.tomczuk-sale-report-container'
    )
    if (!box) {
      box = html('div', { classes: 'tomczuk-sale-report-container' })
    }
    app.rightPanel.container.primary.salesBox.container.append(box)
  
    let sellUrl = `https://cba.kierus.com.pl/?p=ShowSqlReport&r=ilosc+zamowionych+produktow+i+unikalnych+zamowien&lista_produktow=${model}&data_od=${startDate}&data_do=${endDate}&promo=&sklep=-1&source=-1&csv=0`
    let report = await getReport(sellUrl)
    if (report) report = report[0]
    else {
      box.innerText = 'Nie mogę pobrać raportu. Zaloguj się do CBA?'
      return null
    }
    box.innerHTML = ''
  
    box.innerHTML +=
      report.ilosc_zamowionych +
      ' szt. / ' +
      report.ilosc_unikalnych_zamowien +
      ' zam.<br>'
  
    box.innerHTML +=
      'Sprzedaż dzienna: <strong>' +
      String(
        parseFloat(parseInt(report.ilosc_zamowionych) / duration).toFixed(1)
      ).replace('.', ',') +
      '</strong><br>'
  
    box.innerHTML +=
      'Śr. cena sprz: <strong>' +
      String(
        (
          parseFloat(report.wartosc_produktow) /
          parseFloat(report.ilosc_zamowionych)
        ).toFixed(2)
      ).replace('.', ',') +
      '</strong> zł<br>'
  
    box.innerHTML += 'Stan: <strong>' + report.onallmags + '</strong><br>'
    //@todo: sprawdzić czy na_mag_i_zapas czy onallmags
    log('na_mag_i_zapas?', 1)
  
    box.innerHTML +=
      '<span style="color: red;">Zapas na <strong>' +
      parseFloat(
        report.onallmags /
          parseFloat(parseInt(report.ilosc_zamowionych) / duration).toFixed(1)
      ).toFixed(0) +
      '</strong> dni</span><br>'
    box.innerHTML +=
      '<span style="color:green;">Zapotrz. (' +
      duration +
      ' dni): <strong>' +
      parseInt(
        parseFloat(parseInt(report.ilosc_zamowionych) / duration).toFixed(1) *
          parseFloat(duration) -
          parseFloat(report.onallmags)
      ) +
      '</strong></span><br>'
    if (duration != '14')
      box.innerHTML +=
        '<span style="color:greenyellow;">Zapotrz. (14 dni): <strong>' +
        parseInt(
          parseFloat(parseInt(report.ilosc_zamowionych) / duration).toFixed(1) *
            14 -
            parseFloat(report.onallmags)
        ) +
        '</strong></span><br>'
  }
  
  function prepareDates (duration, delay) {
    let [startDate, endDate] = [new Date(), new Date()]
    startDate.setDate(startDate.getDate() - delay - duration)
    endDate.setDate(endDate.getDate() - delay)
    startDate = startDate.toLocaleDateString('fr-CA')
    endDate = endDate.toLocaleDateString('fr-CA')
    return [startDate, endDate]
  }
  
  function objToXls (obj) {
    let models = Object.keys(obj).filter(key => key !== 'keys')
  
    let string = 'model\t' + obj.keys.join('\t')
    for (let model of models) {
      string += `\n${model}`
      for (let key of obj.keys) {
        let value = obj[model][key]
        if (/^\d+\.\d+/.test(value)) value = value.replace('.', ',')
        string += `\t${value}`
      }
    }
    return string
  }
  
  async function fetchPageDOM (url, additionalOptions = null) {
    let finalOptions = { method: 'get', credentials: 'include', mode: 'cors' }
  
    if (additionalOptions) {
      for (property in additionalOptions) {
        finalOptions[property] = additionalOptions[property]
      }
    }
    let html = await fetch(url, finalOptions)
    let buffer = await html.arrayBuffer()
    let text = new TextDecoder('iso-8859-2').decode(buffer)
    let dom = new DOMParser().parseFromString(text, 'text/html')
    return dom
  }
  
  function qs (sel) {
    return document.querySelector(sel)
  }
  
  function qsa (sel) {
    return [...document.querySelectorAll(sel)]
  }
  
  function showGoUpBtn () {
    qs('.tomczuk-goup-btn')?.classList.toggle('tomczuk-hidden', !window.scrollY)
  }
  
  function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  function test (msg, error = 0, additionalPrint = null) {
    if (!testMode) return
  
    if (typeof msg === 'object') {
      msg = 'Tworzę obiekt: ' + Object.getPrototypeOf(msg).constructor.name
    }
    console.debug(`%c${msg}`, `color: ${error ? 'red' : 'yellowgreen'}`)
    if (additionalPrint) console.debug(additionalPrint)
  }
  
  function secFromStart (timestamp, logIt = true) {
    if (!timestamp) timestamp = Date.now()
    let time = ((timestamp - app.startUpTime) / 1000).toFixed(2) + 's'
    if (!logIt) return time
    log(time)
  }
  
  function printConsoleStartingMessage () {
    console.debug(
      '%cTomczukToolKit started at: ' +
        new Date(app.startUpTime).toLocaleTimeString(),
      'color:red;background:white;padding:20px;font-size:18px;weight:800;'
    )
  }
  
  async function init () {
    new App()
    printConsoleStartingMessage()
    if (!isDev()) useTomczukToolbarStyles()
    app.ctrl.native.redirectFromSearchPage()
    app.setInitListeners()
    app.getInvisibleBtn()
  }
  
  //START APP
  
  ;(async function boot () {
    if (!run) return
    if (window.location.href.match('opineo.pl/')) {
      log('OPINEO, KILLING SCRIPT...')
      return
    }
    await init()
    app.navBox()
    app.productBox()
    app.salesBox()
    await app.productListBox()
    log(app)
  })()
  