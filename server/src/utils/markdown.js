const { marked } = require('marked');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

marked.setOptions({
  breaks: true,
  gfm: true,
});

const renderMarkdown = (markdown = '') => {
  const rawHtml = marked.parse(markdown || '');
  return DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });
};

module.exports = { renderMarkdown };
