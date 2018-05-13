kbCodeSnippet();

colorKibibitTitles();

function colorKibibitTitles() {
  $('h1, h2, h3, h4, h4').each(( index ) => {
    const content = $( this ).html().replace('kibibit', [
      'k',
      '<span class="kb-red">i</span>',
      'b',
      '<span class="kb-blue">i</span>',
      'b',
      '<span class="kb-yellow">i</span>',
      't'
    ].join(''));

    $( this ).html(content);
  });
}

function kbCodeSnippet() {
    $('.highlighter-rouge').each(function (i, block) {
      const codeElement = $(block);
      const lang = (_.find(block.classList, classIsLanguage) || '').replace('language-', '');
      
      const innerCode = codeElement.find('pre code').addClass(lang)[0];
        
        if (innerCode) {
          // hightlight code (auto detect if needed)
          hljs.highlightBlock(innerCode);
        }
    });
  }

// hljs.initHighlightingOnLoad();

function classIsLanguage(className) {
  return className.startsWith('language-');
}
