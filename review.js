/* Только для статичного показа на GitHub Pages. Боевая версия использует React и Payload. */
(() => {
  const data = JSON.parse(document.getElementById('review-data').textContent)
  const page = data.byPath[data.path] || {}
  const $ = (s, root = document) => root.querySelector(s)
  const $$ = (s, root = document) => [...root.querySelectorAll(s)]
  const on = (s, event, fn) => $$(s).forEach(el => el.addEventListener(event, e => fn(el, e)))
  const image = (src, alt) => { const img = document.createElement('img'); img.src = src; img.alt = alt; img.loading = 'lazy'; return img }
  $$('a[href*="/downloads/"]').forEach(a => { const d = data.downloads[a.getAttribute('href').split('/').pop()]; if (d) { a.href = d.url; a.download = d.filename } })
  on('.burger', 'click', el => { const open = $('.m-menu').classList.toggle('open'); el.setAttribute('aria-expanded', String(open)) })
  on('.cbox .cta', 'click', el => { const open = $('.cmenu').classList.toggle('open'); el.setAttribute('aria-expanded', String(open)) })
  const openChat = (message = '') => { $('.chat-pop').classList.add('open'); const input = $('.ch-form input'); input.value = message; input.focus() }
  on('[data-open-chat], .chat', 'click', el => openChat(el.dataset.chatMessage || ''))
  on('.ch-close', 'click', () => $('.chat-pop').classList.remove('open'))
  on('.ch-preset', 'click', el => { $('.ch-form input').value = el.textContent; $('.ch-form input').focus() })
  const demoText = 'Это показ сайта. Для отправки сообщения напишите нам в Telegram: @grechishkino_agency.'
  on('form', 'submit', (el, event) => {
    event.preventDefault()
    let status = $('.review-form-status', el)
    if (!status) { status = document.createElement('p'); status.className = 'review-form-status'; status.setAttribute('role', 'status'); status.style.cssText = 'padding:12px;color:var(--wine);font-size:13px;line-height:1.5'; el.append(status) }
    status.textContent = demoText
  })
  const lightbox = (photos, start) => {
    if (!photos.length) return
    const dialog = document.createElement('dialog')
    dialog.className = 'photo-lightbox'
    dialog.setAttribute('aria-label', 'Просмотр фотографий')
    let index = start
    const previousFocus = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const close = () => { dialog.close(); dialog.remove(); document.body.style.overflow = overflow; previousFocus?.focus() }
    const button = (label, svg, action) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', label); b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${svg}"/></svg>`; b.onclick = action; return b }
    const closeButton = button('Закрыть фотографии', 'm5 5 14 14M19 5 5 19', close); closeButton.className = 'photo-close'
    const stage = document.createElement('div'); stage.className = 'photo-stage'
    const img = image('', ''); img.loading = 'eager'; stage.append(img)
    const tools = document.createElement('div'); tools.className = 'photo-tools'
    const count = document.createElement('span'); count.setAttribute('aria-live', 'polite')
    const download = document.createElement('a'); download.textContent = 'Скачать оригинал'
    const update = () => { const p = photos[index]; img.src = p.full; img.alt = p.alt; count.textContent = `${index + 1} / ${photos.length}`; download.href = p.download || p.full; download.download = p.filename || '' }
    const go = step => { index = (index + step + photos.length) % photos.length; update() }
    if (photos.length > 1) tools.append(button('Предыдущее фото', 'm15 18-6-6 6-6', () => go(-1)), count, button('Следующее фото', 'm9 18 6-6-6-6', () => go(1)))
    tools.append(download); dialog.append(closeButton, stage, tools)
    dialog.oncancel = e => { e.preventDefault(); close() }
    dialog.onkeydown = e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) } }
    let startX = null
    stage.ontouchstart = e => { startX = e.changedTouches[0].clientX }
    stage.ontouchend = e => { if (startX !== null && Math.abs(e.changedTouches[0].clientX - startX) > 50) go(e.changedTouches[0].clientX < startX ? 1 : -1); startX = null }
    document.body.append(dialog); update(); dialog.showModal(); closeButton.focus()
  }
  on('.profile-gallery .photo-thumb', 'click', el => lightbox(page.photos || [], $$('.profile-gallery .photo-thumb').indexOf(el)))
  let photoCount = $$('.profile-gallery .photo-thumb').length
  on('.gallery-more button', 'click', el => {
    const next = (page.photos || []).slice(photoCount, photoCount + 12)
    next.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'photo-thumb'; b.setAttribute('aria-label', `Открыть фото ${photoCount + i + 1}`); b.append(image(p.src, p.alt)); const index = photoCount + i; b.onclick = () => lightbox(page.photos, index); $('.profile-gallery .gallery').append(b) })
    photoCount += next.length
    const left = page.photos.length - photoCount
    if (left <= 0) el.remove(); else el.textContent = `Показать еще ${Math.min(left, 12)} фото`
  })
  on('.article-photos .photo-thumb', 'click', el => lightbox(page.photos || [], $$('.article-photos .photo-thumb').indexOf(el)))
  let poster = page.films?.find(Boolean) || page.photos?.[0]
  on('.film-poster', 'click', () => { if (poster) lightbox([poster], 0) })
  on('.film-row', 'mouseenter', el => { const p = page.films?.[$$('.film-row').indexOf(el)]; if (!p) return; poster = p; $('.film-poster img').src = p.full; $('.film-poster img').alt = p.alt; const cap = $('.film-preview p'); if (cap) cap.textContent = p.alt })
  on('.film-row', 'focus', el => el.dispatchEvent(new MouseEvent('mouseenter')))
  on('.film-toggle', 'click', el => { const open = $('.film-list').classList.toggle('open'); el.dataset.original ||= el.textContent; el.textContent = open ? 'Свернуть' : el.dataset.original })
  let video = 0
  const chooseVideo = () => {
    const v = page.videos?.[video]; if (!v) return
    const current = $('.profile-video .vmain'); if (!current) return
    const a = document.createElement('a'); a.className = 'vmain'; a.href = v.url
    if (v.thumb) a.style.backgroundImage = `linear-gradient(180deg,rgba(20,20,20,.02),rgba(20,20,20,.7)),url('${v.thumb}')`
    a.innerHTML = '<span class="shade"></span><span class="play"></span><span class="cap"><b></b><span></span></span>'
    $('b', a).textContent = v.title; $('.cap > span', a).textContent = v.duration || ''
    a.onclick = e => { if (!v.embed) return; e.preventDefault(); const frame = document.createElement('iframe'); frame.src = v.embed; frame.title = v.title; frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture'; frame.allowFullscreen = true; const holder = document.createElement('div'); holder.className = 'vmain is-playing'; holder.append(frame); a.replaceWith(holder) }
    current.replaceWith(a)
    $$('.video-choice').forEach((b, i) => { b.classList.toggle('on', i === video); b.setAttribute('aria-pressed', String(i === video)) })
  }
  if (page.videos?.length) { const initial = Number(new URLSearchParams(location.search).get('video')) - 1; if (initial >= 0 && initial < page.videos.length) video = initial; chooseVideo() }
  on('.video-choice', 'click', el => { video = $$('.video-choice').indexOf(el); chooseVideo() })
  on('.video-share', 'click', async el => { const u = new URL(location.href); u.searchParams.set('video', String(video + 1)); u.hash = 'video'; try { await navigator.clipboard.writeText(u.href); $('span', el).textContent = 'Ссылка скопирована' } catch { $('.share-status').textContent = 'Скопируйте адрес страницы из браузера.' } })
  on('.profile-jump-nav a', 'click', el => { $$('.profile-jump-nav a').forEach(a => a.removeAttribute('aria-current')); el.setAttribute('aria-current', 'location') })
  const range = (value, label) => label === 'Любой' || (value != null && (label.startsWith('До ') ? value <= Number(label.slice(3)) : label.startsWith('Выше ') ? value > Number(label.slice(6)) : label.endsWith('+') ? value >= Number(label.slice(0, -1)) : value >= Number(label.split('-')[0]) && value <= Number(label.split('-')[1])))
  const filter = () => {
    const rows = $$('.filters .frow'); if (!rows.length) return
    const section = $('.on', rows[0])?.textContent || 'Все', age = $('.on', rows[1])?.textContent || 'Любой', height = $('.on', rows[2])?.textContent || 'Любой'
    let shown = 0
    $$('.roster .acard').forEach(el => { const a = data.actors.find(a => new URL(el.href).pathname.replace(data.base, '').replace(/\/$/, '') === a.path); const visible = a && (section === 'Все' || section === 'Мужчины' && a.category === 'actors' || section === 'Женщины' && a.category === 'actresses' || section === 'Новые лица' && a.fresh) && range(a.age, age) && range(a.height, height); el.classList.toggle('hide', !visible); if (visible) shown++ })
    $('.empty')?.classList.toggle('show', shown === 0)
  }
  on('.fchip', 'click', el => { $$('.fchip', el.closest('.frow')).forEach(b => b.classList.remove('on')); el.classList.add('on'); filter() })
  on('.freset, .empty a[href="#"]', 'click', (_el, e) => { e.preventDefault(); $$('.filters .frow').forEach(row => { $$('.fchip', row).forEach((b, i) => b.classList.toggle('on', i === 0)) }); filter() })
  const actor = new URLSearchParams(location.search).get('actor')
  if (data.path === '/news' && actor) $$('.newsgrid .ncard').forEach(el => { const n = data.news.find(n => new URL(el.href).pathname.replace(data.base, '').replace(/\/$/, '') === n.path); el.hidden = !n?.actors.includes(actor) })
  on('.to-top', 'click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
  window.addEventListener('scroll', () => { $('.to-top')?.classList.toggle('on', scrollY > innerHeight) }, { passive: true })
})()
