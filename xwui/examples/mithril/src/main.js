import m from 'mithril';

function App() {
  return {
    view: () =>
      m(
        'div',
        { style: 'font-family: system-ui, sans-serif; padding: 2rem;' },
        [
          m('h1', 'XWUI + Mithril'),
          m('p', 'XWUIButton (Custom Element) – Mithril view.'),
          m('p', m('a', { href: '/uber/uber.html' }, 'Uber-like mobile demo →')),
          m(
            'div',
            {
              style: 'display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem;',
            },
            [
              m('xwui-button', { text: 'Primary', variant: 'primary', size: 'medium' }),
              m('xwui-button', { text: 'Success', variant: 'success', size: 'medium' }),
              m('xwui-button', { text: 'Secondary', variant: 'secondary', size: 'medium' }),
            ]
          ),
        ]
      ),
  };
}

m.mount(document.getElementById('root'), App);
