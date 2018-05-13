kbCodeSnippet();

function kbCodeSnippet() {
    $('.highlighter-rouge').each(function (i, block) {
      const codeElement = $(block);
      const lang = (_.find(block.classList, classIsLanguage) || '').replace('language-', '');
      
      const innerCode = codeElement.find('code').addClass(lang)[0];
  
      // hightlight code (auto detect if needed)
      hljs.highlightBlock(innerCode);
    });
  }

// hljs.initHighlightingOnLoad();

function classIsLanguage(className) {
    return className.startsWith('language-');
}