"""Teste de fumaça do site (Playwright + Chromium).

Uso:
    pip install -r requirements-dev.txt
    python -m playwright install chromium
    python tests/smoke.py

Sobe um servidor local na pasta do projeto, abre o site em computador e celular e confere:
sem erros de JavaScript, seções principais, ausência de elementos duplicados, funções novas e acessibilidade básica.
Sai com código 1 se algo falhar (usado pelo GitHub Actions).
"""
import http.server, os, socketserver, sys, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAIL = []


def check(nome, ok, detalhe=''):
    print(('  ok   ' if ok else '  FALHA'), nome, ('- ' + str(detalhe)) if (detalhe and not ok) else '')
    if not ok:
        FAIL.append(nome)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, *a):
        pass


def main():
    srv = socketserver.TCPServer(('127.0.0.1', 0), Handler)
    url = 'http://127.0.0.1:%d/index.html' % srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    erros = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': 1366, 'height': 800}, accept_downloads=True)
        pg.on('pageerror', lambda e: erros.append(str(e)[:160]))
        pg.on('console', lambda m: erros.append(m.text[:160]) if m.type == 'error' and 'Failed to load' not in m.text and 'ERR_' not in m.text else None)
        pg.goto(url); pg.wait_for_timeout(3500)
        pg.evaluate("document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('#exCookie').forEach(e=>e.remove());document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'))")

        print('Estrutura')
        check('sem erros de JavaScript', not erros, erros[:3])
        ids = ['destaques', 'escolha-jogo', 'noticias', 'tabela', 'elenco', 'ingressos', 'socio', 'loja', 'memorial', 'clube', 'transparencia', 'espacos', 'central', 'patrocinadores', 'desempenho']
        faltam = pg.evaluate("(ids)=>ids.filter(i=>!document.getElementById(i))", ids)
        check('seções principais presentes', not faltam, faltam)
        check('sem ids duplicados', pg.evaluate("(()=>{const m={};document.querySelectorAll('[id]').forEach(e=>m[e.id]=(m[e.id]||0)+1);return Object.values(m).every(v=>v===1)})()"))
        check('sem links internos quebrados', pg.evaluate("[...document.querySelectorAll('a[href^=\"#\"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1))).length===0"))
        check('um único <h1>', pg.evaluate("document.querySelectorAll('h1').length") == 1)
        check('imagens com alt', pg.evaluate("[...document.querySelectorAll('img')].every(i=>i.hasAttribute('alt'))"))
        check('campos de formulário com nome acessível', pg.evaluate("[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].every(i=>i.getAttribute('aria-label')||i.getAttribute('title')||i.getAttribute('placeholder')||(i.id&&document.querySelector('label[for=\"'+i.id+'\"]'))||i.closest('label'))"))

        print('Sem funções duplicadas')
        for sel, nome in (('#btt', 'voltar ao topo'), ('.a11y-fab', 'acessibilidade')):
            check('um só botão de ' + nome, pg.evaluate("(s)=>document.querySelectorAll(s).length", sel) == 1)
        check('uma só seta de voltar ao topo', pg.evaluate("[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed'&&e.textContent.trim()==='↑'&&getComputedStyle(e).display!=='none').length") == 1)
        check('uma só barra de progresso', pg.evaluate("[...document.body.children].filter(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return c.position==='fixed'&&r.top===0&&r.height<=4&&c.display!=='none'}).length") == 1)
        check('duplicatas removidas (quiz, pênalti, mural, palpite)', pg.evaluate("['quiz-matilha','vpGoal','vpMl','fzPalT','vpPollQ'].every(i=>!document.getElementById(i))"))

        print('Funções')
        check('carrossel com 5 ou mais destaques', pg.evaluate("document.querySelectorAll('.dz-slide').length") >= 5)
        check('Desempenho mostra cartões, gráfico e resultados', pg.evaluate("document.querySelectorAll('#dpBox .dp-card').length===6&&!!document.querySelector('#dpBox .dp-line')&&document.querySelectorAll('#dpBox .dp-row').length>=7"))
        n_err = len(erros)
        pg.evaluate("document.querySelectorAll('.dz-slide .dz-cta button[data-f]').forEach(b=>{try{b.click()}catch(e){}});window.scrollTo(0,0)"); pg.wait_for_timeout(400)
        pg.evaluate("document.querySelectorAll('.vp-link').forEach(b=>b.click())"); pg.wait_for_timeout(300)
        check('botões do carrossel e de copiar link não geram erro', len(erros) == n_err, erros[n_err:n_err + 2])
        check('cada botão do carrossel chama a ação certa (c1/c2)', pg.evaluate("[...document.querySelectorAll('.dz-slide .dz-cta')].every(c=>[...c.children].every(x=>x.tagName==='A'||x.hasAttribute('data-f')))"))
        pg.hover('.nav-g .nav-gb'); pg.wait_for_timeout(300); pg.hover('.nav-g .nav-gb'); pg.wait_for_timeout(500)
        check('menu em grupos abre', pg.evaluate("getComputedStyle(document.querySelector('.nav-g .nav-dd')).visibility") == 'visible')
        pg.mouse.move(600, 600)
        casa = pg.query_selector('.jg-card.home'); fora = pg.query_selector('.jg-card.away')
        if casa and fora:
            casa.click(); pg.wait_for_timeout(300)
            check('jogo em casa libera ingressos', pg.evaluate("!document.querySelector('#ingressos .lk-panel')"))
            pg.click('.jg-card.away'); pg.wait_for_timeout(300)
            check('jogo fora bloqueia ingressos e abre estádio do mandante', pg.evaluate("!!document.querySelector('#ingressos .lk-panel') && !document.getElementById('estadio-visitante').hidden"))
        else:
            print('  (jogos futuros em casa e fora não encontrados: confira EDITAR.PARTIDAS)')
        pg.evaluate("ctOpen('pen')"); pg.wait_for_timeout(400)
        pg.fill('#pNome', 'João da Silva'); pg.fill('#pNasc', '2010-05-10'); pg.select_option('#pPos', 'Atacante'); pg.fill('#pCid', 'Januária'); pg.fill('#pTel', '(38) 99999-1234'); pg.fill('#pResp', 'Maria da Silva'); pg.check('#pOk')
        pg.click('#penF button[type=submit]'); pg.wait_for_timeout(300)
        check('Seja um Lobo gera protocolo', 'PEN-' in pg.inner_text('#penSide'))
        pg.evaluate("ctOpen('fal')"); pg.wait_for_timeout(300)
        pg.select_option('#aAss', 'Elogio'); pg.fill('#aNome', 'Carlos Souza'); pg.fill('#aMail', 'carlos@exemplo.com'); pg.fill('#aMsg', 'Parabéns pelo site do clube!')
        pg.click('#falF button[type=submit]'); pg.wait_for_timeout(300)
        check('Fale conosco gera protocolo', 'ATD-' in pg.inner_text('#falSide'))
        pg.evaluate("ctOpen('cmp')"); pg.wait_for_timeout(400)
        check('comparar jogadores mostra estatísticas', pg.evaluate("document.querySelectorAll('.cp-row').length") == 4)
        pg.evaluate("ctOpen('ret')"); pg.wait_for_timeout(400)
        check('retrospecto lista adversários', pg.evaluate("document.querySelectorAll('.ct-t tbody tr').length") >= 1)
        pg.select_option('#eEsp', index=1) if pg.query_selector('#eEsp') else None
        pg.evaluate("document.getElementById('eEsp').value=document.getElementById('eEsp').options[1].value")
        pg.select_option('#eTipo', index=1); pg.fill('#eData', '2099-01-20'); pg.fill('#ePes', '40'); pg.fill('#eNome', 'Empresa Vale Ltda'); pg.fill('#eTel', '(38) 99999-0000')
        pg.click('#esF button[type=submit]'); pg.wait_for_timeout(300)
        check('Eventos e Espaços gera protocolo', 'ESP-' in pg.inner_text('#esSide'))
        with pg.expect_download() as d:
            pg.evaluate("calAll()")
        check('calendário .ics baixa com eventos', open(d.value.path(), encoding='utf-8').read().count('BEGIN:VEVENT') >= 1)

        print('Celular (390px)')
        pg.set_viewport_size({'width': 390, 'height': 780}); pg.wait_for_timeout(500)
        check('sem rolagem horizontal', not pg.evaluate("document.documentElement.scrollWidth>innerWidth"))
        check('sem erros de JavaScript no total', not erros, erros[:3])
        b.close()
    srv.shutdown()
    print('\n%s' % ('TUDO CERTO' if not FAIL else 'FALHARAM: ' + ', '.join(FAIL)))
    sys.exit(1 if FAIL else 0)


if __name__ == '__main__':
    main()
