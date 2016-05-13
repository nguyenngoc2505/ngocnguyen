//= require jquery
//= require ./markdown/codemirror
//= require ./markdown/markdown
//= require ./markdown/overlay
//= require ./markdown/gfm
//= require ./markdown/ghostdown
//= require ./markdown/marked
//= require ./markdown/dropzone
//= require ./markdown/active-line
//= require ./markdown/closebrackets
//= require ./markdown/continuelist
//= require ./markdown/mark-selection
//= require ./markdown/inline-attachment
//= require ./markdown/codemirror.inline-attachment

(function($, CodeMirror) {
  "use strict";

  $(function() {

    if (!document.getElementById('entry-markdown'))
      return;

    var  editor = CodeMirror.fromTextArea(document.getElementById('entry-markdown'), {
        mode: {
          name: 'gfm',
          highlightFormatting: true
        },
        tabMode: 'indent',
        tabSize: 2,
        indentWithTabs: true,
        indentUnit: 1,
        lineWrapping: true,
        scrollbarStyle: 'null',
        styleActiveLine: true,
        autoCloseBrackets: true,
        styleSelectedText: true,
        theme: 'default',
        extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'}
    });

    var attachment_options = {
      uploadUrl: 'upload',
      uploadFieldName: 'file',
      jsonFieldName: 'path',
      progressText: '![Uploading image...]()'
    }

    inlineAttachment.editors.codemirror4.attach(editor, attachment_options);
    if (useLocalStorage()) {
      var storedValue = localStorage.getItem("markdown") || "";
      editor.setValue(storedValue);
    }

    editor.on('cursorActivity', function(){
      editor.save();
      if (useLocalStorage()) {
        saveToLocalStorage();
      }
    });

    // marked
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: false,
      smartypants: true,
      highlight: function (code) {
        return hljs.highlightAuto(code).value;
      }
    });

    // Really not the best way to do things as it includes Markdown formatting along with words
    function updateWordCount() {
      var wordCount = document.getElementsByClassName('entry-word-count')[0],
        editorValue = editor.getValue();

      if (editorValue.length) {
        wordCount.innerHTML = editorValue.match(/\S+/g).length + ' words';
      }
    }

    function updateImagePlaceholders(content) {
      var imgPlaceholders = $(document.getElementsByClassName('rendered-markdown')[0]).find('p').filter(function() {
        return (/^(?:\{<(.*?)>\})?!(?:\[([^\n\]]*)\])(?:\(([^\n\]]*)\))?$/gim).test($(this).text());
      });

      $(imgPlaceholders).each(function( index ) {

        var elemindex = index,
          self = $(this),
          altText = self.text();

        (function(){

          self.dropzone({
            url: uploadUrl(),
            success: function( file, response ){
              var holderP = $(file.previewElement).closest("p"),

                // Update the image path in markdown
                imgHolderMardown = $(".CodeMirror-code").find('pre').filter(function() {
                    return (/^(?:\{<(.*?)>\})?!(?:\[([^\n\]]*)\])(?:\(([^\n\]]*)\))?$/gim).test(self.text()) && (self.find("span").length === 0);
                }),

                // Get markdown
                editorOrigVal = editor.getValue(),
                nth = 0,
                newMarkdown = editorOrigVal.replace(/^(?:\{<(.*?)>\})?!(?:\[([^\n\]]*)\])(:\(([^\n\]]*)\))?$/gim, function (match, i, original){
                  nth++;
                  return (nth === (elemindex+1)) ? (match + "(" + response.path +")") : match;
                });
                editor.setValue( newMarkdown );
                $("textarea").val(editor.getValue());

              // Set image instead of placeholder
              holderP.removeClass("dropzone").html('<img src="'+ response.path +'"/>');
            }
          }).addClass("dropzone");
        }());
      })
    }

    function updatePreview() {
      var preview = document.getElementsByClassName('rendered-markdown')[0];
      preview.innerHTML = marked(editor.getValue());

      updateImagePlaceholders(preview.innerHTML);
      updateWordCount();
    }

    $(document).ready(function() {
      $('.entry-markdown header, .entry-preview header').click(function(e) {
        $('.entry-markdown, .entry-preview').removeClass('active');
        $(e.target).closest('section').addClass('active');
      });

      editor.on("change", function() {
        updatePreview();
      });

      updatePreview();

      // Sync scrolling
      function syncScroll(e) {
        // vars
        var $codeViewport = $(e.target),
          $previewViewport = $('.entry-preview-content'),
          $codeContent = $('.CodeMirror-sizer'),
          $previewContent = $('.rendered-markdown'),

          // calc position
          codeHeight = $codeContent.height() - $codeViewport.height(),
          previewHeight = $previewContent.height() - $previewViewport.height(),
          ratio = previewHeight / codeHeight,
          previewPostition = $codeViewport.scrollTop() * ratio;

        // apply new scroll
        $previewViewport.scrollTop(previewPostition);
      }

      // TODO: Debounce
      $('.CodeMirror-scroll').on('scroll', syncScroll);

      // Shadow on Markdown if scrolled
      $('.CodeMirror-scroll').scroll(function() {
        if ($('.CodeMirror-scroll').scrollTop() > 10) {
          $('.entry-markdown').addClass('scrolling');
        } else {
          $('.entry-markdown').removeClass('scrolling');
        }
      });
      // Shadow on Preview if scrolled
      $('.entry-preview-content').scroll(function() {
        if ($('.entry-preview-content').scrollTop() > 10) {
          $('.entry-preview').addClass('scrolling');
        } else {
          $('.entry-preview').removeClass('scrolling');
        }
      });

    });
  });
}(jQuery, CodeMirror));
